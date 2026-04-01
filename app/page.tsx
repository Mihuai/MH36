"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, DollarSign, Users, Search } from 'lucide-react';
import TourCard from '@/components/tour/TourCard';

import { useSettings } from '@/contexts/SettingsContext';

// Dummy data for featured tours
const FEATURED_TOURS = [
  {
    id: "1",
    slug: "kham-pha-da-nang-3-ngay-2-dem",
    title: "Khám phá Đà Nẵng - Hội An - Bà Nà Hills trọn gói",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    destination: "Đà Nẵng",
    duration: "3 Ngày 2 Đêm",
    price: 3500000,
    rating: 4.8,
    reviewsCount: 124,
    isFeatured: true
  },
  {
    id: "2",
    slug: "nghi-duong-phu-quoc",
    title: "Nghỉ dưỡng Phú Quốc - Khám phá Nam Đảo & VinWonders",
    imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80",
    destination: "Phú Quốc",
    duration: "4 Ngày 3 Đêm",
    price: 5200000,
    rating: 4.9,
    reviewsCount: 89,
    isFeatured: true
  },
  {
    id: "3",
    slug: "sapa-fansipan",
    title: "Sapa mùa lúa chín - Chinh phục đỉnh Fansipan",
    imageUrl: "https://images.unsplash.com/photo-1629813350117-9095646199a6?w=800&q=80",
    destination: "Sapa",
    duration: "2 Ngày 1 Đêm",
    price: 2100000,
    rating: 4.7,
    reviewsCount: 256
  },
  {
    id: "4",
    slug: "nha-trang-bien-xanh",
    title: "Nha Trang - Lặn ngắm san hô & Tắm bùn khoáng",
    imageUrl: "https://images.unsplash.com/photo-1582294109151-e1293fbffb45?w=800&q=80",
    destination: "Nha Trang",
    duration: "3 Ngày 2 Đêm",
    price: 3100000,
    rating: 4.6,
    reviewsCount: 112
  }
];

const DESTINATIONS = [
  { name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80', tours: 42 },
  { name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80', tours: 35 },
  { name: 'Sapa', image: 'https://images.unsplash.com/photo-1629813350117-9095646199a6?w=400&q=80', tours: 28 },
  { name: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1587825223366-224424e6b185?w=400&q=80', tours: 56 },
];

export default function Home() {
  const router = useRouter();
  const { settings } = useSettings();
  const [search, setSearch] = useState({
    destination: '',
    date: '',
    price: '',
    pax: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.destination) query.append('destination', search.destination);
    if (search.price) query.append('price', search.price);
    
    router.push(`/tour?${query.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-black">
          {/* Cannot use next/image with external URLs simply without configuring hostname in next.config, using img tag */}
          <img 
            src={settings.images?.heroImageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80"} 
            alt={settings.companyName} 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white animate-in fade-in slide-in-from-bottom-5 duration-1000">
            Khám phá thế giới cùng <br />
            <span className="text-[#D4AF37] mt-2 drop-shadow-[0_4px_15px_rgba(212,175,55,0.5)] block md:inline-block italic">
              {settings.companyName}
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/90 font-medium animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200 drop-shadow-md">
            Hàng ngàn tour du lịch hấp dẫn trong nước và quốc tế đang chờ đón bạn. <br className="hidden md:block" /> Trải nghiệm dịch vụ đẳng cấp với chi phí tối ưu nhất.
          </p>

          {/* 2. Thanh tìm kiếm Tour */}
          <div className="max-w-5xl mx-auto bg-background text-foreground rounded-2xl shadow-xl p-4 md:p-6 animate-in zoom-in-95 duration-700 delay-300 border border-border/50">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="flex flex-col space-y-1.5 focus-within:text-primary relative text-left">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Điểm đến</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={search.destination} 
                    onChange={e => setSearch({...search, destination: e.target.value})}
                    placeholder="Bạn muốn đi đâu?" 
                    className="pl-9 bg-accent/50 border-input hover:bg-accent focus-visible:ring-primary shadow-sm h-10" 
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 focus-within:text-primary relative text-left">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Ngày khởi hành</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    value={search.date}
                    onChange={e => setSearch({...search, date: e.target.value})}
                    className="pl-9 bg-accent/50 border-input hover:bg-accent focus-visible:ring-primary shadow-sm h-10 text-sm block" 
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 focus-within:text-primary relative text-left">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Mức giá</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select 
                    value={search.price}
                    onChange={e => setSearch({...search, price: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input shadow-sm bg-accent/50 px-3 py-2 pl-9 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="">Tất cả mức giá</option>
                    <option value="under-2m">Dưới 2 triệu</option>
                    <option value="2m-5m">2 - 5 triệu</option>
                    <option value="over-5m">Trên 5 triệu</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 focus-within:text-primary relative text-left">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Số người</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    value={search.pax}
                    onChange={e => setSearch({...search, pax: e.target.value})}
                    placeholder="2 người" 
                    className="pl-9 bg-accent/50 border-input hover:bg-accent focus-visible:ring-primary shadow-sm h-10" min={1} 
                  />
                </div>
              </div>

              <div className="flex items-end lg:col-span-1">
                <Button type="submit" size="lg" className="w-full h-10 font-bold gap-2 text-md shadow-md">
                  <Search className="h-4 w-4" />
                  Tìm Tour
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Tour Nổi Bật */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4 text-foreground">Tour Du Lịch Nổi Bật</h2>
              <p className="text-muted-foreground text-lg">Những hành trình được yêu thích nhất với lịch trình hấp dẫn và dịch vụ đạt chuẩn 5 sao.</p>
            </div>
            <Link href="/tour" className={buttonVariants({ variant: "outline", size: "lg", className: "font-semibold shadow-sm" })}>
              Xem tất cả Tour
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_TOURS.map((tour) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Điểm đến phổ biến */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4 text-foreground">Điểm Đến Phổ Biến</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Khám phá vẻ đẹp bất tận của các danh lam thắng cảnh hàng đầu Việt Nam.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESTINATIONS.map((dest) => (
              <Link href={`/tour?destination=${dest.name}`} key={dest.name} className="group relative rounded-2xl overflow-hidden aspect-[3/4] flex items-end shadow-md">
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 p-6 text-white text-left w-full">
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{dest.name}</h3>
                  <div className="w-10 h-1 bg-primary mb-3 rounded-full transform origin-left transition-all duration-300 group-hover:w-16"></div>
                  <p className="text-sm text-white/90 font-medium">{dest.tours} Tours trải nghiệm</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* 5. Tại sao chọn chúng tôi & Đánh giá (Placeholder) */}
      <section className="py-20 bg-primary/5 border-t border-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-12 text-foreground">Vì sao chọn MH36 TRAVEL?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Giá Cả Tốt Nhất</h3>
              <p className="text-muted-foreground">Cam kết mang đến cho bạn các chương trình du lịch với mức giá ưu đãi và rõ ràng nhất.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lịch Trình Hấp Dẫn</h3>
              <p className="text-muted-foreground">Lịch trình đa dạng, liên tục được cập nhật theo xu hướng mang lại trải nghiệm đáng nhớ.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hỗ Trợ Tận Tâm</h3>
              <p className="text-muted-foreground">Đội ngũ chuyên viên tư vấn nhiệt tình, sẵn sàng hỗ trợ bạn 24/7 trong suốt hành trình.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
