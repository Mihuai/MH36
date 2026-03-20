import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get the latest user message
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

    // A smart mock AI logic based on keywords
    let aiResponse = "Xin lỗi, tôi chưa hiểu rõ ý bạn. Bạn có thể nói chi tiết hơn về chuyến đi bạn dự định (như địa điểm, mức giá, thời gian) không?";
    
    // Greeting & Small talk
    if (lastMessage.match(/xin chào|chào|hi|hello|bạn ơi|ad ơi|admin|shop ơi|alo|có ai không|ê|nhà xe/i)) {
      aiResponse = "Chào bạn! Tôi là AI Trợ lý của MH36 TRAVEL. Bạn đang tìm điểm đến nào? Hay bạn cần tôi tư vấn về giá và thời gian lịch trình chi tiết?";
    }
    // Destinations
    else if (lastMessage.includes("phú quốc") || lastMessage.includes("biển")) {
      aiResponse = "Phú Quốc đang có mùa đẹp nhất năm! MH36 TRAVEL hiện có Tour 'Nghỉ dưỡng Phú Quốc - Khám phá Nam Đảo & VinWonders' 4 Ngày 3 Đêm giá chỉ từ 5.200.000đ. Bạn dự định đi khoảng tháng mấy?";
    }
    else if (lastMessage.includes("đà nẵng") || lastMessage.includes("hội an") || lastMessage.includes("miền trung")) {
      aiResponse = "Đà Nẵng - Hội An luôn là lựa chọn hàng đầu. Bên mình có tour 'Khám phá Đà Nẵng - Hội An - Bà Nà Hills' trọn gói 3 Ngày 2 Đêm giá 3.500.000đ, đã bao gồm vé bay khứ hồi. Bạn đi mấy người nhỉ?";
    }
    else if (lastMessage.includes("hà nội") || lastMessage.includes("thủ đô") || lastMessage.includes("miền bắc")) {
      aiResponse = "Hà Nội mùa này rất đẹp! MH36 TRAVEL đang có Tour 'Khám phá Hà Nội - Ninh Bình - Hạ Long' 4 Ngày 3 Đêm. Nếu bạn muốn đi tour ghép chỉ loanh quanh Hà Nội, chi phí chỉ khoảng 2.000.000đ. Bạn muốn đi vào ngày nào?";
    }
    else if (lastMessage.includes("sapa") || lastMessage.includes("núi") || lastMessage.includes("lạnh")) {
      aiResponse = "Nếu bạn thích không khí se lạnh, tour Sapa - Chinh phục đỉnh Fansipan 2 Ngày 1 Đêm (chỉ từ 2.100.000đ) là quá tuyệt vời. Bạn sẽ được lên mây và ngắm ruộng bậc thang.";
    }
    else if (lastMessage.includes("đà lạt") || lastMessage.includes("hoa")) {
      aiResponse = "Đà Lạt dạo này không khí rất trong lành. Bạn tham khảo Tour 'Đà Lạt - Bức họa đồng quê chốn núi rừng' 3 Ngày 2 Đêm (2.800.000đ) mới nhất bên mình nhé!";
    }
    // Prices & Specifics
    else if (lastMessage.includes("giá rẻ") || lastMessage.includes("sinh viên") || lastMessage.includes("2 triệu") || lastMessage.includes("1 triệu")) {
      aiResponse = "Với ngân sách dưới 2.500.000đ, bạn có thể chọn các tour miền Tây (1N hoặc 2N1Đ), Sapa (2.100.000đ), hoặc các tour ghép nội thành Hà Nội. Tất cả đều rất lịch sự và đầy đủ trải nghiệm.";
    }
    else if (lastMessage.includes("đắt") || lastMessage.includes("cao cấp") || lastMessage.includes("vip")) {
      aiResponse = "Cho các gói cao cấp, mời bạn xem qua tour Du thuyền Vịnh Hạ Long 5 sao (giá từ 4.500.000đ/đêm) hoặc Tour nghỉ dưỡng Resort Phú Quốc (5.200.000đ). Dịch vụ đạt chuẩn 5 sao trọn gói.";
    }
    // Actions
    else if (lastMessage.includes("đặt") || lastMessage.includes("booking") || lastMessage.includes("mua")) {
      aiResponse = "Để đặt tour, bạn có thể vào trực tiếp mục 'Tất cả Tours' trên thanh Menu, chọn Tour ưng ý và nhấn 'Đặt Tour'. Bạn cũng có thể thanh toán online siêu nhanh qua VNPAY hoặc MoMo.";
    }
    // Company Info
    else if (lastMessage.includes("liên hệ") || lastMessage.includes("tổng đài") || lastMessage.includes("sđt")) {
      aiResponse = "Bạn có thể gọi số Hotline của MH36 TRAVEL: 1900 3636 hoặc nhánh Zalo: 090 123 4567. Trụ sở bên mình ở Landmark 81, TP.HCM.";
    }
    // Feedback / Thanks
    else if (lastMessage.includes("cảm ơn") || lastMessage.includes("ok") || lastMessage.includes("tuyệt")) {
      aiResponse = "MH36 TRAVEL rất vui được hỗ trợ bạn. Chúc bạn một ngày tốt lành nhé! Cần gì thêm cứ nhắn tôi.";
    }

    // Delay to simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    return NextResponse.json({
      role: 'assistant',
      content: aiResponse
    });
    
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ 
      error: 'Có lỗi xảy ra khi xử lý tin nhắn của bạn.' 
    }, { status: 500 });
  }
}
