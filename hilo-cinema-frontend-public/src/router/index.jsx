import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BasicLayout from "../components/BasicLayout";
import HomePage from "../pages/HomePage";
import PostListPage from "../pages/PostListPage";
import BookingPage from "../pages/BookingPage";
import FilmDetail from "../pages/FilmDetail";
import TheaterPage from "../pages/TheaterPage";
import PaymentResult from "../pages/PaymentResult";
import ListMovieNowShowing from "../pages/ListMovieNowShowing";
import DetailPostPage from "../pages/DetailPostPage";
import AccountPage from "../pages/AccountPage";
import Page404NotFound from "../pages/Page404NotFound"

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<BasicLayout />}>
          <Route path="*" element={<Page404NotFound />} /> 

          <Route index element={<HomePage />} />
          <Route path="/trang-chu" element={<HomePage />} />
          <Route path="/blog/:postTypeHref" element={<PostListPage />} />
          <Route path="/dat-ve" element={<BookingPage/>}/>
          <Route path="/phim-dang-chieu" element={<ListMovieNowShowing/>}/>
          <Route path="/ket-qua-dat-ve" element={<PaymentResult/>}/>
          <Route path="/dat-ve/:movieId" element={<BookingPage />} />
          <Route path="/chon-phim/:movieUrl" element={<FilmDetail />} />
          <Route path="/rap-chieu/:theaterId/:theaterName" element={<TheaterPage/>} />
          <Route path="/binh-luan-phim/:blogId/:blogUrl" element={<DetailPostPage/>}/>
          <Route path="/tai-khoan" element={<AccountPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterComponent;
