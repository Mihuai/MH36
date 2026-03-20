import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database chưa được cấu hình. Vui lòng thiết lập SUPABASE_URL.' }, { status: 503 });
  }
  try {
    const body = await req.json();
    
    // Validate Required Data
    if (!body.tour_id || !body.customer_name || !body.customer_phone || !body.customer_email || body.total_price === undefined) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Insert to database
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        tour_id: body.tour_id,
        user_id: body.user_id || null, // Allow guest
        departure_date: body.departure_date || new Date().toISOString(),
        adult_count: body.adult_count || 1,
        child_count: body.child_count || 0,
        total_price: body.total_price,
        status: body.status || 'pending',
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email,
        payment_method: body.payment_method || 'vnpay'
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Supabase booking insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("Booking API error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database chưa được cấu hình.' }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Thiếu ID hoặc status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Supabase booking update error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (error: any) {
    console.error("Booking PATCH error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
