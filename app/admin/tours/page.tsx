"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Package, Edit, Trash2, PlusCircle, X, Image as ImageIcon, Loader2, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

// Custom lightweight toast replacement to avoid missing 'sonner' build error
const notify = {
  success: (msg: string) => console.log("SUCCESS:", msg),
  error: (msg: string) => alert("LỖI: " + msg)
};

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
      const { data, error } = await supabase!.from('tours').select('*').order('created_at', { ascending: false });

      if (error) {
        notify.error("Lỗi khi tải danh sách tour");
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
      notify.error("File quá lớn (Tối đa 4MB)");
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
        notify.success("Upload ảnh thành công!");
      } else {
        notify.error("Lỗi upload: " + result.error);
      }
    } catch (err) {
      notify.error("Lỗi kết nối khi upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to generate slug from title
  const slugify = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const handleAddSubmit = async () => {
    if (!formData.title) {
      notify.error("Vui lòng nhập tên tour!");
      return;
    }

    // Prepare full payload
    const fullPayload: any = {
      ...formData,
      slug: slugify(formData.title) + '-' + Math.random().toString(36).substring(2, 7),
      price_adult: formData.price,
      duration_days: 3, 
      duration_nights: 2,
      images: [formData.image_url],
    };

    let { error } = await supabase!.from('tours').insert([fullPayload]);

    // SELF-HEALING HACK: If 'code' column is missing, retry without it
    if (error && error.message.includes("Could not find the 'code' column")) {
       console.warn("DB Missing 'code' column. Retrying with fallback...");
       
       // Inform user but keep going
       notify.error("⚠️ Database thiếu cột 'code'. Hệ thống đang tự động lưu mã vào phần mô tả cho sếp...");
       
       const fallbackPayload = { ...fullPayload };
       delete fallbackPayload.code;
       delete fallbackPayload.image_url;
       delete fallbackPayload.duration;
       delete fallbackPayload.location;
       
       // Append info to description so it's not lost
       fallbackPayload.description = `[MÃ: ${formData.code}] - [ĐỊA DANH: ${formData.location}] \n\n${formData.description}`;
       
       const retry = await supabase!.from('tours').insert([fallbackPayload]);
       error = retry.error;
    }

    if (error) {
      console.error("Insert Error:", error);
      notify.error(`LỖI: ${error.message}. Sếp hãy copy nội dung trong file 'supabase/migrations/0003_fix_tours_table.sql' dán vào SQL Editor trên Supabase nhé!`);
    } else {
      notify.success("Sếp đã tạo tour thành công (Tự động vá lỗi)!");
      setIsAddOpen(false);
      fetchTours();
      setFormData(initialFormState);
    }
  };

  const handleEditSubmit = async () => {
    if (!currentTour) return;
    
    const updatePayload: any = {
      title: formData.title,
      code: formData.code,
      price: formData.price,
      price_adult: formData.price,
      status: formData.status,
      image_url: formData.image_url,
      images: [formData.image_url], 
      description: formData.description,
      duration: formData.duration,
      location: formData.location,
      itinerary: formData.itinerary,
      updated_at: new Date().toISOString()
    };

    let { error } = await supabase!.from('tours').update(updatePayload).eq('id', currentTour.id);

    // SELF-HEALING HACK: If 'code' column is missing, retry without it
    if (error && error.message.includes("Could not find the 'code' column")) {
       console.warn("Edit: DB Missing 'code' column. Retrying with fallback...");
       notify.error("⚠️ Database thiếu cột 'code'. Đang tự động lưu mã vào phần mô tả...");
       
       const fallbackUpdate = { ...updatePayload };
       delete fallbackUpdate.code;
       delete fallbackUpdate.image_url;
       delete fallbackUpdate.duration;
       delete fallbackUpdate.location;
       
       fallbackUpdate.description = `[MÃ: ${formData.code}] - [ĐỊA DANH: ${formData.location}] \n\n${formData.description}`;
       
       const retry = await supabase!.from('tours').update(fallbackUpdate).eq('id', currentTour.id);
       error = retry.error;
    }

    if (error) {
       console.error("Update Error Detailed:", error);
      notify.error("Không thể cập nhật: " + error.message);
    } else {
      notify.success("Đã đồng bộ thông tin tour (Tự động vá lỗi)!");
      setIsEditOpen(false);
      fetchTours();
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentTour) return;
    const { error } = await supabase!.from('tours').delete().eq('id', currentTour.id);

    if (error) {
      notify.error("Lỗi khi xóa tour: " + error.message);
    } else {
      notify.success("Đã xóa tour thành công");
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

      {/* Editor Dialog - Robust Width Fix */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(val) => val ? null : (setIsAddOpen(false), setIsEditOpen(false))}>
        <DialogContent className="sm:max-w-6xl w-full max-h-[95vh] h-auto flex flex-col p-0 overflow-hidden rounded-[40px] border-none shadow-2xl">
          <div className="p-8 pb-6 bg-white border-b shrink-0 flex justify-between items-start">
            <div>
              <DialogTitle className="text-3xl font-black text-[#00355D] font-outfit uppercase tracking-tight">
                {isEditOpen ? "🌐 Chỉnh sửa Tour" : "✨ Tạo Tour Mới"}
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-1 font-medium italic">Thông tin sẽ tự động đồng bộ ra trang sản phẩm và kho hàng.</p>
            </div>
            {/* Standard Close button is handled by DialogClose, but we can add an extra if needed. Shadcn handles the X. */}
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 bg-slate-50/20">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column: Basic Info */}
              <div className="w-full lg:w-1/2 space-y-8">
                <section className="bg-white p-8 rounded-[32px] shadow-sm space-y-6 border border-slate-50">
                  <div className="flex items-center gap-3 text-blue-700 font-black text-[11px] uppercase tracking-[0.2em] border-b pb-4 border-slate-100">
                    <div className="w-2.5 h-6 bg-blue-700 rounded-full"></div> 1. THÀNH PHẦN CƠ BẢN
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Mã định danh</label>
                       <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Vd: PQ-2024" className="h-13 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-900" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Giá bán niêm yết (VND)</label>
                       <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="h-13 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-black text-blue-700 text-lg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Tên hiển thị thương mại</label>
                     <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Vd: Tour Phú Quốc 3 Ngày 2 Đêm - Safari..." className="h-13 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-900 text-[16px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Thời gian</label>
                       <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="Vd: 3 Ngày 2 Đêm" className="h-13 rounded-2xl bg-slate-50 border border-slate-200 px-4 font-bold text-slate-900" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Địa danh</label>
                       <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Vd: Phú Quốc" className="h-13 rounded-2xl bg-slate-50 border border-slate-200 px-4 font-bold text-slate-900" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1">Ảnh Đại Diện Sản Phẩm</label>
                    <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 border-dashed">
                      <div className="relative w-36 h-24 rounded-2xl overflow-hidden bg-white shadow-md shrink-0 border border-slate-200">
                        <img src={formData.image_url || "/placeholder-tour.jpg"} alt="Preview" className="w-full h-full object-cover" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-blue-700/80 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="cursor-pointer file:text-white file:font-black file:text-[10px] file:uppercase file:px-4 file:py-2 file:bg-blue-700 file:border-none file:rounded-xl h-auto py-2 bg-white border border-slate-200 shadow-sm text-slate-900 font-bold" />
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">Định dạng hỗ trợ: JPG, PNG, WEBP. Tối đa 4MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1 mb-4 block underline underline-offset-4 decoration-blue-200">Chế độ hiển thị</label>
                    <div className="flex gap-4">
                      {['active', 'draft', 'paused'].map((st) => (
                        <button key={st} onClick={() => setFormData({...formData, status: st})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${formData.status === st ? 'bg-blue-700 text-white border-blue-700 shadow-2xl shadow-blue-200 scale-[1.05]' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900'}`}>
                          {st === 'active' ? 'Đang bán' : st === 'draft' ? 'Nháp' : 'Dừng'}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Itinerary */}
              <div className="w-full lg:w-1/2 space-y-8">
                <section className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col h-full border border-slate-100">
                  <div className="flex justify-between items-center border-b pb-6 border-slate-100">
                    <div className="flex items-center gap-3 text-blue-700 font-black text-[11px] uppercase tracking-[0.2em]">
                      <div className="w-2.5 h-6 bg-blue-700 rounded-full"></div> 2. LỊCH TRÌNH CHI TIẾT
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="rounded-xl border-blue-500 text-blue-700 font-black text-[10px] items-center gap-1.5 uppercase tracking-widest hover:bg-blue-50 px-6 h-10 shadow-sm">
                      THÊM NGÀY +
                    </Button>
                  </div>
                  
                  <div className="space-y-6 mt-8 max-h-[420px] overflow-y-auto pr-4 custom-scrollbar">
                     {formData.itinerary.map((day, index) => (
                        <div key={index} className="bg-slate-50 border-2 border-slate-100 rounded-3xl overflow-hidden group hover:border-blue-200 transition-colors shadow-sm">
                           <div className="bg-white px-6 py-3 flex justify-between items-center border-b border-slate-100">
                              <span className="text-[11px] font-black text-blue-900/60 uppercase tracking-widest font-mono">HÀNH TRÌNH NGÀY {day.day}</span>
                              <button onClick={() => handleRemoveDay(index)} className="text-slate-300 hover:text-rose-500 p-2 rounded-full hover:bg-rose-50 transition-all outline-none border border-transparent hover:border-rose-100"><X className="w-5 h-5" /></button>
                           </div>
                           <div className="p-8 space-y-5">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tiêu đề ngày</label>
                                <Input 
                                   value={day.title} 
                                   onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                                   placeholder="Vd: Sáng đón khách - Tham quan Safari..." 
                                   className="h-11 bg-white border-slate-200 rounded-xl font-bold text-slate-900 text-[15px] focus:ring-blue-100"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Chi tiết hành trình</label>
                                <Textarea 
                                   value={day.content} 
                                   onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} 
                                   placeholder="Mô tả các hoạt động..." 
                                   className="min-h-[120px] bg-white border-slate-200 rounded-2xl text-sm shadow-sm font-medium text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-100 resize-none leading-relaxed p-4"
                                />
                              </div>
                           </div>
                        </div>
                     ))}
                     {formData.itinerary.length === 0 && (
                       <div className="text-center py-24 text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                          <PlusCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                          <p className="font-black uppercase tracking-[0.3em] text-[10px] opacity-60">CHƯA KHAI BÁO HÀNH TRÌNH</p>
                       </div>
                     )}
                  </div>

                  <div className="mt-10">
                     <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest ml-1 mb-3 block font-outfit">Mô tả tổng quan tour (Giới thiệu nhanh)</label>
                     <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-32 bg-white border-2 border-slate-100 rounded-3xl p-6 text-[15px] font-medium text-slate-700 focus:border-blue-300 transition-all shadow-inner resize-none leading-relaxed" placeholder="Tóm tắt những điều tuyệt vời nhất của tour này..." />
                  </div>
                </section>
              </div>
            </div>
          </div>
          
          <DialogFooter className="p-10 bg-slate-50/80 border-t flex flex-col sm:flex-row gap-6 sm:justify-end shrink-0 shadow-2xl backdrop-blur-sm">
            <Button variant="ghost" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="rounded-2xl px-12 h-16 font-black uppercase text-[11px] tracking-widest text-slate-500 hover:text-slate-900 transition-colors">QUAY LẠI / HỦY</Button>
            <Button onClick={isEditOpen ? handleEditSubmit : handleAddSubmit} className="rounded-2xl px-20 h-16 font-black uppercase text-[11px] tracking-[0.25em] bg-[#0192f3] hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 flex items-center gap-4 transition-all active:scale-95 group">
              {isEditOpen ? "ĐỒNG BỘ VÀ LƯU" : "XUẤT BẢN NGAY"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
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
