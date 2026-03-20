import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  return (
    <div className="bg-muted/10 min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">Liên Hệ Với MH36</h1>
          <p className="text-muted-foreground text-lg">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. Hãy gửi lại lời nhắn nếu bạn cần trợ giúp về việc đặt tour.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Thông Tin Chi Tiết</h2>
              
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                     <MapPin className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg mb-1">Trụ sở chính</h3>
                     <p className="text-muted-foreground text-sm">Tầng 36, Tòa nhà Landmark 81, Vinhomes Central Park, Q. Bình Thạnh, TP.HCM</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                     <Phone className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg mb-1">Điện thoại</h3>
                     <p className="text-muted-foreground text-sm">Hotline: 1900 3636<br/>Hỗ trợ Zalo: 090 123 4567</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                     <Mail className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg mb-1">Email</h3>
                     <p className="text-muted-foreground text-sm">support@mh36travel.com<br/>partnership@mh36travel.com</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                     <Clock className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg mb-1">Giờ làm việc</h3>
                     <p className="text-muted-foreground text-sm">Thứ 2 - Thứ 6: 08:00 - 18:00<br/>Thứ 7 - CN: 09:00 - 15:00</p>
                   </div>
                 </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="w-full h-[300px] rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-muted relative flex items-center justify-center">
              <span className="text-muted-foreground font-medium flex flex-col items-center gap-2">
                <MapPin className="w-8 h-8 opacity-50" />
                Google Maps Embed
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card p-8 md:p-10 rounded-2xl shadow-sm border border-border/50">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Gửi Tin Nhắn</h2>
              <p className="text-muted-foreground mb-8">Điền thông tin vào mẫu bên dưới, chuyên viên của chúng tôi sẽ liên hệ lại với bạn trong vòng 24h.</p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Họ và tên *</label>
                    <Input placeholder="Vd: Nguyễn Văn A" className="h-12 bg-muted/30" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Số điện thoại *</label>
                    <Input type="tel" placeholder="09xxxx..." className="h-12 bg-muted/30" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email</label>
                  <Input type="email" placeholder="example@email.com" className="h-12 bg-muted/30" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Chủ đề cần tư vấn</label>
                  <select className="flex h-12 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                    <option>Hỗ trợ đặt tour</option>
                    <option>Thiết kế tour đoàn riêng</option>
                    <option>Phản ánh dịch vụ</option>
                    <option>Hợp tác / Đối tác</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Nội dung chi tiết *</label>
                  <textarea 
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    placeholder="Vui lòng mô tả yêu cầu của bạn chi tiết nhất có thể..."
                    required
                  ></textarea>
                </div>

                <Button type="submit" size="lg" className="h-14 w-full md:w-auto px-10 text-lg font-bold shadow-lg gap-2 cursor-pointer mt-4">
                  <Send className="w-5 h-5 -ml-1" /> Gửi Yêu Cầu
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
