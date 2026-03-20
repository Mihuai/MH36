export default function PrivacyPolicyPage() {
  return (
    <div className="bg-card min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-12 border-b pb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Chính sách bảo mật</h1>
          <p className="text-muted-foreground">Cập nhật lần cuối: 10/01/2026</p>
        </div>

        <div className="prose prose-slate prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">1. Mục đích thu thập thông tin cá nhân</h2>
            <p className="text-muted-foreground leading-relaxed">MH36 TRAVEL cam kết không mua bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng trên trang web cho một bên thứ ba nào khác. Thông tin thu thập chủ yếu bằng form Đặt tour sẽ chỉ được sử dụng trong nội bộ công ty bao gồm: Đặt vé máy bay, check-in khách sạn, làm bảo hiểm.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">2. Phương tiện và công cụ để người dùng chỉnh sửa dữ liệu</h2>
            <p className="text-muted-foreground leading-relaxed">Bạn có thể liên hệ địa chỉ email gửi về support@mh36travel.com hoặc truy cập trực tiếp trang Dashboard Dashboard của "Tài Khoản Của Tôi" để yêu cầu MH36 TRAVEL chỉnh sửa hoặc xóa dữ liệu cá nhân.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">3. Thông tin thanh toán</h2>
            <p className="text-muted-foreground leading-relaxed">MH36 TRAVEL không bao giờ lưu trữ thẻ VISA/Mastercard hay mật khẩu tài khoản ngân hàng của bạn. Khi đến bước thanh toán, hệ thống sẽ redirect bạn sang Sandbox của cổng Ngân hàng VNPAY hoặc ví MoMo. Mọi lớp mã hoá dữ liệu thanh toán là do VNPay đảm nhiệm đạt tiêu chuẩn PCI DSS toàn cầu.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
