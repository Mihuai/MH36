"use client";

import { MapPin, Calendar, Clock, Star, Check, X, Plane, Coffee, Camera, Share2, Heart } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const toursData: Record<string, any> = {
  "kham-pha-da-nang-3-ngay-2-dem": {
    id: "1",
    title: "Khám phá Đà Nẵng - Hội An - Bà Nà Hills trọn gói",
    destination: "Đà Nẵng, Việt Nam",
    duration: "3 Ngày 2 Đêm",
    price: 3500000,
    rating: 4.8,
    reviewsCount: 124,
    description: "Hành trình 3 ngày 2 đêm đưa bạn đến với Đà Nẵng – thành phố đáng sống nhất Việt Nam. Bạn sẽ được chiêm ngưỡng vẻ đẹp cổ kính của Phố cổ Hội An, thỏa sức vui chơi tại Bà Nà Hills - đường lên tiên cảnh, và thưởng thức những món ăn đặc sản miền Trung vô cùng hấp dẫn.",
    images: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
      "https://images.unsplash.com/photo-1576408242394-ca8eb06511b0?w=600&q=80",
      "https://images.unsplash.com/photo-1596422846543-75c6fc197bf4?w=600&q=80",
      "https://images.unsplash.com/photo-1610497552554-159a43aeb2da?w=600&q=80",
    ],
    includes: ["Vé máy bay khứ hồi", "Khách sạn 4 sao (2 đêm)", "Các bữa ăn theo chương trình", "Vé tham quan các điểm", "Hướng dẫn viên nhiệt tình", "Bảo hiểm du lịch"],
    excludes: ["Chi phí cá nhân", "Tiền tip cho HDV (không bắt buộc)", "Các dịch vụ ngoài chương trình"],
    itinerary: [
      {
        day: 1,
        title: "Đà Nẵng - Sơn Trà - Hội An",
        content: "Sáng: Đón khách tại sân bay Đà Nẵng, đưa về trung tâm nghỉ ngơi.\nChiều: Tham quan Bán đảo Sơn Trà, viếng Linh Ứng Tự.\nTối: Khởi hành đi Phố Cổ Hội An. Ăn tối với đặc sản Hội An. Bách bộ ngoạn cảnh phố cổ về đêm, ngắm đèn lồng."
      },
      {
        day: 2,
        title: "Bà Nà Hills - Đường lên tiên cảnh",
        content: "Sáng: Ăn sáng tại khách sạn. Khởi hành đi khu du lịch Bà Nà Hills. Ngồi cáp treo đạt 4 kỷ lục thế giới.\nTrưa: Ăn buffet tại Bà Nà.\nChiều: Vui chơi tại Fantasy Park - khu vui chơi trong nhà lớn nhất Việt Nam. Trở về trung tâm Đà Nẵng tắm biển Mỹ Khê.\nTối: Ăn tối hải sản. Tự do ngắm cảnh Cầu Rồng phun lửa, Cầu Tình Yêu."
      },
      {
        day: 3,
        title: "Mua sắm đặc sản - Tiễn khách",
        content: "Sáng: Ăn sáng. Tham quan mua sắm đặc sản miền Trung tại Chợ Hàn.\nTrưa: Ăn trưa tại nhà hàng. Đưa khách ra sân bay. Kết thúc chương trình."
      }
    ]
  },
  "nghi-duong-phu-quoc": {
    id: "2",
    title: "Nghỉ dưỡng Phú Quốc - Lặn ngắm san hô 4N3Đ",
    destination: "Phú Quốc, Kiên Giang",
    duration: "4 Ngày 3 Đêm",
    price: 4800000,
    rating: 4.9,
    reviewsCount: 312,
    description: "Trải nghiệm kỳ nghỉ tuyệt vời tại Đảo Ngọc Phú Quốc. Tham quan Grand World, lặn ngắm san hô tại Nam Đảo và thưởng thức hải sản tươi ngon. Du ngoạn cáp treo Hòn Thơm vượt biển dài nhất thế giới.",
    images: [
      "https://images.unsplash.com/photo-1592658826620-1a74d2a1005a?w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80",
      "https://images.unsplash.com/photo-1621535269784-06d203ddb7a6?w=600&q=80",
      "https://images.unsplash.com/photo-1582650005720-3b030431da64?w=600&q=80"
    ],
    includes: ["Vé máy bay khứ hồi Phú Quốc", "Khách sạn resort 4 sao (3 đêm)", "Vé Grand World & Safari", "Tàu câu cá lặn san hô", "Hướng dẫn viên nhiệt tình", "Bảo hiểm du lịch"],
    excludes: ["Chi phí cá nhân", "Tiền tip cho HDV (không bắt buộc)", "Các dịch vụ ngoài chương trình", "Vé cáp treo Hòn Thơm"],
    itinerary: [
      {
        day: 1,
        title: "Sân bay Phú Quốc - Grand World",
        content: "Sáng: Đón khách tại sân bay, nhận phòng resort.\nChiều: Tham quan thành phố không ngủ Grand World.\nTối: Xem show Tinh Hoa Việt Nam, dạo chợ đêm."
      },
      {
        day: 2,
        title: "Khám phá Nam Đảo - Lặn ngắm san hô",
        content: "Sáng: Lên tàu ra cá đảo phía Nam, lặn ngắm san hô.\nTrưa: Ăn trưa trên tàu.\nChiều: Tắm biển Bãi Sao - Cát trắng biển xanh."
      },
      {
        day: 3,
        title: "Vinpearl Safari - Sunset Sanato",
        content: "Sáng: Tham quan vườn thú mở Vinpearl Safari.\nChiều: Check in hoàng hôn tại Sunset Sanato Beach Club.\nTối: Tự do khám phá Chợ đêm Dinh Cậu."
      },
      {
        day: 4,
        title: "Mua sắm đặc sản - Tiễn khách",
        content: "Sáng: Nghỉ ngơi tại resort, mua sắm ngọc trai - hồ tiêu.\nTrưa: Ăn trưa. HDV đưa quý khách ra sân bay. Két thúc tour."
      }
    ]
  },
  "sapa-fansipan": {
    id: "3",
    title: "Sapa mùa lúa chín - Chinh phục đỉnh Fansipan",
    destination: "Sapa, Lào Cai",
    duration: "2 Ngày 1 Đêm",
    price: 2100000,
    rating: 4.7,
    reviewsCount: 256,
    description: "Hành trình ngắn ngày khám phá vẻ đẹp kỳ vĩ của núi rừng Tây Bắc. Tận mắt chiêm ngưỡng những dửa ruộng bậc thang mùa lúa chín vàng óng và chinh phục Nóc nhà Đông Dương - Đỉnh Fansipan bằng hệ thống cáp treo hiện đại nhất thế giới.",
    images: [
      "https://images.unsplash.com/photo-1629813350117-9095646199a6?w=800&q=80",
      "https://plus.unsplash.com/premium_photo-1691960249495-97fe0ef26d36?w=600&q=80",
      "https://images.unsplash.com/photo-1549488344-966953ed1816?w=600&q=80",
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=80"
    ],
    includes: ["Khách sạn 3 sao Điện Biên Phủ", "Xe giường nằm khứ hồi Hà Nội - Sapa", "Vé cáp treo Fansipan Khứ hồi", "Các bữa ăn đặc sản Tây Bắc", "Bảo hiểm du lịch"],
    excludes: ["Chi phí cá nhân", "Tiền tip cho HDV (không bắt buộc)"],
    itinerary: [
      {
        day: 1,
        title: "Hà Nội - Sapa - Bản Cát Cát",
        content: "Sáng: 6h30 Khởi hành đi Sapa bằng xe Giường Nằm.\nTrưa: Đến Sapa, nhận phòng, ăn trưa.\nChiều: Hướng dẫn viên đưa đi thăm Bản Cát Cát - nơi sinh sống của người H'Mông Đen, ngắm thác thủy điện.\nTối: Ăn tối đặc sản lợn quay, lẩu cá tầm. Tự do khám phá nhà thờ đá Sapa."
      },
      {
        day: 2,
        title: "Chinh phục Đỉnh Fansipan - Hà Nội",
        content: "Sáng: Ăn sáng tại khách sạn. HDV đưa quý khách ra nhà ga Cáp treo để lên Đỉnh Fansipan ngắm cổng trời.\nTrưa: Quay về thị trấn trả phòng, ăn trưa.\nChiều: 14h00 lên xe Giường Nằm quay về Hà Nội. 20h00 có mặt tại phố cổ. Kết thúc."
      }
    ]
  },
  "nha-trang-bien-xanh": {
    id: "4",
    title: "Nha Trang - Lặn ngắm san hô & Tắm bùn khoáng",
    destination: "Nha Trang, Khánh Hòa",
    duration: "3 Ngày 2 Đêm",
    price: 3100000,
    rating: 4.6,
    reviewsCount: 112,
    description: "Tận hưởng làn nước trong xanh và bãi cát trắng mịn của phố biển Nha Trang. Trải nghiệm tour lặn biển ngắm san hô tại Hòn Mun, thư giãn tắm bùn khoáng nóng Tháp Bà và thưởng thức hải sản tươi rói đặc trưng vùng biển Nam Trung Bộ.",
    images: [
      "https://images.unsplash.com/photo-1582294109151-e1293fbffb45?w=800&q=80",
      "https://images.unsplash.com/photo-1627448865667-bb891e4b9de4?w=600&q=80",
      "https://images.unsplash.com/photo-1588665798950-8de6d0da3085?w=600&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80"
    ],
    includes: ["Khách sạn gần biển", "Tàu lặn ngắm san hô Hòn Mun", "Vé tắm bùn khoáng nóng", "Ăn uống theo chương trình", "Xe đưa đón sân bay Cam Ranh", "Bảo hiểm du lịch"],
    excludes: ["Vé máy bay khứ hồi (Báo giá riêng)", "Chi phí cá nhân", "Các dịch vụ trò chơi cảm giác mạnh trên biển"],
    itinerary: [
      {
        day: 1,
        title: "Sân bay Cam Ranh - Nha Trang - Tháp Bà Ponagar",
        content: "Chiều: Đón sân bay Cam Ranh, đưa về khách sạn nhận phòng.\nTối: Đi tham quan Tháp Bà Ponagar, ăn tối bánh xèo mực."
      },
      {
        day: 2,
        title: "Tour 3 Đảo - Lặn ngắm san hô",
        content: "Sáng: 8h00 Xe đón xuống cảng, lên tàu lặn biển Hòn Mun. Ngắm hệ sinh thái san hô đa dạng.\nTrưa: Ăn trưa trên làng chài.\nChiều: Di chuyển đến Hòn Tằm tắm bùn khoáng nóng thư giãn.\nTối: Thưởng thức hải sản dọc đường Trần Phú."
      },
      {
        day: 3,
        title: "Chợ Đầm - Tiễn khách",
        content: "Sáng: Tự do tắm biển, ghé Chợ Đầm mua quà hải sản khô, chả cá Nha Trang.\nTrưa: Trả phòng, Đưa lên sân bay Cam Ranh. Hẹn gặp lại."
      }
    ]
  }
};

