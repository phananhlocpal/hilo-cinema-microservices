import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";
import MoviePage from "../pages/Movie";
import EmployeePage from "../pages/Employee/Index";
import CustomerPage from "../pages/Customer/Index";
import TheaterPage from "../pages/Theater/Index";
import AuthenPage from "../pages/Authentication/AuthenPage"
import CommingSoonPage from "../pages/CommingSoonPage";
import BlogPage from "../pages/Blog/Index";
import HomePage from "../pages/Home/HomePage";
import SchedulePage from "../pages/Schedule/Index";
import InvoicePage from "../pages/Invoice/Index";

const RouterComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BasicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/home" element={<CommingSoonPage />} />
                    <Route path="/rap-chieu" element={<TheaterPage />} />
                    <Route path="/phim-anh" element={<MoviePage />} />
                    <Route path="/khach-hang" element={<CustomerPage />} />
                    <Route path="/nhan-vien" element={<EmployeePage />} />
                    <Route path='/lich-chieu' element={<SchedulePage/>}/>
                    <Route path='/hoa-don' element={<InvoicePage />} />
                </Route>
                <Route path="/dang-nhap" element={<AuthenPage />} />
            </Routes>
        </Router>
    );
};

export default RouterComponent;
