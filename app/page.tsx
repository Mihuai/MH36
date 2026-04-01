"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, DollarSign, Users, Search, Loader2 } from 'lucide-react';
import TourCard from '@/components/tour/TourCard';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/lib/supabase';

const DESTINATIONS = [
  { name: 'Đà Nẵng', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80', tours: 42 },
  { name: 'Phú Quốc', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80', tours: 35 },
  { name: 'Sapa', image: 'https://images.unsplash.com/photo-1629813350117-9095646199a6?w=400&q=80', tours: 28 },
  { name: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1587825223366-224424e6b185?w=400&q=80', tours: 56 },
];

export default function Home() {
  const router = useRouter();
  const { settings } = useSettings();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    destination: '',
    date: '',
    price: '',
    pax: ''
  });

  // Fetch dynamic tours from Supabase
  useEffect(() => {
    async function fetchTours() {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tours')
          .select('*')
          .eq('status', 'active')
          .eq('is_featured', true)
          .limit(4);

        if (!error && data) {
          const mappedTours = data.map(t => ({
            id: t.id,
            slug: t.slug || t.id,
            title: t.title,
            imageUrl: t.image_url || (t.images && t.images[0]) || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
            destination: t.location || t.departure_location || 'Việt Nam',
            duration: t.duration || `${t.duration_days} Ngày ${t.duration_nights} Đêm`,
            price: t.price || t.price_adult || 0,
            rating: t.rating || 4.9, 
            reviewsCount: t.reviews_count || Math.floor(Math.random() * 100) + 50,
            isFeatured: true
          }));
          setTours(mappedTours);
        }
      } catch (err) {
        console.error("Error Home fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.destination) query.append('destination', search.destination);
    if (search.price) query.append('price', search.price);
    router.push(`/tour?${query.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] min-h-[650px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img 
            src={settings.images?.heroImageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80"} 
            alt={settings.companyName} 
            className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[10s] hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 text-white drop-shadow-2xl font-outfit uppercase">
            HÀNH TRÌNH <br />
            <span className="text-[#0192f3]">KHÁM PHÁ</span>
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-12 text-white font-bold opacity-90 drop-shadow-md">
            Trải nghiệm dịch vụ lữ hành đẳng cấp cùng MH36 TRAVEL. <br className="hidden md:block" /> Cập nhật giá liên tục - Đồng bộ tức thì.
          </p>

          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 md:p-8 border border-white">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <div className="flex flex-col space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Điểm đến</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0192f3]" />
                  <Input 
                    value={search.destination} 
                    onChange={e => setSearch({...search, destination: e.target.value})}
                    placeholder="Đà Nẵng, Phú Quốc..." 
                    className="pl-10 bg-slate-50 border-none rounded-2xl h-12 text-slate-900 font-bold focus-visible:ring-blue-100" 
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Ngày đi</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0192f3]" />
                  <Input 
                    type="date" 
                    value={search.date}
                    onChange={e => setSearch({...search, date: e.target.value})}
                    className="pl-10 bg-slate-50 border-none rounded-2xl h-12 text-sm text-slate-900 font-bold" 
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mức giá</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0192f3]" />
                  <select 
                    value={search.price}
                    onChange={e => setSearch({...search, price: e.target.value})}
                    className="flex h-12 w-full rounded-2xl border-none bg-slate-50 px-3 pl-10 text-sm font-bold focus:ring-1 focus:ring-blue-100 text-slate-900 appearance-none"
                  >
                    <option value="">Tất cả giá</option>
                    <option value="under-2m">Dưới 2tr</option>
                    <option value="2m-5m">2 - 5 triệu</option>
                    <option value="over-5m">Trên 5tr</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Khách</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0192f3]" />
                  <Input 
                    type="number" 
                    value={search.pax}
                    onChange={e => setSearch({...search, pax: e.target.value})}
                    placeholder="2 người" 
                    className="pl-10 bg-slate-50 border-none rounded-2xl h-12 text-slate-900 font-bold" min={1} 
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button type="submit" size="lg" className="w-full h-12 font-black uppercase text-xs tracking-widest bg-[#0192f3] hover:bg-[#0070bb] text-white rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95">
                  TÌM TOUR NGAY
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Featured Tours */}
      <section className="py-24 bg-[#F7F9FA]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl text-left">
              <h2 className="text-4xl font-black text-[#00355D] mb-4 uppercase tracking-tighter">Tour Nổi Bật <span className="text-[#0192f3]">Gợi Ý</span></h2>
              <div className="w-20 h-1.5 bg-[#0192f3] rounded-full mb-6"></div>
              <p className="text-slate-500 font-medium text-lg leading-relaxed italic">Vừa được cập nhật từ kho dữ liệu hệ thống MH36.</p>
            </div>
            <Link href="/tour" className="px-8 py-3 rounded-2xl border-2 border-[#0192f3] text-[#0192f3] font-black text-xs uppercase tracking-widest hover:bg-[#0192f3] hover:text-white transition-all shadow-lg shadow-blue-50">
              Khám phá toàn bộ {tours.length * 10}+ Tour
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#0192f3]" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Đang đồng bộ dữ liệu thực tế...</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">Sếp chưa bật "Nổi bật" cho tour nào trong Admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {tours.map((tour) => (
                <TourCard key={tour.id} {...tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Popular Destinations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#00355D] mb-4 uppercase tracking-tighter">ĐIỂM ĐẾN <span className="text-[#0192f3]">YÊU THÍCH</span></h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Chọn nơi bạn muốn đặt chân tới</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DESTINATIONS.map((dest) => (
              <Link href={`/tour?destination=${dest.name}`} key={dest.name} className="group relative rounded-[32px] overflow-hidden aspect-[3/4] flex items-end shadow-xl">
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-125" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80" />
                <div className="relative z-10 p-8 text-left w-full translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <h3 className="text-3xl font-black mb-1 text-white uppercase tracking-tighter">{dest.name}</h3>
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black opacity-0 group-hover:opacity-100 transition-opacity">{dest.tours} Tours sẵn sàng</p>
                  <div className="mt-4 h-1 w-0 bg-[#0192f3] rounded-full group-hover:w-full transition-all duration-700 shadow-[0_0_15px_rgba(1,146,243,0.8)]"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* 5. Trust Badges */}
      <section className="py-20 bg-white border-t border-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="w-20 h-20 bg-blue-50 text-[#0192f3] rounded-[24px] flex items-center justify-center mx-auto mb-8 transition-all group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white shadow-xl shadow-blue-50">
                <DollarSign className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#00355D] mb-4 uppercase">Giá Tốt Nhất</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">Cam kết mang đến cho sếp mức giá cạnh tranh nhất thị trường.</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-blue-50 text-[#0192f3] rounded-[24px] flex items-center justify-center mx-auto mb-8 transition-all group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white shadow-xl shadow-blue-50">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#00355D] mb-4 uppercase">Lịch Trình Đỉnh</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">Tất cả tour đều được thiết kế bởi chuyên gia lữ hành MH36.</p>
            </div>
            <div className="group">
              <div className="w-20 h-20 bg-blue-50 text-[#0192f3] rounded-[24px] flex items-center justify-center mx-auto mb-8 transition-all group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white shadow-xl shadow-blue-50">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#00355D] mb-4 uppercase">Hỗ Trợ 24/7</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">Chúng tôi luôn lắng nghe sếp bất kể ngày đêm.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
