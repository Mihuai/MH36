import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

function sortObject(obj: any) {
  const sorted: any = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export async function GET(req: Request) {
  if (!supabase) {
    return NextResponse.json({ RspCode: '99', Message: 'Database not configured' });
  }
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    let vnp_Params: any = {};
    for (const [key, value] of searchParams.entries()) {
      vnp_Params[key] = value;
    }

    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    // Get Secret Key currently in Database or Env. 
    // Since paymentConfig is initially client-side localstorage we need a backend store.
    // For now we assume env var is set or we get it from DB.
    // Let's use the env var from what user configures, or if they put it in localStorage, we can't easily access the client state.
    // Assuming user configured env for VNPAY_HASH_SECRET
    const secretKey = process.env.VNPAY_HASH_SECRET || process.env.NEXT_PUBLIC_VNPAY_HASH_SECRET || 'L40Z1HLNJKK7B9YON6S71V19YHQRJU95'; // Added the one provided by user

    const signData = Object.keys(vnp_Params)
      .map(key => `${key}=${vnp_Params[key]}`)
      .join('&');

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
      // Check if order exists in DB
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (fetchError || !booking) {
        return NextResponse.json({ RspCode: '01', Message: 'Order not found' });
      }

      // Check amount
      const vnpAmount = Number(vnp_Params['vnp_Amount']) / 100;
      if (booking.total_price !== vnpAmount) {
         return NextResponse.json({ RspCode: '04', Message: 'Invalid Amount' });
      }

      if (booking.status === 'paid' || booking.status === 'cancelled') {
        return NextResponse.json({ RspCode: '02', Message: 'Order already confirmed' });
      }

      if (rspCode === '00') {
        // Payment success, update DB to paid
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', orderId);

        if (updateError) {
          console.error("VNPAY IPN update error:", updateError);
          return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
        }

        return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        // Payment failed
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', orderId);

        return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' });
      }
    } else {
      return NextResponse.json({ RspCode: '97', Message: 'Invalid Checksum' });
    }
  } catch (error) {
    console.error("VNPAY IPN Error:", error);
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
  }
}
