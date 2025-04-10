export type SectorType = 
  | 'Technology'
  | 'Finance'
  | 'Healthcare'
  | 'Consumer'
  | 'Industrial'
  | 'Energy'
  | 'Materials'
  | 'Utilities'
  | 'Real Estate'
  | 'Communication';

export interface MarketData {
  symbol: string;
  name: string;
  sector: SectorType;
  price: number;
  minimumPrice: number;
  change: number;
  changePercent: number;
  region?: string;  // Added for global stocks
  exchange?: string; // Added for global stocks
}

// Base prices for major stocks (as of recent market prices)
const basePrices: Record<string, number> = {
  // Utilities Sector
  NEE: 57.20,     // NextEra Energy
  DUK: 94.80,     // Duke Energy
  SO: 68.50,      // Southern Company
  D: 47.30,       // Dominion Energy
  AEP: 82.40,     // American Electric Power
  XEL: 61.30,     // Xcel Energy
  EXC: 35.80,     // Exelon Corporation
  SRE: 72.90,     // Sempra Energy
  ED: 89.60,      // Consolidated Edison
  PCG: 16.80,     // PG&E Corporation

  // US Technology
  AAPL: 169.00,   // Apple
  MSFT: 425.00,   // Microsoft
  GOOGL: 147.00,  // Alphabet
  AMZN: 178.00,   // Amazon
  NVDA: 880.00,   // NVIDIA
  META: 500.00,   // Meta
  TSM: 140.00,    // TSMC
  ASML: 960.00,   // ASML
  AVGO: 1280.00,  // Broadcom
  CRM: 307.00,    // Salesforce
  AMD: 180.00,    // AMD
  INTC: 44.00,    // Intel
  SAP: 190.00,    // SAP SE
  ADBE: 580.00,   // Adobe
  ORCL: 125.00,   // Oracle

  // Asian Technology
  BABA: 73.50,    // Alibaba
  SE: 51.00,      // Sea Limited
  BIDU: 105.00,   // Baidu
  NIO: 5.20,      // NIO
  9988: 73.50,    // Alibaba (HK)
  3690: 105.00,   // Meituan
  9999: 15.80,    // NetEase
  6098: 42.00,    // CTrip
  
  // Global Finance
  JPM: 185.00,    // JPMorgan
  V: 275.00,      // Visa
  MA: 475.00,     // Mastercard
  HSBC: 39.00,    // HSBC
  UBS: 32.00,     // UBS
  BCS: 8.50,      // Barclays
  RY: 98.00,      // Royal Bank of Canada
  TD: 60.00,      // Toronto-Dominion
  MUFG: 9.50,     // Mitsubishi UFJ
  KB: 38.00,      // KB Financial
  ITUB: 6.80,     // Itau Unibanco
  SAN: 4.20,      // Banco Santander
  DBK: 13.00,     // Deutsche Bank
  BNP: 63.00,     // BNP Paribas
  CS: 0.89,       // Credit Suisse
  BBVA: 9.50,     // BBVA
  ING: 14.80,     // ING Group
  
  // Global Healthcare
  JNJ: 158.00,    // Johnson & Johnson
  LLY: 770.00,    // Eli Lilly
  NVO: 125.00,    // Novo Nordisk
  PFE: 27.00,     // Pfizer
  TAK: 14.50,     // Takeda
  ROG: 238.00,    // Roche
  GSK: 42.00,     // GSK
  SNY: 47.00,     // Sanofi
  AZN: 65.00,     // AstraZeneca
  NOVN: 86.00,    // Novartis
  BAYRY: 31.00,   // Bayer
  RHHBY: 35.00,   // Roche Holding
  
  // Global Consumer
  PG: 160.00,     // Procter & Gamble Co.
  KO: 60.00,      // Coca-Cola
  PEP: 168.00,    // PepsiCo Inc.
  NSRGY: 118.00,  // Nestlé S.A.
  TCEHY: 37.00,   // Tencent Holdings Ltd.
  LVMUY: 165.00,  // LVMH Moët Hennessy
  NKE: 98.00,     // Nike Inc.
  MCD: 285.00,    // McDonald's Corporation
  SBUX: 92.00,    // Starbucks Corporation
  TM: 185.00,     // Toyota
  ADDYY: 190.00,  // adidas AG
  HESAY: 102.00,  // Hermès International
  PPRUY: 140.00,  // Kering SA
  IDEXY: 19.00,   // Industria de Diseño Textil
  
  // Global Industrial & Auto
  CAT: 345.00,    // Caterpillar Inc.
  BA: 205.00,     // Boeing Company
  HON: 198.00,    // Honeywell International
  ABB: 44.00,     // ABB Ltd
  SIE: 180.00,    // Siemens AG
  MMM: 105.00,    // 3M Company
  GE: 155.00,     // General Electric Co.
  DHR: 250.00,    // Danaher Corporation
  EMR: 95.00,     // Emerson Electric Co.
  TEL: 140.00,    // TE Connectivity Ltd.
  VWAGY: 15.00,   // Volkswagen AG
  BMWYY: 37.00,   // BMW AG
  DMLRY: 85.00,   // Mercedes-Benz Group
  HMC: 35.00,     // Honda Motor Co.
  
  // Global Energy
  XOM: 108.00,    // Exxon Mobil Corp.
  CVX: 152.00,    // Chevron Corporation
  SHEL: 65.00,    // Shell plc
  TTE: 65.00,     // TotalEnergies SE
  BP: 35.00,      // BP p.l.c.
  ENI: 15.00,     // Eni S.p.A.
  EQNR: 28.00,    // Equinor ASA
  PTR: 48.00,     // PetroChina Company
  SNP: 45.00,     // China Petroleum
  EC: 12.00,      // Ecopetrol S.A.
  
  // Global Materials & Mining
  BHP: 63.00,     // BHP Group Limited
  RIO: 65.00,     // Rio Tinto Group
  VALE: 13.00,    // Vale S.A.
  MT: 28.00,      // ArcelorMittal
  PKX: 72.00,     // POSCO Holdings
  ACH: 8.50,      // Aluminum Corporation of China
  SQM: 47.00,     // Sociedad Química y Minera
  
  // Global Telecom
  T: 17.00,       // AT&T Inc.
  VZ: 40.00,      // Verizon Communications
  ORAN: 11.50,    // Orange S.A.
  TEF: 4.20,      // Telefónica, S.A.
  DCM: 12.80,     // NTT DOCOMO, Inc.
  CHU: 8.90,      // China Unicom
  SKM: 21.00,     // SK Telecom Co.

  // Additional European Stocks
  AIR: 142.00,    // Airbus SE
  BASFY: 48.00,   // BASF SE
  DGEAF: 168.00,  // Diageo plc
  UNIFY: 14.00,   // Unify Software
  DANOY: 12.50,   // Danone S.A.
  RDSMY: 45.00,   // DSM N.V.
  ALIZY: 25.00,   // Allianz SE
  AXAHY: 31.00,   // AXA SA
  BNPQY: 35.00,   // BNP Paribas
  CRARY: 12.00,   // Credit Agricole
  SCGLY: 11.00,   // Societe Generale
  ESLOY: 380.00,  // EssilorLuxottica
  LRLCY: 440.00,  // L'Oreal SA
  CABGY: 65.00,   // Anheuser-Busch InBev
  PROSY: 95.00,   // Prosus N.V.
  PHIA: 22.00,    // Philips
  UNFCY: 52.00,   // Unilever PLC
  VOLVF: 25.00,   // Volvo AB
  ERICB: 6.00,    // Ericsson
  NOKBF: 3.50,    // Nokia Oyj
  ATLKY: 42.00,   // Atlas Copco
  SWDBY: 11.00,   // Swedbank
  DNBBY: 19.00,   // DNB Bank
  NRDBY: 12.00,   // Nordea Bank

  // Additional Asian Stocks
  "9432": 42.00,    // Nippon Telegraph
  "9433": 18.00,    // KDDI Corporation
  "9984": 65.00,    // SoftBank Group
  "6758": 85.00,    // Sony Group
  "7203": 24.00,    // Toyota Motor
  "7267": 32.00,    // Honda Motor
  "7974": 55.00,    // Nintendo
  "8306": 7.00,     // Mitsubishi UFJ
  "8316": 5.00,     // Sumitomo Mitsui
  "8411": 4.50,     // Mizuho Financial
  "005930": 70.00,  // Samsung Electronics
  "000660": 120.00, // SK Hynix
  "035420": 340.00, // NAVER
  "035720": 230.00, // Kakao
  "005380": 45.00,  // Hyundai Motor
  "051910": 85.00,  // LG Chem
  "006400": 55.00,  // Samsung SDI
  "2330": 18.00,    // TSMC
  "2454": 25.00,    // MediaTek
  "1299": 9.50,     // AIA Group
  "0700": 42.00,    // Tencent Holdings
  "0941": 5.50,     // China Mobile
  "1398": 0.60,     // ICBC
  "3988": 0.45,     // Bank of China
  "2318": 8.00,     // Ping An Insurance

  // Additional African Stocks
  NPSNY: 9.50,    // Naspers Limited
  AAUKF: 15.00,   // Anglo American plc
  SGBLY: 12.00,   // Standard Bank Group
  FRGGY: 45.00,   // FirstRand Limited
  MTNOY: 8.00,    // MTN Group Limited
  VDMCY: 11.00,   // Vodacom Group
  SPPJY: 9.00,    // Shoprite Holdings
  AAGIY: 4.50,    // Anglo American Platinum
  IMPUY: 12.00,   // Impala Platinum
  AFLYY: 1.20,    // Air France-KLM
  CMCLY: 3.50,    // Commercial International Bank
  EGIEY: 2.80,    // EFG Hermes
  ORAGY: 0.45,    // Orange Egypt
  SVKEF: 5.00,    // Safaricom
  EQBNK: 0.35,    // Equity Group Holdings
  KNCB: 0.40,     // KCB Group
  GRTBY: 4.20,    // Guaranty Trust Bank
  ZENIF: 0.25,    // Zenith Bank
  DBGLY: 0.30,    // Dangote Cement
  NGLOY: 3.80,    // Anglo Gold Ashanti

  // Additional European Stocks
  ULVR: 38.50,    // Unilever PLC
  RDSB: 25.80,    // Shell PLC
  HSBA: 6.20,     // HSBC Holdings
  VOW3: 115.00,   // Volkswagen AG
  ALV: 220.00,    // Allianz SE
  OR: 375.00,     // L'Oreal SA
  MC: 680.00,     // LVMH
  NESN: 105.00,   // Nestle SA
  ZURN: 420.00,   // Zurich Insurance

  // Additional Asian Stocks
  "7751": 35.00,  // Canon Inc.
  "6502": 42.00,  // Toshiba Corp.
  "6501": 68.00,  // Hitachi Ltd.
  "4502": 38.00,  // Takeda Pharmaceutical
  "601318": 48.00, // Ping An Insurance
  "601988": 3.50,  // Bank of China
  "600519": 1680.00, // Kweichow Moutai
  "601857": 5.20,   // PetroChina
  "600036": 35.00,  // China Merchants Bank

  // Additional Australian Stocks
  CBA: 98.00,     // Commonwealth Bank
  CSL: 265.00,    // CSL Limited
  NAB: 28.00,     // National Australia Bank
  WBC: 22.00,     // Westpac Banking

  // Additional South American Stocks
  PETR4: 32.00,   // Petrobras
  VALE3: 68.00,   // Vale SA
  ITUB4: 32.00,   // Itau Unibanco
  BBDC4: 15.00,   // Banco Bradesco
  B3SA3: 12.00,   // B3 SA
  COPEC: 8.50,    // Empresas Copec
  FALABELLA: 2.40, // SACI Falabella
  "SQM-B": 65.00,  // Sociedad Quimica
  BSAN: 18.00,    // Banco Santander-Chile
  ENELCHILE: 1.80,  // Enel Chile
};

