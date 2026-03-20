"use client";

import Link from 'next/link';
import { Package, Users, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      {/* Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Tổng Booking</p>
            <h3 className="text-2xl font-bold tracking-tight">1,248</h3>
            <p className="text-xs text-green-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% tháng này
            </p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Doanh thu</p>
            <h3 className="text-2xl font-bold tracking-tight">3.24B ₫</h3>
            <p className="text-xs text-green-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +8.4% tháng này
            </p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Tour đang mở</p>
            <h3 className="text-2xl font-bold tracking-tight">86</h3>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Trên tổng 120 tours
            </p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Khách hàng mới</p>
            <h3 className="text-2xl font-bold tracking-tight">423</h3>
            <p className="text-xs text-green-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +24% tháng này
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart Placeholder */}
         <div className="lg:col-span-2 bg-card border border-border/50 shadow-sm rounded-2xl p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold tracking-tight mb-4 text-foreground">Biểu đồ doanh thu</h3>
            <div className="flex-1 bg-muted/20 rounded-xl border border-dashed border-border/60 flex items-center justify-center text-muted-foreground text-sm font-medium">
              Recharts Visualization (Revenue over time)
            </div>
         </div>

         {/* Recent Bookings */}
         <div className="bg-card border border-border/50 shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-bold tracking-tight mb-6">Booking gần đây</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 border border-border/50">
                    <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate flex-1">
                    <p className="font-semibold text-sm truncate">Khách hàng {i}</p>
                    <p className="text-xs text-muted-foreground truncate">Tour Đà Nẵng 3N2Đ - 2 NL</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-primary">7.0M ₫</p>
                    <p className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-sm inline-block mt-0.5 uppercase tracking-wide">Chờ duyệt</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/bookings" className="block w-full mt-8 py-2.5 text-center text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors border border-primary/20">
              Xem tất cả đơn
            </Link>
         </div>
      </div>
    </div>
  );
}
