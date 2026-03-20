"use client";

import { User, Map, LogOut, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Basic protection logic
    if (!isAuthenticated) {
      router.replace('/dang-nhap');
    } else if (user?.role === 'admin') {
      router.replace('/admin');
    } else {
      setIsChecking(false);
    }
  }, [user, isAuthenticated, router]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center p-6"><h2 className="text-muted-foreground animate-pulse text-lg font-medium">Đang kiểm tra quyền truy cập...</h2></div>;
  }
  
  return (
    <div className="bg-muted/10 min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Tài khoản của tôi</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-72 shrink-0">
            <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-4 sticky top-24">
              <div className="flex items-center gap-4 p-4 mb-4 border-b">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-lg max-w-[140px] truncate">{user?.name || 'Tài khoản'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{user?.role === 'admin' ? '👑 Quản Trị Viên' : '✨ Thành viên hạng Vàng'}</p>
                </div>
              </div>
              
              <nav className="space-y-1.5">
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${pathname === '/dashboard' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <User className="w-5 h-5" /> Thông tin cá nhân
                </Link>
                <Link 
                  href="/dashboard/tours" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${pathname === '/dashboard/tours' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Map className="w-5 h-5" /> Tour đã đặt <span className="ml-auto bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>
                </Link>
                <Link 
                  href="/dashboard/reviews" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${pathname === '/dashboard/reviews' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Star className="w-5 h-5" /> Đánh giá của tôi
                </Link>
                <Separator className="my-2" />
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 font-medium text-rose-500 transition-colors">
                  <LogOut className="w-5 h-5" /> Đăng xuất
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
