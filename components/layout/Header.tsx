"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from '@/components/ui/navigation-menu';
import { Search, Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            {settings.images?.logoUrl ? (
              <img src={settings.images.logoUrl} alt={settings.companyName} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-2xl font-black tracking-tighter drop-shadow-sm group-hover:drop-shadow-md transition-all italic text-[#0192f3]">
                MH36 TRAVEL
              </span>
            )}
          </Link>
          
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Điểm đến</NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white border-none shadow-none">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white rounded-xl shadow-2xl border border-slate-100 z-[999] relative">
                      {['Đà Nẵng', 'Phú Quốc', 'Nha Trang', 'Hà Nội', 'Hồ Chí Minh', 'Sapa'].map((item) => (
                        <li key={item}>
                          <Link 
                            href={`/tour?destination=${item}`} 
                            className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:bg-blue-50/80 group/item"
                          >
                            <div className="text-sm font-bold leading-none text-[#00355D] group-hover/item:text-[#0192f3] transition-colors">{item}</div>
                            <p className="line-clamp-2 text-xs leading-snug text-slate-500 font-medium opacity-80">
                              Khám phá các tour du lịch hấp dẫn tại {item}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    href="/tour" 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Tất cả Tours
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    href="/khuyen-mai" 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    Khuyến mãi
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center justify-end flex-1 space-x-4">
          <form 
            className="hidden lg:flex items-center relative w-full max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              const val = new FormData(e.currentTarget).get('search');
              if (val) router.push(`/tour?destination=${encodeURIComponent(val.toString())}`);
            }}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              name="search"
              type="search"
              placeholder="Tìm kiếm tour, điểm đến..."
              className="flex h-9 w-full rounded-full border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            />
          </form>

          <nav className="flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Link href="/dang-nhap" className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden sm:flex" })}>
                  Đăng nhập
                </Link>
                <Link href="/dang-ky" className={buttonVariants({ size: "sm", className: "rounded-full" })}>
                  Đăng ký
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 pl-1 pr-3 py-1 hover:bg-accent rounded-full border border-border focus:outline-none transition-colors duration-200">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                    {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold truncate max-w-[120px]">{user?.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1 truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role === 'admin' && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="cursor-pointer w-full flex items-center">Trang Quản Trị</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="cursor-pointer w-full flex items-center">Quản lý Tài Khoản</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-rose-500 font-medium focus:bg-rose-50 focus:text-rose-600">
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