export default function TourDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  
  // Unwrap slug mapping fallback
  const slug = (params?.slug as string);
  const tour = toursData[slug];

  if (!tour) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">Lỗi 404</h1>
        <p className="text-muted-foreground mb-6 text-lg">Tour bạn tìm kiếm không tồn tại hoặc đã bị gỡ.</p>
        <Link href="/tour" className={buttonVariants({ variant: "default" })}>
          Xem các Tour khác
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* 1. Header & Image Gallery */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{tour.duration}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1 text-primary" />
                {tour.destination}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{tour.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center text-amber-500 font-medium">
                <Star className="w-4 h-4 fill-amber-500 mr-1" />
                {tour.rating} <span className="text-muted-foreground ml-1 underline cursor-pointer">({tour.reviewsCount} đánh giá)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0 border-none items-start">
            <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 rounded-full"><Share2 className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50"><Heart className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Masonry-like Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 row-span-2 relative group cursor-pointer bg-muted/20">
            <img src={tour.images[0]} alt="Main Image" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
          </div>
          <div className="relative group cursor-pointer bg-muted/20">
            <img src={tour.images[1]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="relative group cursor-pointer border-none bg-muted/20">
            <img src={tour.images[2]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="relative group cursor-pointer md:col-span-2 border-none bg-muted/20">
            <img src={tour.images[3]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <Dialog>
              <DialogTrigger className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40 cursor-pointer w-full h-full border-none">
                <Button variant="secondary" className="font-semibold shadow-sm pointer-events-none">Xem tất cả ảnh</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:rounded-2xl p-6">
                <div className="space-y-4">
                   <h2 className="text-2xl font-bold mb-4">Thư viện Ảnh: {tour.title}</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {tour.images.map((img: string, i: number) => (
                       <img key={i} src={img} alt={`Preview ${i}`} className="w-full h-auto rounded-xl shadow-sm border object-cover" />
                     ))}
                   </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-12">
            {/* Giới thiệu */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Giới thiệu Tour</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{tour.description}</p>
            </section>

            <Separator />

            {/* Dịch vụ Bao gồm/Không bao gồm */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center"><Check className="text-green-500 mr-2" /> Dịch vụ bao gồm</h3>
                <ul className="space-y-3">
                  {tour.includes.map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-3 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center"><X className="text-rose-500 mr-2" /> Không bao gồm</h3>
                <ul className="space-y-3">
                  {tour.excludes.map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-3 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <Separator />

            {/* Lịch trình */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Lịch trình chi tiết</h2>
              <div className="space-y-8">
                {tour.itinerary.map((day: any) => (
                  <div key={day.day} className="flex gap-4 md:gap-6 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 z-10">
                        N{day.day}
                      </div>
                      {day.day !== tour.itinerary.length && <div className="w-[1px] h-full bg-border absolute top-10" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <h3 className="text-xl font-semibold mb-3 flex items-center">
                        <span className="mr-2">Ngày {day.day}:</span> {day.title}
                      </h3>
                      <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-muted-foreground whitespace-pre-line leading-relaxed">
                        {day.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Booking Sidebar (Right) */}
          <aside className="w-full lg:w-1/3 xl:w-[350px]">
            <div className="bg-card border border-border rounded-2xl shadow-xl sticky top-24 overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-border/50">
                <p className="text-sm tracking-wide text-muted-foreground mb-1 uppercase font-semibold">Giá trọn gói</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-primary">{new Intl.NumberFormat('vi-VN').format(tour.price)}</span>
                  <span className="font-semibold text-primary">đ</span>
                  <span className="text-muted-foreground text-sm">/khách</span>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Ngày khởi hành dự kiến</label>
                  <Input type="date" className="h-11 bg-accent/50 cursor-pointer text-sm" />
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-semibold mb-2 block">Người lớn</label>
                    <Input type="number" defaultValue={2} min={1} className="h-11 bg-accent/50 text-center font-medium" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold mb-2 block">Trẻ em</label>
                    <Input type="number" defaultValue={0} min={0} className="h-11 bg-accent/50 text-center font-medium" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-muted-foreground font-medium">Tạm tính (2 x {new Intl.NumberFormat('vi-VN').format(tour.price)})</span>
                    <span className="font-bold text-foreground text-base">{new Intl.NumberFormat('vi-VN').format(tour.price * 2)} đ</span>
                  </div>
                  
                  {user?.role === 'admin' ? (
                    <Button size="lg" disabled className="w-full h-12 text-md font-bold shadow-lg opacity-80 cursor-not-allowed cursor-help" title="Tài khoản Quản trị viên không thể thực hiện Đặt Tour.">
                      ADMIN KHÔNG THỂ ĐẶT TOUR
                    </Button>
                  ) : (
                    <a href={`/booking/${tour.id}`} className={buttonVariants({ size: "lg", className: "w-full h-12 text-md font-bold shadow-lg" })}>
                      ĐẶT TOUR NGAY
                    </a>
                  )}
                  <p className="text-xs text-center text-muted-foreground mt-3">Không tính phí khi thay đổi ngày khởi hành (trước 7 ngày)</p>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
