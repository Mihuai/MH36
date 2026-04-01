"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Tag, Eye, Edit, Trash2, Loader2, X, PlusCircle, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

// Custom lightweight toast replacement to avoid missing 'sonner' build error
const notify = {
  success: (msg: string) => console.log("SUCCESS:", msg),
  error: (msg: string) => alert("LỖI: " + msg)
};

export default function AdminPromotionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<any>(null);

  const initialFormState = {
    name: '', code: '', discount_value: 0, discount_type: 'percentage', 
    status: 'active', usage_count: 0, max_usage: 100 
  };
  const [formData, setFormData] = useState(initialFormState);

  // 1. Fetch real promotions from Supabase
  const fetchPromotions = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (err) {
      console.error("Fetch Promotions Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAddSubmit = async () => {
    if (!formData.name || !formData.code || formData.discount_value <= 0) {
      notify.error("Vui lòng điền đầy đủ thông tin mã khuyến mãi!");
      return;
    }
    
    try {
      const { error } = await supabase!.from('promotions').insert([formData]);
      if (error) throw error;
      
      notify.success("Đã tạo mã khuyến mãi thành công!");
      setIsAddOpen(false);
      fetchPromotions();
      setFormData(initialFormState);
    } catch (err: any) {
      notify.error("Lỗi tạo mã: " + err.message);
    }
  };

  const handleEditSubmit = async () => {
    if (!currentPromo) return;
    try {
      const { error } = await supabase!.from('promotions')
        .update(formData)
        .eq('id', currentPromo.id);
      
      if (error) throw error;
      notify.success("Đã cập nhật mã khuyến mãi!");
      setIsEditOpen(false);
      fetchPromotions();
    } catch (err: any) {
      notify.error("Lỗi cập nhật: " + err.message);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentPromo) return;
    try {
      const { error } = await supabase!.from('promotions')
        .delete()
        .eq('id', currentPromo.id);
      
      if (error) throw error;
      notify.success("Đã xóa mã khuyến mãi vĩnh viễn");
      setIsDeleteOpen(false);
      fetchPromotions();
    } catch (err: any) {
      notify.error("Lỗi xóa: " + err.message);
    }
  };

  const openEdit = (promo: any) => {
    setCurrentPromo(promo);
    setFormData({
      name: promo.name || '',
      code: promo.code || '',
      discount_value: promo.discount_value || 0,
      discount_type: promo.discount_type || 'percentage',
      status: promo.status || 'active',
      usage_count: promo.usage_count || 0,
      max_usage: promo.max_usage || 100
    });
    setIsEditOpen(true);
  };

  const filteredPromotions = promotions.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="max-w-2xl text-left">
          <h1 className="text-4xl font-black text-[#00355D] font-outfit uppercase tracking-tighter">🎟️ Quản lý Khuyến Mãi</h1>
          <p className="text-slate-400 font-medium mt-2 italic px-1">Thiết lập các mã Voucher, chiến dịch giảm giá và quà tặng đặc biệt.</p>
        </div>
        <Button onClick={() => { setFormData(initialFormState); setIsAddOpen(true); }} size="lg" className="rounded-2xl h-14 px-10 font-black uppercase text-xs tracking-widest bg-[#0192f3] hover:bg-[#0070bb] text-white shadow-xl shadow-blue-100 flex items-center gap-2 group transition-all active:scale-95">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
          Tạo Mã Mới
        </Button>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl border border-white overflow-hidden flex flex-col shadow-slate-100">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Tìm theo Mã voucher hoặc Chương trình..." 
              className="pl-11 bg-white h-12 rounded-2xl border-none shadow-sm font-bold text-slate-900 focus-visible:ring-blue-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button variant="ghost" className="rounded-2xl h-12 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest gap-2 bg-white shadow-sm border border-slate-100">
              <Filter className="w-4 h-4" /> Lọc trạng thái
            </Button>
            <Button variant="ghost" className="rounded-2xl h-12 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest gap-2 bg-white shadow-sm border border-slate-100">
              <Tag className="w-4 h-4" /> Lọc phân loại
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Đang đồng bộ dữ liệu Khuyến Mãi...</p>
            </div>
          ) : filteredPromotions.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-50">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Mã (CODE)</th>
                  <th className="px-8 py-5">Tên Chương Trình</th>
                  <th className="px-8 py-5 text-center">Mức Giảm</th>
                  <th className="px-8 py-5 text-center">Lượt Dùng</th>
                  <th className="px-8 py-5 text-center">Trạng Thái</th>
                  <th className="px-8 py-5 text-right pr-12">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPromotions.map((promo, idx) => (
                  <tr key={promo.id} className="group hover:bg-blue-50/10 transition-all border-b border-slate-50 last:border-none">
                    <td className="px-8 py-6">
                      <span className="font-black font-mono text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm text-sm">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-[#00355D] text-[15px] truncate max-w-[280px]" title={promo.name}>
                      {promo.name}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-rose-500 text-lg">
                        {new Intl.NumberFormat('vi-VN').format(promo.discount_value)}
                        {promo.discount_type === 'percentage' ? '%' : 'đ'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center gap-1">
                          <span className="font-black text-slate-700 text-sm">{promo.usage_count} <span className="text-slate-300">/</span> {promo.max_usage || '∞'}</span>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-white shadow-inner">
                             <div className="h-full bg-blue-500" style={{ width: `${Math.min((promo.usage_count / (promo.max_usage || 100)) * 100, 100)}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                        ${promo.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 
                          promo.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                          'bg-rose-100 text-rose-700 border-rose-200'}
                      `}>
                        {promo.status === 'active' ? 'Đang Chạy' : promo.status === 'scheduled' ? 'Lên Lịch' : 'Hết Hạn'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right pr-6">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <Button onClick={() => openEdit(promo)} className="bg-white hover:bg-blue-600 text-slate-400 hover:text-white w-10 h-10 p-0 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 transition-all active:scale-90"><Edit className="w-5 h-5" /></Button>
                          <Button onClick={() => { setCurrentPromo(promo); setIsDeleteOpen(true); }} className="bg-white hover:bg-rose-500 text-slate-400 hover:text-white w-10 h-10 p-0 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 transition-all active:scale-90"><Trash2 className="w-5 h-5" /></Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
               <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[40px] flex items-center justify-center border-4 border-white shadow-inner">
                  <Gift className="w-12 h-12" />
               </div>
               <p className="font-black uppercase tracking-[0.3em] text-[11px] text-slate-400 opacity-50">Kho Voucher đang trống. Hãy tạo mã đầu tiên!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(val) => val ? null : (setIsAddOpen(false), setIsEditOpen(false))}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl p-0 max-w-2xl overflow-hidden bg-white">
          <div className="p-10 pb-8 border-b border-slate-50">
             <DialogTitle className="text-3xl font-black text-[#00355D] font-outfit uppercase tracking-tighter">
               {isEditOpen ? "🌐 Hiệu chỉnh Voucher" : "🏷️ Khai báo Voucher mới"}
             </DialogTitle>
             <p className="text-slate-400 font-bold text-sm mt-1 italic">Vui lòng kiểm tra kỹ giá trị voucher trước khi kích hoạt.</p>
          </div>
          
          <div className="p-10 space-y-8 bg-slate-50/30">
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-[#00355D] uppercase tracking-widest ml-1">Mã (CODE)</label>
                   <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="Vd: SUMMER2024" className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-300 font-black text-blue-600 text-lg uppercase px-6" />
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-[#00355D] uppercase tracking-widest ml-1">Dạng khuyến mãi</label>
                   <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-300 font-bold px-6 text-slate-700">
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (đ)</option>
                   </select>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[11px] font-black text-[#00355D] uppercase tracking-widest ml-1">Tên chương trình khuyến mãi</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vd: Siêu Hội Mùa Hè - Giảm 20%" className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-300 font-bold px-6" />
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-[#00355D] uppercase tracking-widest ml-1">Giá trị giảm</label>
                   <Input type="number" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: Number(e.target.value)})} className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-300 font-black text-rose-500 text-xl px-6" />
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-black text-[#00355D] uppercase tracking-widest ml-1">Lượt dùng tối đa</label>
                   <Input type="number" value={formData.max_usage} onChange={e => setFormData({...formData, max_usage: Number(e.target.value)})} className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-blue-300 font-bold px-6" />
                </div>
             </div>

             <div className="pt-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 block underline underline-offset-4 decoration-blue-200 uppercase">Trạng thái phát hành</label>
                <div className="flex gap-4">
                  {['active', 'scheduled', 'expired'].map((st) => (
                    <button key={st} onClick={() => setFormData({...formData, status: st})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${formData.status === st ? 'bg-blue-700 text-white border-blue-700 shadow-2xl shadow-blue-200' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                      {st === 'active' ? 'Kích hoạt' : st === 'scheduled' ? 'Tạm dừng' : 'Đã hết hạn'}
                    </button>
                  ))}
                </div>
             </div>
          </div>
          
          <DialogFooter className="p-8 bg-slate-50 border-t flex gap-4 pr-10">
             <Button variant="ghost" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="px-8 h-14 rounded-2xl font-black text-slate-400 uppercase text-[10px] tracking-widest">HỦY BỎ</Button>
             <Button onClick={isEditOpen ? handleEditSubmit : handleAddSubmit} className="px-16 h-14 rounded-2xl font-black bg-[#0192f3] hover:bg-blue-700 text-white uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-blue-200 flex items-center gap-3">
               {isEditOpen ? "LƯU THAY ĐỔI" : "TẠO MÃ NGAY"}
               <ArrowRight className="w-4 h-4" />
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl p-12 max-w-sm text-center bg-white">
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Trash2 className="w-12 h-12" />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter">XÓA VĨNH VIỄN?</DialogTitle>
          <p className="text-slate-500 mt-3 font-medium px-4">Sau khi xóa mã <span className="font-bold text-rose-600">{currentPromo?.code}</span>, khách hàng sẽ không thể dùng mã này nữa.</p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="rounded-2xl font-black h-14 text-slate-400 uppercase text-[10px] tracking-widest">HỦY</Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} className="rounded-2xl font-black h-14 shadow-xl shadow-rose-100 bg-rose-600 uppercase text-[10px] tracking-widest">XÓA LUÔN</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
