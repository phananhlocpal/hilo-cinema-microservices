import  logo3_color  from "../assets/images/logo/logo3_color.png"

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container px-6 pb-6 pt-6 mx-auto">
        <hr className="mb-6 mt-3 border-gray-200 md:my-10 dark:border-gray-700" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Liên kết nhanh</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="/" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Trang chủ</a>
              <a href="/phim-dang-chieu" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Phim đang chiếu</a>
              <a href="/tai-khoan" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Tài khoản</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Blogs</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="/blog/binh-luan-phim" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Bình luận phim</a>
              <a href="/blog/tin-moi" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Tin mới</a>
              <a href="/blog/uu-dai" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Ưu đãi</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Dịch vụ</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="/the-le" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Thể lệ</a>
              <a href="/chinh-sach" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Chính sách</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Liên hệ chúng tôi</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">+880 768 473 4978</a>
              <a href="#" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">info@hilocinema.com</a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-5 dark:border-gray-700" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <a href="#">
            <img className="w-auto h-[60px]" src={logo3_color} alt="" />
          </a>

          <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-300">2021 © Hilo Cinema - Hệ thống rạp chiếu phim hiện đại. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;