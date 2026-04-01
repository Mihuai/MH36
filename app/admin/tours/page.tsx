"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Filter, Package, Eye, Edit, Trash2, PlusCircle, X, Image as ImageIcon, Loader2, ArrowRight, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminToursPage() {
  // Use the pre-initialized singleton
  if (!supabase) {
    return <div className="p-20 text-center text-rose-500 font-bold">Lỗi cấu hình kết nối Supabase!</div>;
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [currentTour, setCurrentTour] = useState<any>(null);
  
  const initialFormState = { 
    title: '', code: '', price: 0, status: 'active', image_url: '',
    description: '', duration: '', location: '',
    itinerary: [{ day: 1, title: '', content: '' }]
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Fetch real data from Supabase
  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Lỗi khi tải danh sách tour");
      } else {
        setTours(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTours = tours.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File quá lớn (Tối đa 4MB)");
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.url }));
        toast.success("Upload ảnh thành công!");
      } else {
        toast.error("Lỗi upload: " + result.error);
      }
    } catch (err) {
      toast.error("Lỗi kết nối khi upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSubmit = async () => {
    const { error } = await supabase
      .from('tours')
      .insert([formData]);

    if (error) {
      toast.error("Lỗi khi tạo tour mới");
    } else {
      toast.success("Đã thêm tour mới thành công!");
      setIsAddOpen(false);
      fetchTours();
      setFormData(initialFormState);
    }
  };

  const handleEditSubmit = async () => {
    if (!currentTour) return;
    
    // Sync permanent changes to Supabase
    const { error } = await supabase
      .from('tours')
      .update({
        title: formData.title,
        code: formData.code,
        price: formData.price,
        status: formData.status,
        image_url: formData.image_url,
        description: formData.description,
        duration: formData.duration,
        location: formData.location,
        itinerary: formData.itinerary
      })
      .eq('id', currentTour.id);

    if (error) {
      toast.error("Lỗi khi cập nhật tour đồng bộ: " + error.message);
    } else {
      toast.success("Đã đồng bộ ảnh và thông tin với trang chủ!");
      setIsEditOpen(false);
      fetchTours();
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentTour) return;
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', currentTour.id);

    if (error) {
      toast.error("Lỗi khi xóa tour");
    } else {
      toast.success("Đã xóa tour thành công");
      setIsDeleteOpen(false);
      fetchTours();
    }
  };

  const openAdd = () => {
    setFormData(initialFormState);
    setIsAddOpen(true);
  };

  const openEdit = (tour: any) => {
    setCurrentTour(tour);
    setFormData({ 
      title: tour.title || '', 
      code: tour.code || '', 
      price: tour.price || 0, 
      status: tour.status || 'active', 
      image_url: tour.image_url || '',
      description: tour.description || '',
      duration: tour.duration || '',
      location: tour.location || '',
      itinerary: tour.itinerary || [{ day: 1, title: '', content: '' }]
    });
    setIsEditOpen(true);
  };

  const handleItineraryChange = (index: number, field: string, value: string) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const handleAddDay = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: formData.itinerary.length + 1, title: '', content: '' }
      ]
    });
  };

  const handleRemoveDay = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setFormData({ ...formData, itinerary: newItinerary });
  };

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit mb-1">Quản lý Kho Tour</h1>
          <p className="text-slate-500 text-sm">Cập nhật ảnh và thông tin đồng bộ tức thì với Website chính.</p>
        </div>
        <Button onClick={openAdd} size="lg" className="font-bold gap-2 bg-[#0192f3] hover:bg-[#0070bb] text-white shadow-lg shadow-blue-100 rounded-2xl px-8 h-12">
          <Plus className="w-5 h-5" /> Thêm Tour Mới
        </Button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm border-none shadow-[0_10px_40px_rgb(0,0,0,0.03)]">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row gap-6 justify-between items-center bg-white">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Gõ tên hoặc mã tour để tìm..." 
              className="pl-11 bg-slate-50 h-12 rounded-2xl border-none focus-visible:ring-1 focus-visible:ring-blue-100 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <Button variant="outline" className="gap-2 h-12 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-6">
              <Filter className="w-4 h-4" /> Lọc
            </Button>
            <Button variant="outline" className="gap-2 h-12 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold px-6">
              <Package className="w-4 h-4" /> Xuất File
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 font-black border-b border-slate-50">
              <tr>
                <th className="px-8 py-5">Mã Tour</th>
                <th className="px-6 py-5">Hình Ảnh</th>
                <th className="px-6 py-5">Tên Sản Phẩm</th>
                <th className="px-6 py-5">Giá Bán</th>
                <th className="px-6 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 opacity-20" />
                    <p className="mt-4 text-slate-400 font-medium">Đang đồng bộ dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredTours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400">Trống. Bạn chưa có tour nào.</td>
                </tr>
              ) : filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-6 font-mono font-bold text-blue-900/40 text-[10px]">{tour.code || 'NOCODE'}</td>
                  <td className="px-6 py-6">
                    <div className="relative w-20 h-14 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      <img src={tour.image_url || "/placeholder.jpg"} alt={tour.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold text-slate-900 text-[15px]">{tour.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" /> {tour.location || 'Chưa cập nhật'}</p>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price)}</td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                      ${tour.status === 'active' ? 'bg-green-100 text-green-700' : 
                        tour.status === 'draft' ? 'bg-slate-100 text-slate-500' : 
                        'bg-rose-100 text-rose-700'}
                    `}>
                      {tour.status === 'active' ? 'Đang bán' : tour.status === 'draft' ? 'Bản nháp' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <Button onClick={() => openEdit(tour)} variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-blue-600 hover:text-white shadow-sm border border-transparent hover:border-blue-700 transition-all">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => { setCurrentTour(tour); setIsDeleteOpen(true); }} variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-rose-50 text-rose-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Dialog */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(val) => val ? null : (setIsAddOpen(false), setIsEditOpen(false))}>
        <DialogContent className="max-w-[1000px] w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden rounded-[40px] border-none shadow-2xl">
          <div className="p-10 pb-6 bg-white border-b shrink-0 flex justify-between items-center">
            <div>
              <DialogTitle className="text-3xl font-black text-[#00355D] font-outfit">
                {isEditOpen ? "Chỉnh sửa Tour" : "Khai báo Tour Mới"}
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-1 font-medium">Hệ thống đồng bộ ảnh tự động cho mục sản phẩm tương ứng.</p>
            </div>
            <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="w-6 h-6" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 bg-slate-50/20 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                <section className="bg-white p-8 rounded-[32px] shadow-sm space-y-6">
                  <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.2em] border-b pb-4 border-slate-50">
                    <div className="w-2 h-6 bg-blue-600 rounded-full"></div> 1. CẤU HÌNH CƠ BẢN
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã định danh</label>
                       <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Vd: PQ-2024" className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá bán niêm yết (VND)</label>
                       <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all font-black text-blue-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên Tour hiển thị ngoài web</label>
                     <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Vd: Tour Phú Quốc 3 Ngày 2 Đêm - Safari..." className="h-14 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all font-bold text-lg" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thời lượng</label>
                       <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Vd: 3 Ngày 2 Đêm" className="h-14 rounded-2xl bg-slate-50 border-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Điểm đến (Vị trí)</label>
                       <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Vd: Phú Quốc" className="h-14 rounded-2xl bg-slate-50 border-none" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ảnh Sản Phẩm (Tự động đồng bộ)</label>
                    <div className="flex items-start gap-6 bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
                      <div className="relative w-40 h-28 rounded-2xl overflow-hidden bg-white shadow-inner shrink-0 border border-slate-100">
                        <img src={formData.image_url || "/placeholder-tour.jpg"} alt="Preview" className="w-full h-full object-cover" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-blue-600/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="cursor-pointer file:text-white file:font-black file:text-[10px] file:uppercase file:px-6 file:py-2 file:bg-blue-600 file:border-none file:rounded-xl h-auto py-2 bg-white border-none shadow-sm" />
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic">* Lưu ý: Ảnh này sẽ được cập nhật đồng hiệu với ảnh tour ở trang sản phẩm tương ứng.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Chế độ hiển thị</label>
                    <div className="flex gap-3">
                      {['active', 'draft', 'paused'].map((st) => (
                        <button key={st} onClick={() => setFormData({...formData, status: st})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === st ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                          {st === 'active' ? 'Đang bán' : st === 'draft' ? 'Nháp' : 'Tạm dừng'}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <section className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col h-full min-h-[600px]">
                  <div className="flex justify-between items-center border-b pb-6 border-slate-50">
                    <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.2em]">
                      <div className="w-2 h-6 bg-blue-600 rounded-full"></div> 2. LỊCH TRÌNH CHI TIẾT
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="rounded-xl border-blue-500/20 text-blue-600 font-black text-[10px] items-center gap-1.5 uppercase tracking-widest hover:bg-blue-50">
                      THÊM NGÀY +
                    </Button>
                  </div>
                  
                  <div className="space-y-6 mt-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                     {formData.itinerary.map((day, index) => (
                        <div key={index} className="bg-slate-50 border border-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all">
                           <div className="bg-white/50 px-5 py-3 flex justify-between items-center border-b border-white">
                              <span className="text-[10px] font-black text-blue-900/30 uppercase tracking-widest font-mono">DAY 0{day.day}</span>
                              <button onClick={() => handleRemoveDay(index)} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-all outline-none"><X className="w-4 h-4" /></button>
                           </div>
                           <div className="p-6 space-y-4">
                              <Input 
                                 value={day.title} 
                                 onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                                 placeholder="Chủ đề ngày này là gì?" 
                                 className="h-10 bg-transparent border-none shadow-none font-bold text-[16px] focus-visible:ring-0 px-0 placeholder:text-slate-300"
                              />
                              <Textarea 
                                 value={day.content} 
                                 onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} 
                                 placeholder="Kể chi tiết các điểm tham quan..." 
                                 className="min-h-[100px] bg-white border-none rounded-2xl text-sm shadow-inner placeholder:text-slate-300 focus-visible:ring-1 focus-visible:ring-blue-100"
                              />
                           </div>
                        </div>
                     ))}
                     {formData.itinerary.length === 0 && (
                       <div className="text-center py-20 text-slate-300">
                          <PlusCircle className="w-12 h-12 mx-auto mb-4 opacity-5" />
                          <p className="font-bold uppercase tracking-widest text-[10px]">Chưa có lịch trình ngày nào</p>
                       </div>
                     )}
                  </div>

                  <div className="mt-auto pt-8">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Ghi chú tổng quan</label>
                     <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-32 bg-slate-50 border-none rounded-3xl p-4 text-sm" placeholder="Mô tả tóm tắt về tour để khách hàng dễ hình dung..." />
                  </div>
                </section>
              </div>
            </div>
          </div>
          
          <DialogFooter className="p-10 bg-white border-t flex flex-col sm:flex-row gap-4 sm:justify-end shrink-0 shadow-[0_-20px_40px_rgb(0,0,0,0.02)]">
            <Button variant="ghost" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="rounded-[20px] px-8 h-16 font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-slate-50 mr-2">HỦY BỎ</Button>
            <Button onClick={isEditOpen ? handleEditSubmit : handleAddSubmit} className="rounded-[20px] px-14 h-16 font-black uppercase text-xs tracking-widest bg-[#0192f3] hover:bg-[#0070bb] text-white shadow-2xl shadow-blue-100 flex items-center gap-3 group transition-all active:scale-95">
              {isEditOpen ? "ĐỒNG BỘ VÀ LƯU" : "XUẤT BẢN NGAY"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[40px] border-none shadow-2xl p-12 max-w-sm text-center">
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Trash2 className="w-12 h-12" />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 font-outfit text-center">Xác nhận xóa?</DialogTitle>
          <p className="text-slate-500 mt-3 font-medium text-center">Bạn đang chuẩn bị xóa vĩnh viễn tour <span className="text-rose-600 font-bold">{currentTour?.title}</span>. Bạn chắc chứ?</p>
          <div className="grid grid-cols-2 gap-4 mt-10">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="rounded-[20px] font-black h-14 text-slate-400 uppercase text-[10px] tracking-widest">HỦY</Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} className="rounded-[20px] font-black h-14 shadow-xl shadow-rose-100 bg-rose-600 uppercase text-[10px] tracking-widest">XÓA LUÔN</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
