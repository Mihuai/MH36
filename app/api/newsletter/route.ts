import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    // 1. Lưu vào Supabase (Bảng newsletter_subscriptions)
    if (supabase) {
      const { error: dbError } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);
      
      // Nếu đã tồn tại email thì vẫn tiếp tục gửi mail confirm (hoặc báo lỗi nếu muốn)
      if (dbError && dbError.code !== '23505') { 
        console.error('Database error:', dbError);
      }
    }

    // 2. Cấu hình Transporter Nodemailer (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Nội dung Email
    const mailOptions = {
      from: process.env.SMTP_FROM || 'MH36 TRAVEL <noreply@mh36.travel>',
      to: email,
      subject: 'Xác nhận đăng ký nhận ưu đãi - MH36 TRAVEL',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #020617; text-align: center;">Chào mừng bạn đến với MH36 TRAVEL!</h2>
          <p>Cảm ơn bạn đã đăng ký nhận thông tin ưu đãi từ chúng tôi.</p>
          <p>Từ nay, bạn sẽ là người đầu tiên nhận được:</p>
          <ul>
            <li>Các mã giảm giá độc quyền (lên đến 30%).</li>
            <li>Thông tin về các Tour mới nhất, hấp dẫn nhất.</li>
            <li>Cẩm nang du lịch hữu ích hàng tuần.</li>
          </ul>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold; color: #0f172a;">MÃ GIẢM GIÁ GIAO DIÊN MỚI:</p>
            <h3 style="margin: 10px 0; color: #3b82f6; font-size: 24px;">MH36WELCOME</h3>
            <p style="margin: 0; font-size: 12px; color: #64748b;">(Giảm 5% cho đơn hàng đầu tiên của bạn)</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
            Đây là email tự động, vui lòng không phản hồi. <br>
            © ${new Date().getFullYear()} MH36 TRAVEL. All rights reserved.
          </p>
        </div>
      `,
    };

    // 4. Gửi Mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Đăng ký thành công và đã gửi mail xác nhận.' });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ 
      error: 'Đã có lỗi xảy ra khi xử lý đăng ký.',
      details: error.message 
    }, { status: 500 });
  }
}
