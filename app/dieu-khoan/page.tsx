export default function TermsPage() {
  return (
    <div className="bg-card min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-12 border-b pb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Các Điều khoản và Chính sách</h1>
          <p className="text-muted-foreground">Cập nhật lần cuối: 15/03/2026</p>
        </div>

        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">1. Giới thiệu chung</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chào mừng quý khách đến với MH36 TRAVEL. Khi quý khách truy cập vào trang web của chúng tôi có nghĩa là quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Quy định và Điều kiện sử dụng, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">2. Quy định dành cho Khách hàng sử dụng dịch vụ</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed marker:text-primary">
              <li>Quý khách hoàn toàn tự chịu trách nhiệm trong việc đảm bảo tình trạng sức khỏe cá nhân của chính mình khi tham gia tất cả các hoạt động nằm trong chương trình tour/tuyến do chúng tôi thiết kế, ngoại trừ một số trường hợp rủi ro khách quan do lịch trình không báo trước.</li>
              <li>Thông tin về độ tuổi của khách (đặc biệt đối với vé trẻ em) cần phải được khai báo trung thực. Hãng hàng không, dịch vụ đối tác và chúng tôi có quyền từ chối cung cấp dịch vụ nếu phát hiện sai sót mạo danh ảnh hưởng đến quy chuẩn an toàn hàng không hay quy chuẩn chỗ ở tại khách sạn/Resort nghỉ dưỡng.</li>
              <li>Quý khách cần cung cấp đầy đủ thông tin vào Form Đặt Chỗ, bao gồm: Ngày khởi hành, Số người lớn - Trẻ em đi cùng, Thông tin liên hệ và hình thức thanh toán xác thực.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">3. Hình thức thanh toán</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Chúng tôi hiện cung cấp hệ thống thanh toán điện tử an toàn kết hợp với 2 đối tác Payment Gateway lớn tại thị trường:
            </p>
            <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
              <ul className="list-none space-y-4">
                <li><strong className="text-foreground">✓ Cổng VNPAY:</strong> Hỗ trợ App ứng dụng Ngân hàng Quét mã QR, thanh toán bằng thẻ ATM nội địa. Giao dịch tức thời và hoàn toàn miễn phí giao dịch (phí này được MH36 đôn đáo tự chịu trách nhiệm).</li>
                <li><strong className="text-foreground">✓ Ví MoMo:</strong> Thanh toán nhanh thông qua app ví điện tử MoMo.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">4. Chính sách hoàn hủy Tour</h2>
            <div className="overflow-x-auto mt-4 rounded-xl border border-border/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-4 font-semibold text-foreground border-b border-border/50">Thời gian hủy trước khởi hành</th>
                    <th className="p-4 font-semibold text-foreground border-b border-border/50">Mức phạt hủy / Phí bồi thường</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-muted-foreground text-sm">
                  <tr>
                    <td className="p-4">30 ngày trở lên</td>
                    <td className="p-4 font-medium text-green-600">Miễn phí hoàn 100%</td>
                  </tr>
                  <tr>
                    <td className="p-4">15 - 29 ngày</td>
                    <td className="p-4">30% Gía trị tiền cọc/đơn hàng</td>
                  </tr>
                  <tr>
                    <td className="p-4">07 - 14 ngày</td>
                    <td className="p-4">50% Gía trị đơn hàng</td>
                  </tr>
                  <tr className="bg-rose-50/50 dark:bg-rose-950/20">
                    <td className="p-4">Dưới 07 ngày</td>
                    <td className="p-4 font-bold text-rose-600">100% Gía trị đơn hàng (Không hoàn trả)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              * Quy định này có thể thay đổi tùy thuộc vào dịp Lễ / Tết do nhà cung cấp vé Hàng không/ Tàu thuyền thay đổi chính sách.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">5. Chính sách bảo mật</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dữ liệu của khách hàng sử dụng cho mục đích hoàn thiện hồ sơ book vé, mua bảo hiểm du lịch được Hệ thống MH36 lưu trữ an toàn (End-to-end Encryption) không tiết lộ thông tin cho bên thứ 3 nào ngoại trừ trường hợp pháp luật / Tòa án yêu cầu. Xem báo cáo chứng nhận nền tảng tại Privacy Policies Platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
