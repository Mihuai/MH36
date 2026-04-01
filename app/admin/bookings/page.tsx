"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Printer, CheckCircle2, XCircle, Loader2, Calendar as CalIcon, User, MapPin, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real bookings from Supabase
  const fetchBookings = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tours (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      // Refresh local state
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tours?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán (Tự động)';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ duyệt';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#00355D] font-outfit uppercase tracking-tighter">📦 Đơn Đặt Tour</h1>
          <p className="text-slate-400 font-medium mt-2 italic">Hệ thống tự động duyệt các đơn đã thanh toán qua cổng VNPay/Momo.</p>
        </div>
        <div className="flex gap-3">
           <Button onClick={fetchBookings} variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest px-6 h-12">Làm mới dữ liệu</Button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Mã đơn, Tên khách hàng, Tour..." 
              className="pl-11 bg-white h-12 rounded-2xl border-none shadow-sm font-medium focus-visible:ring-blue-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="ghost" className="rounded-2xl h-12 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest gap-2">
              <Filter className="w-4 h-4" /> Lọc trạng thái
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Đang truy xuất đơn hàng từ hệ thống...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Mã Giao Dịch</th>
                  <th className="px-8 py-5">Khách hàng</th>
                  <th className="px-8 py-5">Tour Booking</th>
                  <th className="px-8 py-5">Khởi hành</th>
                  <th className="px-8 py-5">Tổng tiền</th>
                  <th className="px-8 py-5 text-center">Trạng thái</th>
                  <th className="px-8 py-5 text-right pr-12">Quản trị</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, idx) => (
                  <tr key={booking.id} className={`group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-none`}>
                    <td className="px-8 py-6">
                      <span className="font-mono text-[11px] font-black text-blue-900 opacity-30 group-hover:opacity-100 transition-opacity">
                        #{booking.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="font-bold text-[#00355D] text-sm">{booking.customer_name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{booking.customer_email}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="font-bold text-slate-600 text-[13px] line-clamp-1 max-w-[220px]" title={booking.tours?.title}>
                         {booking.tours?.title || 'Tour không khả dụng'}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                          <CalIcon className="w-3 h-3" />
                          {new Date(booking.departure_date).toLocaleDateString('vi-VN')}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="font-black text-blue-600 text-sm">
                         {new Intl.NumberFormat('vi-VN').format(booking.total_price)}đ
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 ${getStatusColor(booking.status)}`}>
                         {getStatusLabel(booking.status)}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right pr-6">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {booking.status === 'pending' && (
                            <>
                               <Button onClick={() => handleStatusChange(booking.id, 'confirmed')} className="bg-green-500 hover:bg-green-600 text-white w-9 h-9 p-0 rounded-xl shadow-lg shadow-green-100"><CheckCircle2 className="w-5 h-5" /></Button>
                               <Button onClick={() => handleStatusChange(booking.id, 'cancelled')} className="bg-rose-500 hover:bg-rose-600 text-white w-9 h-9 p-0 rounded-xl shadow-lg shadow-rose-100"><XCircle className="w-5 h-5" /></Button>
                            </>
                          )}
                          <Button variant="ghost" className="w-9 h-9 p-0 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"><Eye className="w-5 h-5" /></Button>
                          <Button variant="ghost" className="w-9 h-9 p-0 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all border border-transparent"><Printer className="w-5 h-5" /></Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-40">
               <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-slate-300" />
               </div>
               <p className="font-black uppercase tracking-[0.3em] text-[11px] text-slate-400">Bạn chưa có bất kỳ đơn đặt tour nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
