import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Supabase chưa được cấu hình" }, { status: 500 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Không tìm thấy file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tự động tạo tên file duy nhất tránh trùng lặp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;
    
    // Upload lên bucket 'tours'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tours')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ 
        success: false, 
        error: "Lỗi khi tải lên Supabase Storage. Hãy đảm bảo bucket 'tours' đã tồn tại và Allow Public." 
      }, { status: 500 });
    }

    // Lấy link public
    const { data: { publicUrl } } = supabase.storage
      .from('tours')
      .getPublicUrl(filename);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Đã xảy ra lỗi khi upload file" }, { status: 500 });
  }
}
