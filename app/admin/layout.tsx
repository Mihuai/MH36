"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut, CreditCard, Bell, MessageCircle, Ticket, Globe, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/dang-nhap');
    } else if (user?.role !== 'admin') {
      router.replace('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [user, isAuthenticated, router]);

  if (isChecking) {
    return (
       <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
         <div className="text-center">
            <h2 className="text-muted-foreground animate-pulse text-lg font-medium mb-2">Đang xác thực quyền Admin...</h2>
         </div>
       </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r border-border/60 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/60 shrink-0">
          <Link href="/admin"><span className="text-xl font-black tracking-tighter text-[#0192f3]">MH36 ADMIN</span></Link>
        </div>
        
        <div className="p-4 border-b border-border/60">
           <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0192f3] hover:bg-[#0070bb] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-md shadow-blue-100 group">
              <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
              Quay về Website
              <ArrowUpRight className="w-3 h-3 opacity-50" />
           </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quản lý chung</p>
          <nav className="space-y-1 mb-8">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" /> Tổng quan
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <ShoppingCart className="w-5 h-5" /> Đơn đặt Tour <span className="ml-auto bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">12</span>
            </Link>
            <Link href="/admin/tours" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <Package className="w-5 h-5" /> Quản lý Tour
            </Link>
            <Link href="/admin/promotions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <Ticket className="w-5 h-5" /> Khuyến Mãi
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <Users className="w-5 h-5" /> Khách hàng
            </Link>
            <Link href="/admin/chat" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <MessageCircle className="w-5 h-5" /> Hỗ trợ khách hàng <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>
            </Link>
          </nav>

          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cấu hình Hệ thống</p>
          <nav className="space-y-1">
            <Link href="/admin/settings/payment" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <CreditCard className="w-5 h-5" /> Cổng thanh toán
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
              <Settings className="w-5 h-5" /> Cài đặt chung
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-border/60 shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold uppercase">{user?.name?.charAt(0) || 'A'}</div>
            <div>
              <p className="text-sm font-bold truncate max-w-[120px]">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email || 'admin@mh36.com'}</p>
            </div>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-50 font-medium transition-colors border border-transparent focus-visible:border-rose-300">
            <LogOut className="w-5 h-5" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border/60 flex items-center justify-between px-6 lg:px-10 shrink-0 relative z-10 shadow-sm">
          <h1 className="text-xl font-bold flex items-center"><span className="text-muted-foreground font-normal text-sm mr-2 hidden sm:inline-block">Dashboard Admin /</span> Cấu hình hệ thống</h1>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-card" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
