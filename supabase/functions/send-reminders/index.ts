import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ZALO_OA_TOKEN = Deno.env.get('ZALO_OA_TOKEN');

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Lấy các booking sẽ khởi hành vào ngày mai (sau 1 ngày)
    // Để biểu diễn logic:
    const { data: bookings, error } = await supabaseClient
      .from('bookings')
      .select('*, tours(title), users(full_name, phone, email)')
      .eq('status', 'paid');
      
    if (error) throw error;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];

    const targetBookings = bookings.filter(b => b.departure_date === dateString);

    for (const booking of targetBookings) {
      // 1. Gửi Email Notification thông qua service (VD: Resend, SendGrid)
      console.log(`Sending email to ${booking.customer_email}: Nhắc nhở khởi hành tour ${booking.tours?.title}`);
      
      // 2. Gửi Zalo ZNS Notification (nếu có token)
      if (ZALO_OA_TOKEN && booking.customer_phone) {
          // fetch('https://openapi.zalo.me/v2.0/oa/message', { ... }) 
          console.log(`Sending Zalo notification to phone ${booking.customer_phone}`);
      }
      
      // 3. Insert notification to database system
      await supabaseClient.from('notifications').insert({
        user_id: booking.user_id,
        title: "Nhắc nhở khởi hành",
        message: `Tour ${booking.tours?.title} của bạn sẽ khởi hành vào ngày mai. Vui lòng chuẩn bị hành trang đầy đủ!`,
        type: "reminder"
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${targetBookings.length} reminders.` 
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    )
  }
})
