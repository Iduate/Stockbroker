import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      // Forward the request to your backend server
      const response = await fetch('http://localhost:3001/api/auth/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Received non-JSON response:', await response.text());
        return NextResponse.json(
          { message: 'Backend server error or not running. Please try again later.' },
          { status: 500 }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || 'Failed to request password reset' },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Backend server error:', fetchError);
      return NextResponse.json(
        { message: 'Unable to connect to authentication server. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { message: 'Invalid request format' },
      { status: 400 }
    );
  }
} 