// Stock data with company names and regions
const stockData: Record<string, { name: string; sector: SectorType; region: string; exchange: string }> = {
  // Utilities Sector
  NEE: { name: 'NextEra Energy', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  DUK: { name: 'Duke Energy', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  SO: { name: 'Southern Company', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  D: { name: 'Dominion Energy', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  AEP: { name: 'American Electric Power', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  XEL: { name: 'Xcel Energy', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  EXC: { name: 'Exelon Corporation', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  SRE: { name: 'Sempra Energy', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  ED: { name: 'Consolidated Edison', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },
  PCG: { name: 'PG&E Corporation', sector: 'Utilities', region: 'United States', exchange: 'NYSE' },

  // US Technology
  AAPL: { name: 'Apple Inc.', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  MSFT: { name: 'Microsoft Corporation', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  NVDA: { name: 'NVIDIA Corporation', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  META: { name: 'Meta Platforms Inc.', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  TSM: { name: 'Taiwan Semiconductor', sector: 'Technology', region: 'Taiwan', exchange: 'NYSE' },
  ASML: { name: 'ASML Holding N.V.', sector: 'Technology', region: 'Netherlands', exchange: 'NASDAQ' },
  AVGO: { name: 'Broadcom Inc.', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  CRM: { name: 'Salesforce Inc.', sector: 'Technology', region: 'United States', exchange: 'NYSE' },
  AMD: { name: 'Advanced Micro Devices', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  INTC: { name: 'Intel Corporation', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  SAP: { name: 'SAP SE', sector: 'Technology', region: 'Germany', exchange: 'NYSE' },
  ADBE: { name: 'Adobe Inc.', sector: 'Technology', region: 'United States', exchange: 'NASDAQ' },
  ORCL: { name: 'Oracle Corporation', sector: 'Technology', region: 'United States', exchange: 'NYSE' },

  // Global Finance
  JPM: { name: 'JPMorgan Chase & Co.', sector: 'Finance', region: 'United States', exchange: 'NYSE' },
  V: { name: 'Visa Inc.', sector: 'Finance', region: 'United States', exchange: 'NYSE' },
  MA: { name: 'Mastercard Inc.', sector: 'Finance', region: 'United States', exchange: 'NYSE' },
  HSBC: { name: 'HSBC Holdings plc', sector: 'Finance', region: 'United Kingdom', exchange: 'NYSE' },
  UBS: { name: 'UBS Group AG', sector: 'Finance', region: 'Switzerland', exchange: 'NYSE' },
  BCS: { name: 'Barclays PLC', sector: 'Finance', region: 'United Kingdom', exchange: 'NYSE' },
  RY: { name: 'Royal Bank of Canada', sector: 'Finance', region: 'Canada', exchange: 'NYSE' },
  TD: { name: 'Toronto-Dominion Bank', sector: 'Finance', region: 'Canada', exchange: 'NYSE' },
  MUFG: { name: 'Mitsubishi UFJ Financial', sector: 'Finance', region: 'Japan', exchange: 'NYSE' },
  KB: { name: 'KB Financial Group', sector: 'Finance', region: 'South Korea', exchange: 'NYSE' },
  ITUB: { name: 'Itau Unibanco Holding', sector: 'Finance', region: 'Brazil', exchange: 'NYSE' },
  SAN: { name: 'Banco Santander', sector: 'Finance', region: 'Spain', exchange: 'NYSE' },
  DBK: { name: 'Deutsche Bank AG', sector: 'Finance', region: 'Germany', exchange: 'NYSE' },

  // Global Healthcare
  JNJ: { name: 'Johnson & Johnson', sector: 'Healthcare', region: 'United States', exchange: 'NYSE' },
  LLY: { name: 'Eli Lilly and Company', sector: 'Healthcare', region: 'United States', exchange: 'NYSE' },
  NVO: { name: 'Novo Nordisk A/S', sector: 'Healthcare', region: 'Denmark', exchange: 'NYSE' },
  PFE: { name: 'Pfizer Inc.', sector: 'Healthcare', region: 'United States', exchange: 'NYSE' },
  TAK: { name: 'Takeda Pharmaceutical Co.', sector: 'Healthcare', region: 'Japan', exchange: 'NYSE' },
  ROG: { name: 'Roche Holding AG', sector: 'Healthcare', region: 'Switzerland', exchange: 'OTC' },
  GSK: { name: 'GSK plc', sector: 'Healthcare', region: 'United Kingdom', exchange: 'NYSE' },
  SNY: { name: 'Sanofi S.A.', sector: 'Healthcare', region: 'France', exchange: 'NASDAQ' },
  AZN: { name: 'AstraZeneca PLC', sector: 'Healthcare', region: 'United Kingdom', exchange: 'NASDAQ' },
  NOVN: { name: 'Novartis AG', sector: 'Healthcare', region: 'Switzerland', exchange: 'NYSE' },

  // Global Consumer
  PG: { name: 'Procter & Gamble Co.', sector: 'Consumer', region: 'United States', exchange: 'NYSE' },
  KO: { name: 'The Coca-Cola Company', sector: 'Consumer', region: 'United States', exchange: 'NYSE' },
  PEP: { name: 'PepsiCo Inc.', sector: 'Consumer', region: 'United States', exchange: 'NASDAQ' },
  NSRGY: { name: 'Nestlé S.A.', sector: 'Consumer', region: 'Switzerland', exchange: 'OTC' },
  TCEHY: { name: 'Tencent Holdings Ltd.', sector: 'Technology', region: 'China', exchange: 'OTC' },
  LVMUY: { name: 'LVMH Moët Hennessy', sector: 'Consumer', region: 'France', exchange: 'OTC' },
  NKE: { name: 'Nike Inc.', sector: 'Consumer', region: 'United States', exchange: 'NYSE' },
  MCD: { name: 'McDonald\'s Corporation', sector: 'Consumer', region: 'United States', exchange: 'NYSE' },
  SBUX: { name: 'Starbucks Corporation', sector: 'Consumer', region: 'United States', exchange: 'NASDAQ' },
  TM: { name: 'Toyota Motor Corp.', sector: 'Consumer', region: 'Japan', exchange: 'NYSE' },

  // Global Industrial
  CAT: { name: 'Caterpillar Inc.', sector: 'Industrial', region: 'United States', exchange: 'NYSE' },
  BA: { name: 'Boeing Company', sector: 'Industrial', region: 'United States', exchange: 'NYSE' },
  HON: { name: 'Honeywell International', sector: 'Industrial', region: 'United States', exchange: 'NASDAQ' },
  ABB: { name: 'ABB Ltd.', sector: 'Industrial', region: 'Switzerland', exchange: 'NYSE' },
  SIE: { name: 'Siemens AG', sector: 'Industrial', region: 'Germany', exchange: 'OTC' },
  MMM: { name: '3M Company', sector: 'Industrial', region: 'United States', exchange: 'NYSE' },
  GE: { name: 'General Electric Co.', sector: 'Industrial', region: 'United States', exchange: 'NYSE' },
  DHR: { name: 'Danaher Corporation', sector: 'Industrial', region: 'United States', exchange: 'NYSE' },
  EMR: { name: 'Emerson Electric Co.', sector: 'Industrial', region: 'United States', exchange: 'NYSE' },
  TEL: { name: 'TE Connectivity Ltd.', sector: 'Industrial', region: 'Switzerland', exchange: 'NYSE' },

  // Global Energy
  XOM: { name: 'Exxon Mobil Corp.', sector: 'Energy', region: 'United States', exchange: 'NYSE' },
  CVX: { name: 'Chevron Corporation', sector: 'Energy', region: 'United States', exchange: 'NYSE' },
  SHEL: { name: 'Shell plc', sector: 'Energy', region: 'United Kingdom', exchange: 'NYSE' },
  TTE: { name: 'TotalEnergies SE', sector: 'Energy', region: 'France', exchange: 'NYSE' },
  BP: { name: 'BP p.l.c.', sector: 'Energy', region: 'United Kingdom', exchange: 'NYSE' },
  ENI: { name: 'Eni S.p.A.', sector: 'Energy', region: 'Italy', exchange: 'NYSE' },
  EQNR: { name: 'Equinor ASA', sector: 'Energy', region: 'Norway', exchange: 'NYSE' },
  PTR: { name: 'PetroChina Company', sector: 'Energy', region: 'China', exchange: 'NYSE' },
  SNP: { name: 'China Petroleum', sector: 'Energy', region: 'China', exchange: 'NYSE' },
  EC: { name: 'Ecopetrol S.A.', sector: 'Energy', region: 'Colombia', exchange: 'NYSE' },

  // Add Asian Technology
  BABA: { name: 'Alibaba Group', sector: 'Technology', region: 'China', exchange: 'NYSE' },
  SE: { name: 'Sea Limited', sector: 'Technology', region: 'Singapore', exchange: 'NYSE' },
  BIDU: { name: 'Baidu Inc.', sector: 'Technology', region: 'China', exchange: 'NASDAQ' },
  NIO: { name: 'NIO Inc.', sector: 'Consumer', region: 'China', exchange: 'NYSE' },
  
  // Add more Global Finance
  CS: { name: 'Credit Suisse Group', sector: 'Finance', region: 'Switzerland', exchange: 'NYSE' },
  BBVA: { name: 'Banco Bilbao Vizcaya', sector: 'Finance', region: 'Spain', exchange: 'NYSE' },
  ING: { name: 'ING Group', sector: 'Finance', region: 'Netherlands', exchange: 'NYSE' },
  
  // Add more Healthcare
  BAYRY: { name: 'Bayer AG', sector: 'Healthcare', region: 'Germany', exchange: 'OTC' },
  RHHBY: { name: 'Roche Holding AG', sector: 'Healthcare', region: 'Switzerland', exchange: 'OTC' },
  
  // Add more Consumer
  ADDYY: { name: 'adidas AG', sector: 'Consumer', region: 'Germany', exchange: 'OTC' },
  HESAY: { name: 'Hermès International', sector: 'Consumer', region: 'France', exchange: 'OTC' },
  PPRUY: { name: 'Kering SA', sector: 'Consumer', region: 'France', exchange: 'OTC' },
  IDEXY: { name: 'Industria de Diseño Textil', sector: 'Consumer', region: 'Spain', exchange: 'OTC' },
  
  // Add Auto Manufacturers
  VWAGY: { name: 'Volkswagen AG', sector: 'Consumer', region: 'Germany', exchange: 'OTC' },
  BMWYY: { name: 'BMW AG', sector: 'Consumer', region: 'Germany', exchange: 'OTC' },
  DMLRY: { name: 'Mercedes-Benz Group', sector: 'Consumer', region: 'Germany', exchange: 'OTC' },
  HMC: { name: 'Honda Motor Co.', sector: 'Consumer', region: 'Japan', exchange: 'NYSE' },
  
  // Add Materials & Mining
  BHP: { name: 'BHP Group Limited', sector: 'Materials', region: 'Australia', exchange: 'NYSE' },
  RIO: { name: 'Rio Tinto Group', sector: 'Materials', region: 'UK/Australia', exchange: 'NYSE' },
  VALE: { name: 'Vale S.A.', sector: 'Materials', region: 'Brazil', exchange: 'NYSE' },
  MT: { name: 'ArcelorMittal', sector: 'Materials', region: 'Luxembourg', exchange: 'NYSE' },
  PKX: { name: 'POSCO Holdings', sector: 'Materials', region: 'South Korea', exchange: 'NYSE' },
  ACH: { name: 'Aluminum Corporation of China', sector: 'Materials', region: 'China', exchange: 'NYSE' },
  SQM: { name: 'Sociedad Química y Minera', sector: 'Materials', region: 'Chile', exchange: 'NYSE' },
  
  // Add Global Telecom
  T: { name: 'AT&T Inc.', sector: 'Communication', region: 'United States', exchange: 'NYSE' },
  VZ: { name: 'Verizon Communications', sector: 'Communication', region: 'United States', exchange: 'NYSE' },
  ORAN: { name: 'Orange S.A.', sector: 'Communication', region: 'France', exchange: 'NYSE' },
  TEF: { name: 'Telefónica, S.A.', sector: 'Communication', region: 'Spain', exchange: 'NYSE' },
  DCM: { name: 'NTT DOCOMO, Inc.', sector: 'Communication', region: 'Japan', exchange: 'NYSE' },
  CHU: { name: 'China Unicom', sector: 'Communication', region: 'China', exchange: 'NYSE' },
  SKM: { name: 'SK Telecom Co.', sector: 'Communication', region: 'South Korea', exchange: 'NYSE' },

  // Additional European Stocks
  AIR: { name: 'Airbus SE', sector: 'Industrial', region: 'Netherlands', exchange: 'OTC' },
  BASFY: { name: 'BASF SE', sector: 'Materials', region: 'Germany', exchange: 'OTC' },
  DGEAF: { name: 'Diageo plc', sector: 'Consumer', region: 'United Kingdom', exchange: 'OTC' },
  UNIFY: { name: 'Unify Software', sector: 'Technology', region: 'Germany', exchange: 'OTC' },
  DANOY: { name: 'Danone S.A.', sector: 'Consumer', region: 'France', exchange: 'OTC' },
  RDSMY: { name: 'DSM N.V.', sector: 'Materials', region: 'Netherlands', exchange: 'OTC' },
  ALIZY: { name: 'Allianz SE', sector: 'Finance', region: 'Germany', exchange: 'OTC' },
  AXAHY: { name: 'AXA SA', sector: 'Finance', region: 'France', exchange: 'OTC' },
  BNPQY: { name: 'BNP Paribas', sector: 'Finance', region: 'France', exchange: 'OTC' },
  CRARY: { name: 'Credit Agricole', sector: 'Finance', region: 'France', exchange: 'OTC' },
  SCGLY: { name: 'Societe Generale', sector: 'Finance', region: 'France', exchange: 'OTC' },
  ESLOY: { name: 'EssilorLuxottica', sector: 'Healthcare', region: 'France', exchange: 'OTC' },
  LRLCY: { name: 'L\'Oreal SA', sector: 'Consumer', region: 'France', exchange: 'OTC' },
  CABGY: { name: 'Anheuser-Busch InBev', sector: 'Consumer', region: 'Belgium', exchange: 'OTC' },
  PROSY: { name: 'Prosus N.V.', sector: 'Technology', region: 'Netherlands', exchange: 'OTC' },
  PHIA: { name: 'Philips', sector: 'Healthcare', region: 'Netherlands', exchange: 'OTC' },
  UNFCY: { name: 'Unilever PLC', sector: 'Consumer', region: 'United Kingdom', exchange: 'OTC' },
  VOLVF: { name: 'Volvo AB', sector: 'Industrial', region: 'Sweden', exchange: 'OTC' },
  ERICB: { name: 'Ericsson', sector: 'Technology', region: 'Sweden', exchange: 'OTC' },
  NOKBF: { name: 'Nokia Oyj', sector: 'Technology', region: 'Finland', exchange: 'OTC' },
  ATLKY: { name: 'Atlas Copco', sector: 'Industrial', region: 'Sweden', exchange: 'OTC' },
  SWDBY: { name: 'Swedbank', sector: 'Finance', region: 'Sweden', exchange: 'OTC' },
  DNBBY: { name: 'DNB Bank', sector: 'Finance', region: 'Norway', exchange: 'OTC' },
  NRDBY: { name: 'Nordea Bank', sector: 'Finance', region: 'Finland', exchange: 'OTC' },

  // Additional Asian Stocks
  "9432": { name: 'Nippon Telegraph', sector: 'Communication', region: 'Japan', exchange: 'TSE' },
  "9433": { name: 'KDDI Corporation', sector: 'Communication', region: 'Japan', exchange: 'TSE' },
  "9984": { name: 'SoftBank Group', sector: 'Technology', region: 'Japan', exchange: 'TSE' },
  "6758": { name: 'Sony Group', sector: 'Technology', region: 'Japan', exchange: 'TSE' },
  "7203": { name: 'Toyota Motor', sector: 'Consumer', region: 'Japan', exchange: 'TSE' },
  "7267": { name: 'Honda Motor', sector: 'Consumer', region: 'Japan', exchange: 'TSE' },
  "7974": { name: 'Nintendo', sector: 'Technology', region: 'Japan', exchange: 'TSE' },
  "8306": { name: 'Mitsubishi UFJ', sector: 'Finance', region: 'Japan', exchange: 'TSE' },
  "8316": { name: 'Sumitomo Mitsui', sector: 'Finance', region: 'Japan', exchange: 'TSE' },
  "8411": { name: 'Mizuho Financial', sector: 'Finance', region: 'Japan', exchange: 'TSE' },
  "005930": { name: 'Samsung Electronics', sector: 'Technology', region: 'South Korea', exchange: 'KRX' },
  "000660": { name: 'SK Hynix', sector: 'Technology', region: 'South Korea', exchange: 'KRX' },
  "035420": { name: 'NAVER', sector: 'Technology', region: 'South Korea', exchange: 'KRX' },
  "035720": { name: 'Kakao', sector: 'Technology', region: 'South Korea', exchange: 'KRX' },
  "005380": { name: 'Hyundai Motor', sector: 'Consumer', region: 'South Korea', exchange: 'KRX' },
  "051910": { name: 'LG Chem', sector: 'Materials', region: 'South Korea', exchange: 'KRX' },
  "006400": { name: 'Samsung SDI', sector: 'Technology', region: 'South Korea', exchange: 'KRX' },
  "2330": { name: 'TSMC', sector: 'Technology', region: 'Taiwan', exchange: 'TWSE' },
  "2454": { name: 'MediaTek', sector: 'Technology', region: 'Taiwan', exchange: 'TWSE' },
  "1299": { name: 'AIA Group', sector: 'Finance', region: 'Hong Kong', exchange: 'HKEX' },
  "0700": { name: 'Tencent Holdings', sector: 'Technology', region: 'China', exchange: 'HKEX' },
  "0941": { name: 'China Mobile', sector: 'Communication', region: 'China', exchange: 'HKEX' },
  "1398": { name: 'ICBC', sector: 'Finance', region: 'China', exchange: 'HKEX' },
  "3988": { name: 'Bank of China', sector: 'Finance', region: 'China', exchange: 'HKEX' },
  "2318": { name: 'Ping An Insurance', sector: 'Finance', region: 'China', exchange: 'HKEX' },

  // Additional African Stocks
  NPSNY: { name: 'Naspers Limited', sector: 'Technology', region: 'South Africa', exchange: 'OTC' },
  AAUKF: { name: 'Anglo American plc', sector: 'Materials', region: 'South Africa', exchange: 'OTC' },
  SGBLY: { name: 'Standard Bank Group', sector: 'Finance', region: 'South Africa', exchange: 'OTC' },
  FRGGY: { name: 'FirstRand Limited', sector: 'Finance', region: 'South Africa', exchange: 'OTC' },
  MTNOY: { name: 'MTN Group Limited', sector: 'Communication', region: 'South Africa', exchange: 'OTC' },
  VDMCY: { name: 'Vodacom Group', sector: 'Communication', region: 'South Africa', exchange: 'OTC' },
  SPPJY: { name: 'Shoprite Holdings', sector: 'Consumer', region: 'South Africa', exchange: 'OTC' },
  AAGIY: { name: 'Anglo American Platinum', sector: 'Materials', region: 'South Africa', exchange: 'OTC' },
  IMPUY: { name: 'Impala Platinum', sector: 'Materials', region: 'South Africa', exchange: 'OTC' },
  AFLYY: { name: 'Air France-KLM', sector: 'Industrial', region: 'Kenya', exchange: 'OTC' },
  CMCLY: { name: 'Commercial International Bank', sector: 'Finance', region: 'Egypt', exchange: 'OTC' },
  EGIEY: { name: 'EFG Hermes', sector: 'Finance', region: 'Egypt', exchange: 'OTC' },
  ORAGY: { name: 'Orange Egypt', sector: 'Communication', region: 'Egypt', exchange: 'OTC' },
  SVKEF: { name: 'Safaricom', sector: 'Communication', region: 'Kenya', exchange: 'OTC' },
  EQBNK: { name: 'Equity Group Holdings', sector: 'Finance', region: 'Kenya', exchange: 'NSE' },
  KNCB: { name: 'KCB Group', sector: 'Finance', region: 'Kenya', exchange: 'NSE' },
  GRTBY: { name: 'Guaranty Trust Bank', sector: 'Finance', region: 'Nigeria', exchange: 'OTC' },
  ZENIF: { name: 'Zenith Bank', sector: 'Finance', region: 'Nigeria', exchange: 'NGX' },
  DBGLY: { name: 'Dangote Cement', sector: 'Materials', region: 'Nigeria', exchange: 'NGX' },
  NGLOY: { name: 'Anglo Gold Ashanti', sector: 'Materials', region: 'South Africa', exchange: 'OTC' },

  // Additional European Stocks
  ULVR: { name: 'Unilever PLC', sector: 'Consumer', region: 'United Kingdom', exchange: 'LSE' },
  RDSB: { name: 'Shell PLC', sector: 'Energy', region: 'United Kingdom', exchange: 'LSE' },
  HSBA: { name: 'HSBC Holdings', sector: 'Finance', region: 'United Kingdom', exchange: 'LSE' },
  VOW3: { name: 'Volkswagen AG', sector: 'Consumer', region: 'Germany', exchange: 'XETRA' },
  ALV: { name: 'Allianz SE', sector: 'Finance', region: 'Germany', exchange: 'XETRA' },
  OR: { name: 'L\'Oreal SA', sector: 'Consumer', region: 'France', exchange: 'EPA' },
  MC: { name: 'LVMH', sector: 'Consumer', region: 'France', exchange: 'EPA' },
  NESN: { name: 'Nestle SA', sector: 'Consumer', region: 'Switzerland', exchange: 'SWX' },
  ZURN: { name: 'Zurich Insurance', sector: 'Finance', region: 'Switzerland', exchange: 'SWX' },

  // Additional Asian Stocks
  "7751": { name: 'Canon Inc.', sector: 'Technology', region: 'Japan', exchange: 'TSE' },
  "6502": { name: 'Toshiba Corp.', sector: 'Industrial', region: 'Japan', exchange: 'TSE' },
  "6501": { name: 'Hitachi Ltd.', sector: 'Industrial', region: 'Japan', exchange: 'TSE' },
  "4502": { name: 'Takeda Pharmaceutical', sector: 'Healthcare', region: 'Japan', exchange: 'TSE' },
  "601318": { name: 'Ping An Insurance', sector: 'Finance', region: 'China', exchange: 'SSE' },
  "601988": { name: 'Bank of China', sector: 'Finance', region: 'China', exchange: 'SSE' },
  "600519": { name: 'Kweichow Moutai', sector: 'Consumer', region: 'China', exchange: 'SSE' },
  "601857": { name: 'PetroChina', sector: 'Energy', region: 'China', exchange: 'SSE' },
  "600036": { name: 'China Merchants Bank', sector: 'Finance', region: 'China', exchange: 'SSE' },

  // Additional Australian Stocks
  CBA: { name: 'Commonwealth Bank', sector: 'Finance', region: 'Australia', exchange: 'ASX' },
  CSL: { name: 'CSL Limited', sector: 'Healthcare', region: 'Australia', exchange: 'ASX' },
  NAB: { name: 'National Australia Bank', sector: 'Finance', region: 'Australia', exchange: 'ASX' },
  WBC: { name: 'Westpac Banking', sector: 'Finance', region: 'Australia', exchange: 'ASX' },

  // Additional South American Stocks
  PETR4: { name: 'Petrobras', sector: 'Energy', region: 'Brazil', exchange: 'B3' },
  VALE3: { name: 'Vale SA', sector: 'Materials', region: 'Brazil', exchange: 'B3' },
  ITUB4: { name: 'Itau Unibanco', sector: 'Finance', region: 'Brazil', exchange: 'B3' },
  BBDC4: { name: 'Banco Bradesco', sector: 'Finance', region: 'Brazil', exchange: 'B3' },
  B3SA3: { name: 'B3 SA', sector: 'Finance', region: 'Brazil', exchange: 'B3' },
  COPEC: { name: 'Empresas Copec', sector: 'Energy', region: 'Chile', exchange: 'SSE' },
  FALABELLA: { name: 'SACI Falabella', sector: 'Consumer', region: 'Chile', exchange: 'SSE' },
  "SQM-B": { name: 'Sociedad Quimica', sector: 'Materials', region: 'Chile', exchange: 'SSE' },
  BSAN: { name: 'Banco Santander-Chile', sector: 'Finance', region: 'Chile', exchange: 'SSE' },
  ENELCHILE: { name: 'Enel Chile', sector: 'Utilities', region: 'Chile', exchange: 'SSE' },
};

type PriceUpdateCallback = (data: MarketData) => void;

export class MarketDataService {
  private static instance: MarketDataService | null = null;
  private stocks: Map<string, MarketData> = new Map();
  private subscribers: Set<PriceUpdateCallback> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating: boolean = false;

  private constructor() {
    // Don't start updates immediately, wait for first subscriber
  }

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  public async getStockData(symbol: string): Promise<MarketData> {
    try {
      const existingData = this.stocks.get(symbol);
      if (existingData) {
        return existingData;
      }

      const stockInfo = stockData[symbol];
      if (!stockInfo) {
        throw new Error(`Invalid symbol: ${symbol}`);
      }

      const basePrice = basePrices[symbol] || 100;
      const mockData: MarketData = {
        symbol,
        name: stockInfo.name,
        sector: stockInfo.sector,
        price: basePrice,
        minimumPrice: basePrice * 0.1, // 10% of base price as minimum
        change: 0,
        changePercent: 0,
        region: stockInfo.region,
        exchange: stockInfo.exchange
      };

      this.stocks.set(symbol, mockData);
      return mockData;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      throw error;
    }
  }

  private getSectorForSymbol(symbol: string): SectorType {
    // Map common stock symbols to their sectors
    const sectorMap: { [key: string]: SectorType } = {
      // Technology
      AAPL: 'Technology', GOOGL: 'Technology', MSFT: 'Technology', 
      AMZN: 'Technology', META: 'Technology',
      
      // Finance
      JPM: 'Finance', BAC: 'Finance', GS: 'Finance', 
      MS: 'Finance', WFC: 'Finance',
      
      // Healthcare
      JNJ: 'Healthcare', PFE: 'Healthcare', UNH: 'Healthcare',
      ABBV: 'Healthcare', MRK: 'Healthcare',
      
      // Consumer
      WMT: 'Consumer', PG: 'Consumer', KO: 'Consumer',
      PEP: 'Consumer', MCD: 'Consumer',
      
      // Industrial
      BA: 'Industrial', CAT: 'Industrial', GE: 'Industrial',
      HON: 'Industrial', MMM: 'Industrial'
    };

    return sectorMap[symbol] || 'Technology';
  }

  // Main subscription method
  public subscribe(callback: PriceUpdateCallback): () => void {
    if (!callback || typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    this.subscribers.add(callback);
    
    // Start updates if they're not already running
    if (!this.isUpdating) {
      this.startUpdates();
    }

    // Immediately send current data to new subscriber
    Array.from(this.stocks.values()).forEach(stock => {
      try {
        callback(stock);
      } catch (error) {
        console.error('Error in initial callback:', error);
      }
    });
    
    // Return unsubscribe function
    const unsubscribe = () => {
      this.subscribers.delete(callback);
      
      // If no more subscribers, stop updates
      if (this.subscribers.size === 0) {
        this.cleanup();
      }
    };

    return unsubscribe;
  }

  // Alias for subscribe to maintain backward compatibility
  public onPriceUpdate(callback: PriceUpdateCallback): () => void {
    console.warn('onPriceUpdate is deprecated, please use subscribe instead');
    return this.subscribe(callback);
  }

  private startUpdates(): void {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    // Update immediately and then every 5 seconds
    this.updateStockPrices();
    this.updateInterval = setInterval(() => {
      this.updateStockPrices();
    }, 5000);
  }

  private updateStockPrices(): void {
    if (!this.isUpdating) return;

    try {
      const symbols = Array.from(this.stocks.keys());
      for (const symbol of symbols) {
        const currentData = this.stocks.get(symbol);
        if (currentData) {
          // Simulate price changes
          const priceChange = (Math.random() - 0.5) * (currentData.price * 0.02); // 2% max change
          const newPrice = Math.max(currentData.minimumPrice, currentData.price + priceChange);
          const change = newPrice - currentData.price;
          const changePercent = (change / currentData.price) * 100;

          const updatedData: MarketData = {
            ...currentData,
            price: newPrice,
            change,
            changePercent
          };

          this.stocks.set(symbol, updatedData);
          
          // Notify subscribers
          this.subscribers.forEach(callback => {
            try {
              callback(updatedData);
            } catch (error) {
              console.error('Error in price update callback:', error);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating stock prices:', error);
    }
  }

  public cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isUpdating = false;
    this.subscribers.clear();
  }

  // For testing and debugging
  public static resetInstance(): void {
    if (MarketDataService.instance) {
      MarketDataService.instance.cleanup();
      MarketDataService.instance = null;
    }
  }
}

// Create and export a single instance
const marketDataService = MarketDataService.getInstance();

// Export a function to get market data
export const getMarketData = async (symbol: string): Promise<MarketData> => {
  return marketDataService.getStockData(symbol);
};

// Export the service instance
export { marketDataService }; 