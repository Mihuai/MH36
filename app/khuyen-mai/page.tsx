"use client";

import { useState } from 'react';
import { Clock, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const promotions = [
  {
    id: 1,
    title: "Khuyến mãi Hè 2026: Giảm đến 40% Tour Biển",
    description: "Áp dụng cho các tuyến Phú Quốc, Nha Trang, Đà Nẵng khởi hành từ tháng 5 đến tháng 8.",
    expiry: "Hết hạn: 30/05/2026",
    image: "https://images.unsplash.com/photo-1540202404-b71114227582?auto=format&fit=crop&w=800&q=80",
    code: "SUMMER40",
    discount: "Giảm 40%",
    color: "from-orange-400 to-rose-500"
  },
  {
    id: 2,
    title: "Sale sinh nhật MH36: Ưu đãi 2 Triệu VNĐ",
    description: "Dành riêng cho khách hàng thanh toán qua VNPAY với giá trị đơn hàng trên 10 triệu đồng.",
    expiry: "Hết hạn: 15/04/2026",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    code: "MH36HPBD",
    discount: "Giảm 2.000.000đ",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 3,
    title: "Tour Quốc tế: Mua 3 tặng 1",
    description: "Áp dụng cho nhóm khách đăng ký tour Hàn Quốc, Nhật Bản, Đài Loan.",
    expiry: "Hết hạn: 30/06/2026",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    code: "ASIA3GET1",
    discount: "Tặng 1 vé",
    color: "from-teal-400 to-cyan-500"
  }
];

function PromoCard({ promo }: { promo: typeof promotions[0] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-3 right-3 bg-gradient-to-r ${promo.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
          {promo.discount}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">{promo.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{promo.description}</p>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center text-xs text-rose-500 font-medium bg-rose-50 px-2.5 py-1 rounded-full w-fit">
            <Clock className="w-3.5 h-3.5 mr-1.5" /> {promo.expiry}
          </div>
          
          <div className="bg-muted/50 rounded-xl p-3 border border-dashed border-primary/30 flex items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Mã Giảm Giá</span>
              <span className="font-mono font-bold text-primary tracking-wide text-lg">{promo.code}</span>
            </div>
            <Button
              size="sm"
              variant={copied ? "default" : "outline"}
              className={`h-9 px-4 shadow-sm transition-all ${copied ? 'bg-green-500 hover:bg-green-600 border-green-500 text-white' : ''}`}
              onClick={handleCopy}
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 mr-1.5" /> Đã sao chép!</>
              ) : (
                <><Copy className="w-3.5 h-3.5 mr-1.5" /> Sao chép</>
              )}
            </Button>
          </div>

          <Link href="/tour">
            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary hover:bg-primary/5 font-semibold">
              Đặt tour ngay với mã này →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  return (
    <div className="bg-muted/10 min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-primary">Siêu Ưu Đãi & Khuyến Mãi</h1>
          <p className="text-muted-foreground text-lg">Sao chép mã giảm giá và dán vào ô mã giảm giá khi đặt tour để được khấu trừ ngay!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/tour">
            <Button size="lg" className="rounded-full px-8 shadow-md">
              Xem Tất Cả Tours <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
