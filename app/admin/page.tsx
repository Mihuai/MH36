"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Users, ShoppingCart, TrendingUp, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeTours: 0,
    totalUsers: 0,
    recentBookings: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!supabase) return;

      try {
        // 1. Total Bookings
        const { count: bookingCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        // 2. Total Revenue (Paid or Completed)
        const { data: revenueData } = await supabase
          .from('bookings')
          .select('total_price')
          .in('status', ['paid', 'completed', 'confirmed']);
        
        const revenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0) || 0;

        // 3. Active Tours
        const { count: activeToursCount } = await supabase
          .from('tours')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // 4. Total Users
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // 5. Recent Bookings (Join with tours)
        const { data: recent } = await supabase
          .from('bookings')
          .select(`
            id,
            customer_name,
            total_price,
            status,
            created_at,
            tours (title)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalBookings: bookingCount || 0,
          totalRevenue: revenue,
          activeTours: activeToursCount || 0,
          totalUsers: usersCount || 0,
          recentBookings: recent || []
        });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium">Đang tải báo cáo...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0192f3] flex items-center justify-center shrink-0 border border-blue-100">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Tổng Booking</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stats.totalBookings.toLocaleString()}</h3>
            <p className="text-[10px] text-[#0192f3] font-bold uppercase tracking-wider mt-1">
              Dữ liệu thực tế
            </p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Doanh thu</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {(stats.totalRevenue / 1000000000).toFixed(2)}B ₫
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Đã xác nhận thanh toán
            </p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0192f3] flex items-center justify-center shrink-0 border border-blue-100">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Tour đang mở</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stats.activeTours}</h3>
            <p className="text-[10px] text-[#0192f3] font-bold uppercase tracking-wider mt-1">
              Trạng thái Active
            </p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Tổng người dùng</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stats.totalUsers}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Tài khoản hệ thống
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart Placeholder */}
         <div className="lg:col-span-2 bg-card border border-border/50 shadow-sm rounded-2xl p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold tracking-tight text-slate-900">Biểu đồ tăng trưởng</h3>
              <select className="text-xs bg-muted/50 border border-border/50 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0192f3]">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
            <div className="flex-1 bg-blue-50/50 rounded-xl border border-dashed border-blue-200 flex flex-col items-center justify-center text-muted-foreground text-sm font-medium p-10 text-center">
              <TrendingUp className="w-10 h-10 mb-4 text-[#0192f3] opacity-40" />
              <p className="text-slate-600 opacity-80">Hệ thống đang tổng hợp dữ liệu biểu đồ...</p>
              <p className="text-[10px] mt-1 font-normal opacity-70">Tính năng này sẽ khả dụng sau khi có thêm dữ liệu giao dịch.</p>
            </div>
         </div>

         {/* Recent Bookings */}
         <div className="bg-card border border-border/50 shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-bold tracking-tight mb-6 text-slate-900">Booking gần đây</h3>
            <div className="space-y-6">
              {stats.recentBookings.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground text-sm">Chưa có booking nào.</p>
              ) : (
                stats.recentBookings.map((booking, idx) => (
                  <div key={booking.id} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-[#0192f3]/10 flex items-center justify-center shrink-0 border border-blue-100 text-[#0192f3] font-bold text-xs uppercase">
                      {booking.customer_name?.charAt(0) || "K"}
                    </div>
                    <div className="truncate flex-1">
                      <p className="font-semibold text-sm truncate text-slate-900">{booking.customer_name || "Khách hàng"}</p>
                      <p className="text-xs text-muted-foreground truncate">{booking.tours?.title || "Tour"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-[#0192f3]">{(booking.total_price / 1000000).toFixed(1)}M</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm inline-block mt-0.5 uppercase tracking-wide
                        ${booking.status === 'confirmed' || booking.status === 'paid' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 border border-slate-200'}
                      `}>
                        {booking.status === 'pending' ? 'Chờ duyệt' : booking.status === 'paid' ? 'Đã thu' : 'Xác nhận'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/admin/bookings" className="block w-full mt-8 py-2.5 text-center text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors border border-primary/20">
              Xem tất cả đơn
            </Link>
         </div>
      </div>
    </div>
  );
}
