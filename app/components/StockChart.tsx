import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData } from 'lightweight-charts';
import { stockAPI } from '../services/api';

interface StockChartProps {
  symbol: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function StockChart({ symbol, containerRef }: StockChartProps) {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'line'> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create chart
    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: '#0A1929' },
        textColor: '#D3D3D3',
      },
      grid: {
        vertLines: { color: '#1F2937' },
        horzLines: { color: '#1F2937' },
      },
      width: containerRef.current.clientWidth,
      height: 400,
    });

    // Create line series
    const lineSeries = chart.addLineSeries({
      color: '#3B82F6',
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    // Fetch historical data
    const fetchData = async () => {
      try {
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - 30 * 24 * 60 * 60; // 30 days ago

        const candleData = await stockAPI.getCandles(symbol, 'D', startDate, endDate);
        
        const lineData: LineData[] = candleData.t.map((timestamp, index) => ({
          time: timestamp,
          value: candleData.c[index],
        }));

        lineSeries.setData(lineData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol]);

  return <div ref={containerRef} className="w-full h-[400px]" />;
} 