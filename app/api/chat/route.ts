import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { messages, sessionId, userId, userName } = await req.json();
    
    // Get the latest user message
    const latestUserMessage = messages[messages.length - 1];
    const content = latestUserMessage?.content || "";
    const lastMessageLower = content.toLowerCase();

    // 1. Save User Message to DB
    if (supabase) {
      const { error: userMsgErr } = await supabase.from('messages').insert({
        session_id: sessionId,
        user_id: userId || null,
        user_name: userName || 'Khách vãng lai',
        content: content,
        sender_role: 'user'
      });
      if (userMsgErr) console.error("Error saving user message:", userMsgErr);
    }

    // A smart mock AI logic based on keywords
    let aiResponse = "Xin lỗi, tôi chưa hiểu rõ ý bạn. Bạn có thể nói chi tiết hơn về chuyến đi bạn dự định (như địa điểm, mức giá, thời gian) không?";
    
    // Greeting & Small talk
    if (lastMessageLower.match(/xin chào|chào|hi|hello|bạn ơi|ad ơi|admin|shop ơi|alo|có ai không|ê|nhà xe/i)) {
      aiResponse = "Chào bạn! Tôi là AI Trợ lý của MH36 TRAVEL. Bạn đang tìm điểm đến nào? Hay bạn cần tôi tư vấn về giá và thời gian lịch trình chi tiết?";
    }
    // Destinations
    else if (lastMessageLower.includes("phú quốc") || lastMessageLower.includes("biển")) {
      aiResponse = "Phú Quốc đang có mùa đẹp nhất năm! MH36 TRAVEL hiện có Tour 'Nghỉ dưỡng Phú Quốc - Khám phá Nam Đảo & VinWonders' 4 Ngày 3 Đêm giá chỉ từ 5.200.000đ. Bạn dự định đi khoảng tháng mấy?";
    }
    else if (lastMessageLower.includes("đà nẵng") || lastMessageLower.includes("hội an") || lastMessageLower.includes("miền trung")) {
      aiResponse = "Đà Nẵng - Hội An luôn là lựa chọn hàng đầu. Bên mình có tour 'Khám phá Đà Nẵng - Hội An - Bà Nà Hills' trọn gói 3 Ngày 2 Đêm giá 3.500.000đ, đã bao gồm vé bay khứ hồi. Bạn đi mấy người nhỉ?";
    }
    else if (lastMessageLower.includes("hà nội") || lastMessageLower.includes("thủ đô") || lastMessageLower.includes("miền bắc")) {
      aiResponse = "Hà Nội mùa này rất đẹp! MH36 TRAVEL đang có Tour 'Khám phá Hà Nội - Ninh Bình - Hạ Long' 4 Ngày 3 Đêm. Nếu bạn muốn đi tour ghép chỉ loanh quanh Hà Nội, chi phí chỉ khoảng 2.000.000đ. Bạn muốn đi vào ngày nào?";
    }
    else if (lastMessageLower.includes("sapa") || lastMessageLower.includes("núi") || lastMessageLower.includes("lạnh")) {
      aiResponse = "Nếu bạn thích không khí se lạnh, tour Sapa - Chinh phục đỉnh Fansipan 2 Ngày 1 Đêm (chỉ từ 2.100.000đ) là quá tuyệt vời. Bạn sẽ được lên mây và ngắm ruộng bậc thang.";
    }
    else if (lastMessageLower.includes("giá rẻ") || lastMessageLower.includes("2 triệu")) {
      aiResponse = "Với ngân sách dưới 2.500.000đ, bạn có thể chọn các tour miền Tây, Sapa hoặc các tour nội thành. Bạn cần mình gửi link tour cụ thể không?";
    }
    else if (lastMessageLower.includes("đặt") || lastMessageLower.includes("booking")) {
      aiResponse = "Để đặt tour, bạn nhấn nút 'Đặt Tour' ở trang chi tiết. Bạn có thể thanh toán qua VNPAY hoặc Chuyển khoản QR rất thuận tiện.";
    }
    else if (lastMessageLower.includes("hỗ trợ") || lastMessageLower.includes("nhân viên") || lastMessageLower.includes("gặp admin") || lastMessageLower.includes("admin")) {
      aiResponse = "Đã rõ. Tôi đã gửi thông báo cho đội ngũ hỗ trợ. Admin sẽ phản hồi bạn trực tiếp qua khung chat này trong ít phút nhé!";
    }

    // Delay to simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 600));

    // 2. Save Bot Message to DB
    if (supabase) {
      const { error: botMsgErr } = await supabase.from('messages').insert({
        session_id: sessionId,
        content: aiResponse,
        sender_role: 'bot'
      });
      if (botMsgErr) console.error("Error saving bot message:", botMsgErr);
    }

    return NextResponse.json({
      role: 'assistant',
      content: aiResponse
    });
    
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ error: 'System busy.' }, { status: 500 });
  }
}
