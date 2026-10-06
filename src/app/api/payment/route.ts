import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, donorName } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    // Memaksa menggunakan URL Sandbox karena kunci dari Midtrans Sandbox Anda tidak memiliki awalan SB-
    const apiUrl = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
      
    const authString = Buffer.from(serverKey + ':').toString('base64');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: `DONASI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          gross_amount: amount,
        },
        customer_details: {
          first_name: donorName,
        },
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_messages ? data.error_messages.join(', ') : 'Failed to fetch Midtrans token');
    }

    return NextResponse.json({ token: data.token });
  } catch (error: any) {
    console.error('Midtrans API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
