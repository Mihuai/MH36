export default function FAQsPage() {
  return (
    <div className="bg-muted/10 min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 text-center">Câu Hỏi Thường Gặp (FAQs)</h1>
        
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
             <h3 className="text-lg font-bold mb-2">Làm thế nào để tôi đặt tour?</h3>
             <p className="text-muted-foreground">Bạn chỉ cần chọn tour trên trang web, nhấn nút "Đặt Tour", điền thông tin hành khách và tiến hành thanh toán qua cổng VNPAY hoặc MoMo. Sau khi thanh toán, hệ thống sẽ tự động gửi email xác nhận.</p>
          </div>
          
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
             <h3 className="text-lg font-bold mb-2">Tôi có thể chọn ngày khởi hành linh hoạt được không?</h3>
             <p className="text-muted-foreground">Đối với các tour thiết kế riêng, ngày xuất phát hoàn toàn linh hoạt. Riêng các tour ghép khách cố định, bạn phải khởi hành theo đúng lịch trình đã công bố trên website.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
             <h3 className="text-lg font-bold mb-2">Giá tour đã bao gồm vé máy bay và bảo hiểm chưa?</h3>
             <p className="text-muted-foreground">Tuỳ theo từng sản phẩm. Đa số các tour nội địa trọn gói của MH36 TRAVEL đều đã bao gồm vé máy bay và bảo hiểm du lịch lên đến 100.000.000đ. Chi tiết vui lòng xem trong phần "Bao gồm & Không bao gồm" ở mỗi Tour.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
             <h3 className="text-lg font-bold mb-2">Làm sao để tôi huỷ chuyến?</h3>
             <p className="text-muted-foreground">Bạn có thể liên hệ trực tiếp tổng đài 1900 3636. Tuy nhiên, mức độ hoàn phí sẽ căn cứ dựa trên "Chính sách và Điều khoản hoàn huỷ" mà MH36 quy định.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
