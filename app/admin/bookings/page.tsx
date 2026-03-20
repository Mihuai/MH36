"use client";

import { useState } from 'react';
import { Search, Filter, Eye, Printer, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const initialBookings = [
  { id: "#B_19283", customer: "Phitb199", tour: "Phú Quốc Mùa Hè 3N2Đ", date: "20/03/2026", amount: 7000000, status: "pending", passengers: 2 },
  { id: "#B_19280", customer: "Nguyễn Văn A", tour: "Sapa Mùa Lúa Chín 3N2Đ", date: "15/03/2026", amount: 3100000, status: "confirmed", passengers: 1 },
  { id: "#B_19275", customer: "Trần Thị Mai", tour: "Đà Nẵng - Hội An 4N3Đ", date: "10/03/2026", amount: 16800000, status: "completed", passengers: 4 },
  { id: "#B_19271", customer: "Lê Hoàng Bảo", tour: "Khám phá Vịnh Hạ Long", date: "08/03/2026", amount: 5600000, status: "cancelled", passengers: 2 },
  { id: "#B_19266", customer: "Phạm Hồng Ngọc", tour: "Tour Quốc Tế: Bali", date: "02/03/2026", amount: 24500000, status: "completed", passengers: 2 },
];

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState(initialBookings);

  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: string, newStatus: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Đơn Đặt Tour</h1>
          <p className="text-muted-foreground">Theo dõi, duyệt và quản lý toàn bộ các giao dịch đặt tour trên hệ thống.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm theo Mã Booking, Tên KH..." 
              className="pl-9 bg-background h-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 shrink-0 bg-background"><Filter className="w-4 h-4" /> Trạng thái  </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 font-semibold border-b border-border/60">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-lg">Mã GD</th>
                <th scope="col" className="px-6 py-4">Khách hàng</th>
                <th scope="col" className="px-6 py-4">Tour Booking</th>
                <th scope="col" className="px-6 py-4">Ngày giao dịch</th>
                <th scope="col" className="px-6 py-4 text-center">Hành khách</th>
                <th scope="col" className="px-6 py-4">Tổng tiền</th>
                <th scope="col" className="px-6 py-4 text-center">Trạng thái</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr key={booking.id} className={`border-b border-border/40 hover:bg-muted/20 transition-colors ${index === filteredBookings.length - 1 ? 'border-none' : ''}`}>
                    <td className="px-6 py-4 font-mono font-bold text-primary">{booking.id}</td>
                    <td className="px-6 py-4 font-medium">{booking.customer}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]" title={booking.tour}>{booking.tour}</td>
                    <td className="px-6 py-4 text-muted-foreground">{booking.date}</td>
                    <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-muted/40 rounded-lg font-bold min-w-[2.5rem] inline-block">{booking.passengers}</span></td>
                    <td className="px-6 py-4 font-bold text-rose-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.amount)}</td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                        ${booking.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-slate-100 text-slate-500'}
                      `}>
                        {booking.status === 'completed' ? 'Hoàn thành' : 
                         booking.status === 'confirmed' ? 'Đã duyệt' : 
                         booking.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-1">
                          {booking.status === 'pending' && (
                            <>
                               <Button onClick={() => handleStatusChange(booking.id, 'confirmed')} variant="ghost" size="icon" className="w-8 h-8 rounded-full text-green-600 hover:text-green-700 hover:bg-green-50"><CheckCircle2 className="w-4 h-4" /></Button>
                               <Button onClick={() => handleStatusChange(booking.id, 'cancelled')} variant="ghost" size="icon" className="w-8 h-8 rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"><XCircle className="w-4 h-4" /></Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary"><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-blue-500"><Printer className="w-4 h-4" /></Button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">Không tìm thấy đơn hàng nào khớp với tìm kiếm.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
