import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, orderInfo, returnUrl, tmnCode, hashSecret, vnpUrl } = body;

    const date = new Date();
    // Định dạng yyyyMMddHHmmss
    const createDate = 
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0');
    
    // Mã giao dịch từ DB Supabase (Booking ID)
    const orderId = body.bookingId || date.getTime().toString();
    
    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '127.0.0.1'; // Mock IP
    vnp_Params['vnp_CreateDate'] = createDate;

    // Sort params trước khi hash
    vnp_Params = sortObject(vnp_Params);

    // Dựng string chuẩn bị hash
    const signData = Object.keys(vnp_Params)
      .map(key => `${key}=${vnp_Params[key]}`)
      .join('&');
    
    // Tạo Hash key bảo mật chuẩn VNPAY
    const hmac = crypto.createHmac("sha512", hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    
    vnp_Params['vnp_SecureHash'] = signed;
    
    // Dựng url cuối cùng
    const paymentUrl = vnpUrl + '?' + Object.keys(vnp_Params)
      .map(key => `${key}=${vnp_Params[key]}`)
      .join('&');
    
    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("VNPAY Generate Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
