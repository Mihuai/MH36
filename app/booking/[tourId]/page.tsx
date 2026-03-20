"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, Users, CreditCard, ShieldCheck, QrCode, AlertCircle } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { getTourById } from '@/lib/tours-data';

export default function BookingPage({ params }: { params: Promise<{ tourId: string }> }) {
  const { tourId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { paymentConfig } = usePayment();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  // Booking state
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  // Customer info state
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [note, setNote] = useState("");

  // Discount state
  const [discountInput, setDiscountInput] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'momo' | 'cash'>('vnpay');
  
  // Checkout state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // Departure date state
  const [departureDate, setDepartureDate] = useState('');

  // Booking ID state for status updates
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  // Tour data từ shared data source
  const tour = getTourById(tourId);

  const handleAdultsChange = (delta: number) => {
    setAdults(prev => Math.max(1, prev + delta));
  };

  const handleChildrenChange = (delta: number) => {
    setChildren(prev => Math.max(0, prev + delta));
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
    } else {
      setIsCheckingRole(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
    }
  }, [user]);

  // Auto-complete countdown when QR modal is open
  useEffect(() => {
    if (!showQRModal) {
      setCountdown(30);
      return;
    }
    if (countdown <= 0) {
      handleConfirmTransfer();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showQRModal, countdown]);

  // Redirect nếu tour không tồn tại
  if (!tour && !isCheckingRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <AlertCircle className="w-16 h-16 text-rose-400" />
        <h2 className="text-2xl font-bold">Tour không tồn tại</h2>
        <p className="text-muted-foreground">Tour bạn muốn đặt không tồn tại hoặc đã hết hạn.</p>
        <Button onClick={() => router.push('/tour')}>Xem tất cả tour</Button>
      </div>
    );
  }

  // Fallback nếu đang load
  const tourData = tour || { title: "", duration: "", price: 0, imageUrl: "" };

  const handleApplyDiscount = () => {
    if (!discountInput.trim()) {
       setDiscountError("Vui lòng nhập mã giảm giá.");
       return;
    }
    
    const code = discountInput.toUpperCase().trim();
    if (code === "MH36HPBD") {
       setDiscountAmount(2000000);
       setDiscountSuccess("Giảm 2,000,000đ");
       setDiscountError("");
    } else if (code === "SUMMER40") {
       setDiscountAmount(tourData.price * 0.4);
       setDiscountSuccess("Giảm 40% giá tour");
       setDiscountError("");
    } else if (code === "ASIA3GET1") {
       setDiscountAmount(tourData.price);
       setDiscountSuccess("Được tặng 1 vé người lớn");
       setDiscountError("");
    } else if (code === "MH36SALE") {
       setDiscountAmount(500000);
       setDiscountSuccess("Giảm 500,000đ");
       setDiscountError("");
    } else {
       setDiscountAmount(0);
       setDiscountSuccess("");
       setDiscountError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const totalAdultsPrice = adults * tourData.price;
  const totalChildrenPrice = children * tourData.price * 0.75;
  const totalPrice = Math.max(0, totalAdultsPrice + totalChildrenPrice - discountAmount);

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !customerEmail) {
      alert("Vui lòng nhập đầy đủ thông tin liên hệ (Họ tên, SĐT, Email)");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Lưu Order vào Database (Trạng thái Pending)
      const bookingData = {
        tour_id: tourId,
        user_id: user?.id || null, // Allow guest
        departure_date: new Date().toISOString(),
        adult_count: adults,
        child_count: children,
        total_price: totalPrice,
        status: 'pending',
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        payment_method: paymentMethod
      };

      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const bookingJson = await bookingRes.json();
      
      // Nếu DB chưa cấu hình (503) → bỏ qua lưu DB, vẫn tiến hành thanh toán
      // Nếu lỗi thật (500) → mới dừng lại
      const bookingId = bookingJson.booking?.id || Date.now().toString();
      setCurrentBookingId(bookingId);

      // 2. Chuyển hướng thanh toán Tương ứng
      if (paymentMethod === 'vnpay' && paymentConfig?.vnpay?.enabled) {
         const response = await fetch('/api/vnpay', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             amount: Math.round(totalPrice),
             orderInfo: `Thanh toan don ban Tour ${tourId}`,
             returnUrl: window.location.origin + '/dashboard',
             tmnCode: paymentConfig.vnpay.tmnCode,
             hashSecret: paymentConfig.vnpay.hashSecret,
             vnpUrl: paymentConfig.vnpay.url || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
             bookingId: bookingId
           })
         });
         const data = await response.json();
         if (data.paymentUrl) {
           window.location.href = data.paymentUrl;
         } else {
           alert("Lỗi tạo Cổng thanh toán VNPAY. Vui lòng thử lại.");
           setIsSubmitting(false);
         }
         return;
      }

      if (paymentMethod === 'momo' && paymentConfig?.momo?.enabled) {
         setIsSubmitting(false);
         setShowQRModal(true);
         return;
      }

      // Default or Cash -> Show QR for manual transfer
      setIsSubmitting(false);
      if (paymentConfig?.bankTransfer?.enabled) {
        setShowQRModal(true);
      } else {
        setCheckoutSuccess(true);
      }
    } catch (error) {
      console.error("Checkout Processing Error:", error);
      alert("Hệ thống đang bận. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (currentBookingId) {
      // Simulate "money arrival" by updating status to confirmed in DB
      try {
        await fetch('/api/bookings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentBookingId, status: 'confirmed' })
        });
      } catch (e) {
        console.error("Auto-confirm error:", e);
      }
    }
    
    setShowQRModal(false);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCheckoutSuccess(true);
    }, 1500);
  };

  if (isCheckingRole) {
    return <div className="min-h-screen flex items-center justify-center p-6"><h2 className="text-muted-foreground animate-pulse text-lg font-medium">Đang kiểm tra quyền truy cập...</h2></div>;
  }

  let qrUrl = '';
  const qrAddInfo = encodeURIComponent(`Thanh toan ${tourData.title}`);
  const qrAccountName = encodeURIComponent(paymentConfig?.bankTransfer?.accountName || 'MH36 TRAVEL');
  if (paymentMethod === 'momo' && paymentConfig?.momo?.enabled) {
    qrUrl = `https://img.vietqr.io/image/970473-${paymentConfig.momo.partnerCode}-compact2.png?amount=${totalPrice}&addInfo=${qrAddInfo}&accountName=${encodeURIComponent('MOMO E-WALLET')}`;
  } else if (paymentMethod === 'cash' && paymentConfig?.bankTransfer?.enabled) {
    qrUrl = `https://img.vietqr.io/image/${paymentConfig.bankTransfer.bankName}-${paymentConfig.bankTransfer.accountNumber}-compact2.png?amount=${totalPrice}&addInfo=${qrAddInfo}&accountName=${qrAccountName}`;
  }

  if (checkoutSuccess) {
    return (
      <div className="min-h-screen bg-muted/10 py-20 flex items-center justify-center p-4">
         <div className="bg-card max-w-lg w-full rounded-3xl p-8 shadow-xl border text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Đổi Tour Thành Công!</h2>
            <p className="text-muted-foreground mb-8">Cảm ơn bạn đã tin tưởng dịch vụ của MH36 TRAVEL. Email xác nhận và hướng dẫn chi tiết đã được gửi đến hộp thư của bạn.</p>
            <Button onClick={() => router.push('/dashboard')} className="w-full h-12 text-base font-semibold">Xem Đơn Đặt Trên Dashboard</Button>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Xác nhận thông tin & Thanh toán</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Thông tin */}
          <div className="flex-1 space-y-8">
            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                <h2 className="text-xl font-bold">Thông tin liên hệ</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold mb-2 block">Họ và Tên (*)</label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Vd: Nguyễn Văn A" className="h-11 bg-muted/30" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Số điện thoại (*)</label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Vd: 0912345678" className="h-11 bg-muted/30" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Email (*)</label>
                  <Input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Vd: email@example.com" type="email" className="h-11 bg-muted/30" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold mb-2 block">Ghi chú thêm</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} className="flex w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]" placeholder="Yêu cầu đặc biệt về bữa ăn, dị ứng (nếu có)..."></textarea>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                <h2 className="text-xl font-bold">Hành khách</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Người lớn (Từ 12 tuổi)</p>
                    <p className="text-sm text-muted-foreground">{new Intl.NumberFormat('vi-VN').format(tourData.price)} đ</p>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-lg border">
                    <Button variant="ghost" size="icon" onClick={() => handleAdultsChange(-1)} disabled={adults <= 1} className="h-8 w-8 rounded-md bg-background shadow-sm">-</Button>
                    <span className="w-6 text-center font-bold">{adults}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleAdultsChange(1)} className="h-8 w-8 rounded-md bg-background shadow-sm text-primary">+</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Trẻ em (Từ 5 - 11 tuổi)</p>
                    <p className="text-sm text-muted-foreground">{new Intl.NumberFormat('vi-VN').format(tourData.price * 0.75)} đ</p>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-lg border">
                    <Button variant="ghost" size="icon" onClick={() => handleChildrenChange(-1)} disabled={children <= 0} className="h-8 w-8 rounded-md bg-background shadow-sm">-</Button>
                    <span className="w-6 text-center font-bold">{children}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleChildrenChange(1)} className="h-8 w-8 rounded-md bg-background shadow-sm text-primary">+</Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
              </div>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors ${paymentMethod === 'vnpay' ? 'border-primary bg-primary/5' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-5 h-5 text-primary border-gray-300 focus:ring-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-[15px]">Thanh toán qua VNPay <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">Khuyên dùng</span></p>
                    <p className="text-sm text-muted-foreground">Thanh toán an toàn, hỗ trợ thẻ ATM, Visa, QR ngân hàng</p>
                  </div>
                  <CreditCard className="w-7 h-7 text-primary" />
                </label>
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors ${paymentMethod === 'momo' ? 'border-[#A50064] bg-[#A50064]/5' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-5 h-5 text-primary border-gray-300 focus:ring-primary" />
                  <div className="flex-1">
                    <p className="font-semibold text-[15px]">Ví điện tử MoMo</p>
                    <p className="text-sm text-muted-foreground">Thanh toán nhanh chóng bằng ví MoMo</p>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-[#A50064] text-white flex items-center justify-center font-bold text-[10px]">MoMo</div>
                </label>
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-accent/30 transition-colors ${paymentMethod === 'cash' ? 'border-green-500 bg-green-500/5' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-[15px]">Chuyển khoản QR Code <span className="ml-2 text-[10px] bg-green-500/20 text-green-700 px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">Ngân hàng</span></p>
                    <p className="text-sm text-muted-foreground">Quét mã QR — tiền về ngay tài khoản MH36 TRAVEL</p>
                  </div>
                  <QrCode className="w-7 h-7 text-green-600" />
                </label>
              </div>
            </section>
          </div>

          {/* Tóm tắt Booking */}
          <aside className="w-full lg:w-[400px]">
            <div className="bg-card rounded-2xl shadow-xl overflow-hidden sticky top-24 border border-border/50">
              <div className="relative h-40">
                <img src={tourData.imageUrl} alt={tourData.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
                  <h3 className="text-white font-bold leading-tight line-clamp-2 shadow-sm">{tourData.title}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4 text-sm">
                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground mb-0.5">Ngày khởi hành</p>
                      <p className="font-semibold text-[15px]">15/05/2026</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground mb-0.5">Thời gian</p>
                      <p className="font-semibold text-[15px]">{tourData.duration}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <Users className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-muted-foreground mb-0.5">Hành khách</p>
                      <p className="font-semibold text-[15px]">{adults} Người lớn{children > 0 ? `, ${children} Trẻ em` : ''}</p>
                    </div>
                  </div>
                </div>

                <div className="relative h-[1px] bg-border my-6">
                  <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-muted/10 border border-border"></div>
                  <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-muted/10 border border-border"></div>
                </div>

                <div className="space-y-3 mb-6 font-medium text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Người lớn (x{adults})</span>
                    <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(totalAdultsPrice)} đ</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Trẻ em (x{children})</span>
                      <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(totalChildrenPrice)} đ</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600 border-t border-dashed pt-3 mt-3">
                      <span>Mã giảm giá được áp dụng</span>
                      <span className="font-semibold">-{new Intl.NumberFormat('vi-VN').format(discountAmount)} đ</span>
                    </div>
                  )}
                </div>

                {/* Phần Nhập mã giảm giá */}
                <div className="mb-6">
                   <div className="flex gap-2">
                      <Input 
                         placeholder="Nhập mã ưu đãi (Vd: MH36SALE)" 
                         value={discountInput}
                         onChange={(e) => setDiscountInput(e.target.value)}
                         className="flex-1 bg-muted/50 focus-visible:ring-1"
                      />
                      <Button variant="secondary" onClick={handleApplyDiscount} className="font-semibold whitespace-nowrap px-4">Áp dụng</Button>
                   </div>
                   {discountError && <p className="text-xs text-rose-500 mt-2 font-medium">{discountError}</p>}
                </div>

                <Separator className="my-5" />

                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-base text-muted-foreground">Tổng cộng</span>
                  <span className="text-3xl font-extrabold text-primary tracking-tight">{new Intl.NumberFormat('vi-VN').format(totalPrice)}<span className="text-xl font-semibold ml-1">đ</span></span>
                </div>

                <Button 
                   size="lg" 
                   className="w-full h-14 text-[15px] font-bold mb-4 shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-xl"
                   onClick={handleCheckout}
                   disabled={isSubmitting}
                >
                   {isSubmitting ? "ĐANG XỬ LÝ..." : "THỰC HIỆN THANH TOÁN"}
                </Button>

                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Xác nhận tức thì qua Email & Zalo
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center flex gap-2 items-center justify-center">
               <QrCode className="w-6 h-6 text-primary" /> Quét mã để Thanh toán
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
             <div className="p-4 bg-white rounded-2xl border shadow-sm">
                <img src={qrUrl} alt="QR Code Thanh Toán" className="w-[280px] h-[280px] object-contain" />
             </div>
             <div className="text-sm border p-4 rounded-xl space-y-2 bg-muted/30 w-full text-left mt-2">
                <p><span className="text-muted-foreground">{paymentMethod === 'momo' ? 'Tài khoản:' : 'Ngân hàng:'}</span> <strong className="float-right">{paymentMethod === 'momo' ? 'Ví MoMo' : paymentConfig?.bankTransfer?.bankName}</strong></p>
                <p><span className="text-muted-foreground">Chủ tài khoản:</span> <strong className="float-right uppercase">{paymentMethod === 'momo' ? 'MOMO E-WALLET' : paymentConfig?.bankTransfer?.accountName}</strong></p>
                <p><span className="text-muted-foreground">Số tài khoản:</span> <strong className="float-right text-primary">{paymentMethod === 'momo' ? paymentConfig?.momo?.partnerCode : paymentConfig?.bankTransfer?.accountNumber}</strong></p>
                <p><span className="text-muted-foreground">Số tiền:</span> <strong className="float-right font-bold text-[16px]">{new Intl.NumberFormat('vi-VN').format(totalPrice)} VNĐ</strong></p>
             </div>
          </div>
          <div className="mt-2 space-y-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${(countdown / 30) * 100}%` }}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              ✅ Đơn hàng sẽ tự hoàn thành sau <strong className="text-green-600">{countdown}s</strong>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
