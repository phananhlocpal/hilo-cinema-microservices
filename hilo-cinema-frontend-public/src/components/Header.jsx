import logo1_color from '../assets/images/logo/logo1_color.png';
import thele from '../assets/images/image/the-le.svg';
import mem_register from '../assets/images/image/member-register.png'
import {
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MovieNBExtended from "./extendedNavBar/MovieNBExtended";
import CinemaCornerNBExtended from "./extendedNavBar/CinemaCornerNBExtended";
import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'
import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieSearch from './common_components/MovieSearch';
import { useDispatch, useSelector } from 'react-redux';
import ava_male from '../assets/images/ava/ava_male.png'
import ava_female from '../assets/images/ava/ava_female.png';
import { isLogIn } from '../redux/actions/authAction';

const Header = () => {
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [theaters, setTheater] = useState([]);
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { account } = useSelector((state) => state.auth)

    console.log(account, isAuthenticated);

    // Function to handle opening the modal
    const handleOpenSearchModal = () => {
        setIsSearchModalOpen(true);
    };

    // Function to handle closing the modal
    const handleCloseSearchModal = () => {
        setIsSearchModalOpen(false);
    };

    const handleOpenSignInModal = () => {
        setIsSignInModalOpen(true);
    }

    const handleCloseSignInModal = () => {
        setIsSignInModalOpen(false);
    }

    const handleOpenSignUpModal = () => {
        setIsSignUpModalOpen(true);
    }

    const handleCloseSignUpModal = () => {
        setIsSignUpModalOpen(false);
    }

    const handleLogOut = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
    }

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        // Update login state based on account and jwtToken
        if (account == null || token == null) {
            isLogIn(false);
            // Optionally, you can also dispatch a logout action
            dispatch(isLogIn(false));
        } else {
            isLogIn(true);
        }
    }, [account, dispatch]);

    useEffect(() => {
        // Gọi API để lấy dữ liệu phim
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8000/TheaterService');
                const theaterList = response.data.map(theater => ({
                    id: theater.id,
                    theaterName: theater.name
                }));

                setTheater(theaterList);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);



    const MenuItems = [
        {
            title: 'Phim',
            component: <MovieNBExtended />
        },
        {
            title: 'Bài viết',
            component: <CinemaCornerNBExtended type="bai-viet" listItem={["Tin mới", "Diễn viên", "Bình luận phim"]} />
        },
        {
            title: 'Sự kiện',
            component: <CinemaCornerNBExtended type="su-kien" listItem={["Ưu đãi", "Phim hay tháng"]} />
        },
        {
            title: 'Rạp chiếu',
            component: <CinemaCornerNBExtended type="rap-chieu" listItem={theaters} />
        }
    ];

    return (

        <div>
            <header className="Header_header pt-5 pb-2 lg:pt-3">
                <div id="screen-hover" className="opacity-60 fixed top-0 right-0 bottom-0 left-0 overflow-hidden w-screen h-screen transition-all duration-500 ease-in-out hidden screen1200:hidden"></div>
                <div className="my-0 mx-auto screen1390:max-w-screen-xl screen1200:max-w-6xl lg:max-w-4xl lg:px-0 md:px-4 sm:px-[45px] px-[16px]">
                    <nav id="hor-navbar" className="flex justify-start justify-items-center items-center flex-row undefined">
                        <a className="logo__header grow-0 md:mr-[40px] mr-[20px]" href="/">
                            <img alt="HILO - Cinema" loading="lazy" width="150" height="100" decoding="async" data-nimg="1" className="max-w-min w-[130px] h-[80px] lg:w-[150px] lg:h-[100px] object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={logo1_color} />
                        </a>
                        <a className="screen1200:hidden grow text-left block mr-4" href="/booking/">
                            <img alt="Booking" loading="lazy" width="150" height="150" decoding="async" data-nimg="1" className="max-w-min w-[150px] h-[150px] lg:w-[100px] lg:h-[100px] inline-block object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src="https://www.galaxycine.vn/_next/static/media/btn-ticket.42d72c96.webp" />
                        </a>
                        <div className="hidden screen1200:flex screen1200:grow screen1200:basis-full items-center gap-8 px-5 transition-all duration-300 ease-in-out">
                            <div className="grow md:flex hidden items-center justify-center">
                                <a className="md:block hidden mr-4" href="/booking/">
                                    <img alt="Ticket" loading="lazy" width="112" height="36" decoding="async" data-nimg="1" className="max-w-min w-[84px] h-[27px] lg:w-[112px] lg:h-[36px] object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src="https://www.galaxycine.vn/_next/static/media/btn-ticket.42d72c96.webp" />
                                </a>
                                {MenuItems.map((item, index) => (
                                    <div key={index} className="hover relative">
                                        <div className="px-3 text-left md:cursor-pointer group  transition-all duration-300">
                                            <a href="/" className="py-7 flex text-sm justify-between items-center md:pr-0 pr-5 group capitalize hover:text-orange-500 transition-all duration-300">
                                                {item.title}
                                                <span className="text-xs md:hidden inline text-[#777777]">
                                                    <FontAwesomeIcon icon={faChevronDown} className="chevron-down transition-all duration-300 ease-in-out" />
                                                </span>
                                                <span className="text-xs md:ml-2 md:block hidden group-hover:text-primary transition-all duration-300 ease-in-out text-[#777777]">
                                                    <FontAwesomeIcon className="ml-2 " icon={faChevronDown} size="2xs" />
                                                </span>
                                            </a>
                                            {item.component}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isAuthenticated ? (
                            <div className="hidden screen1200:flex screen1200:grow screen1200:basis-6/12 screen1200:justify-end uppercase items-center relative  transition-all duration-300">
                                <div className="search mr-4">
                                    <button onClick={handleOpenSearchModal} className="font-light cursor-pointer text-sm text-[#777]" title="Tìm kiếm">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" className="svg-inline--fa fa-magnifying-glass " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
                                    </button>
                                </div>
                                <div className="md:px-2 py-4 relative items-center text-left md:cursor-pointer group transition-all duration-500 ease-in-out md:flex hidden">
                                    <div className='w-[40px] h-[40px] leading-[62px] text-center rounded-full bg-[#D0D0D0] border-4 border-solid border-[#E9E9E2] flex-none  mr-4'>
                                        <img src={account.gender==="Male"? ava_male : ava_female} className='w-full h-full rounded-full object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)' />
                                    </div>
                                    <div className="flex items-center justify-center gap-[6px]">
                                        <img alt="Logo Star Mini" loading="lazy" width="20" height="30" decoding="async" data-nimg="1" className="inline-block w-[20px] h-[30px]" src="https://cdn.galaxycine.vn/media/2020/5/15/s_1589511977688.png" style={{ color: "transparent" }} />
                                        <p className="flex-auto md:flex hidden flex-col text-sm font-bold not-italic justify-start items-start md:pr-0 group hover:text-orange-500 transition-all duration-500 ease-in-out capitalize">{account.name}
                                            <span className="block text-xs font-light not-italic">Customer</span>
                                        </p>
                                    </div>
                                    <button type="button" className="md:py-7 md:hidden flex text-sm font-bold not-italic justify-between items-center md:pr-0 group hover:text-orange-500 transition-all duration-500 ease-in-out">{account.name}</button>
                                    <div className="absolute left-0 w-full min-w-[150px] max-w-[220px] top-16 hidden group-hover:md:block hover:md:block z-[500] transition-all duration-500 ease-in-out">
                                        <div className="bg-white text-center border border-white border-solid rounded" style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px" }}>
                                            <ul className="flex flex-col">
                                                <li>
                                                    <a href="/tai-khoan" className="text-sm text-left text-black py-2 px-[18px] hover:text-[#f26b38] hover:border-l-4 hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 flex items-center justify-between capitalize" type="button">
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clipboard-user" className="svg-inline--fa fa-clipboard-user mr-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM128 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 432c0-44.2 35.8-80 80-80h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16z"></path></svg>
                                                        <span className="grow ml-4">Tài khoản</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="text-sm text-left text-black py-2 px-[18px] hover:text-[#f26b38] hover:border-l-4 hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 flex items-center justify-between capitalize" type="button">
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="list-ol" className="svg-inline--fa fa-list-ol " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M24 56c0-13.3 10.7-24 24-24H80c13.3 0 24 10.7 24 24V176h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H40c-13.3 0-24-10.7-24-24s10.7-24 24-24H56V80H48C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432H120c13.3 0 24 10.7 24 24s-10.7 24-24 24H32c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></svg>
                                                        <span className="grow ml-4">Lịch sử</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="text-sm text-left text-black py-2 px-[18px] hover:text-[#f26b38] hover:border-l-4 hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 flex items-center justify-between capitalize" onClick={handleLogOut}>
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right-from-bracket" className="svg-inline--fa fa-arrow-right-from-bracket rotate-180" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"></path></svg>
                                                        <span className="grow ml-4">Đăng xuất</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div className="hidden screen1200:flex screen1200:grow screen1200:basis-6/12 screen1200:justify-end uppercase items-center relative  transition-all duration-300">
                                <div className="search mr-4">
                                    <button onClick={handleOpenSearchModal} className="font-light cursor-pointer text-sm text-[#777]" title="Tìm kiếm">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" className="svg-inline--fa fa-magnifying-glass " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
                                    </button>
                                </div>
                                <a className="ml-2 text-sm text-[#777] capitalize cursor-pointer transition-all duration-300 hover:text-[#f26b38]" onClick={handleOpenSignInModal}>Đăng nhập</a>
                                <div className="hover">
                                    <div className="px-3 py-7 text-left md:cursor-pointer group  transition-all duration-300 flex">
                                        <a href="/" className="cursor-pointer logo__header grow-0">
                                            <img alt="HILO Cinema" loading="lazy" width="40" height="38" decoding="async" data-nimg="1" src={mem_register} />
                                        </a>
                                        <div className="absolute top-20 right-0 hidden group-hover:md:block hover:md:block z-[400] transition-all duration-300 ease-in-out drop-shadow-lg">
                                            <div className="bg-white min-w-[425px] max-w-[780px] border border-white border-solid rounded px-6 py-4" >
                                                <div className="grid grid-cols-2 gap-5">
                                                    <div className="flex flex-col justify-start items-center gap-4 pt-6">
                                                        <img alt="Image Rules" loading="lazy" width="85" height="80" decoding="async" data-nimg="1" className="w-[85px] h-[80px]" src={thele} />
                                                        <h3 className="text-sm font-bold not-italic capitalize text-center">Thể lệ</h3>
                                                        <a className="w-[80px] h-8 leading-8 text-center text-primary border border-primary rounded text-[14px] font-bold not-italic hover:bg-primary hover:text-white hover:bg-orange-500 transition-all duration-300 focus:ring-1 focus:outline-none focus:ring-[#fb9440] capitalize" href="/tai-khoan/#policy!the-le">Chi tiết</a>
                                                    </div>
                                                    <div className="flex flex-col justify-start items-center gap-4 pt-6">
                                                        <img alt="Image Rules" loading="lazy" width="85" height="80" decoding="async" data-nimg="1" className="w-[85px] h-[80px]" src={mem_register} />
                                                        <h3 className="text-sm font-bold not-italic capitalize text-center">Đăng Ký Thành Viên Hilo Nhận Ngay Ưu Đãi!</h3>
                                                        <a className="w-[80px] h-8 leading-8 text-center text-primary border border-primary rounded text-[14px] font-bold not-italic hover:bg-primary hover:text-white hover:bg-orange-500 transition-all duration-300 focus:ring-1 focus:outline-none focus:ring-[#fb9440] capitalize" onClick={handleOpenSignUpModal}>Đăng ký</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isAuthenticated ? (
                            <div className="flex md:grow md:basis-6/12 justify-end screen1200:hidden">
                                <img src={ava_male} />
                                <p>{account.name}</p>

                            </div>

                        ) : (
                            <div className="flex md:grow md:basis-6/12 justify-end screen1200:hidden">
                                <a href="/" className="text-sm text-[#777] capitalize cursor-pointer transition-all duration-300 hover:text-[#f26b38]" onClick={handleOpenSignInModal}>
                                    <span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline align-baseline mr-1"><path d="M9.69311 7.82311L12.7177 9.19792C13.4986 9.55289 14 10.3315 14 11.1893V11.8125C14 13.0206 13.0206 14 11.8125 14H2.1875C0.979377 14 0 13.0206 0 11.8125V11.1893C0 10.3315 0.501381 9.55289 1.28231 9.19792L4.30689 7.82311C3.28308 7.02234 2.625 5.77552 2.625 4.375C2.625 1.95875 4.58375 0 7 0C9.41625 0 11.375 1.95875 11.375 4.375C11.375 5.77552 10.7169 7.02234 9.69311 7.82311ZM5.21611 8.37103L1.64438 9.99454C1.17583 10.2075 0.875 10.6747 0.875 11.1894V11.8126C0.875 12.5374 1.46263 13.1251 2.1875 13.1251H11.8125C12.5374 13.1251 13.125 12.5374 13.125 11.8126V11.1894C13.125 10.6747 12.8242 10.2075 12.3556 9.99454L8.78389 8.37103C8.23909 8.61461 7.63536 8.75005 7 8.75005C6.36464 8.75005 5.76091 8.61461 5.21611 8.37103ZM10.5 4.375C10.5 6.308 8.933 7.875 7 7.875C5.067 7.875 3.5 6.308 3.5 4.375C3.5 2.442 5.067 0.875 7 0.875C8.933 0.875 10.5 2.442 10.5 4.375Z" fill="#333333"></path></svg></span>
                                    Đăng nhập
                                </a>
                                <button className="ml-4" data-hs-overlay="#hs-overlay-unstyled" aria-controls="hs-overlay-unstyled" aria-label="Toggle navigation">
                                    <span><svg width="20" height="14" viewBox="0 0 20 14" fill="none"><path d="M1.05263 2C0.761955 2 0 1.55228 0 1C0 0.447715 0.761955 0 1.05263 0H18.9474C19.238 0 20 0.447715 20 1C20 1.55228 19.238 2 18.9474 2H1.05263ZM6.89744 8C6.69918 8 6 7.55228 6 7C6 6.44772 6.69918 6 6.89744 6H19.1026C19.3008 6 20 6.44772 20 7C20 7.55228 19.3008 8 19.1026 8H6.89744ZM0 13C0 13.5523 0.761955 14 1.05263 14H18.9474C19.238 14 20 13.5523 20 13C20 12.4477 19.238 12 18.9474 12H1.05263C0.761955 12 0 12.4477 0 13Z" fill="#777777"></path></svg></span>
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
                <nav id="vert-navbar" className="fixed pr-4 md:px-11 z-[1030] block w-[287px] md:w-[346px] top-0 bottom-0 h-full bg-white transition-all duration-500 ease-in-out pl-8 pt-6 overflow-hidden translate-x-[100px] -right-[500px] screen1200:hidden">
                    <div className="flex justify-end">
                        <button>
                            <span>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.00065 6.05687L12.5292 0.52827C12.7896 0.26792 13.2117 0.26792 13.4721 0.52827C13.7324 0.788619 13.7324 1.21073 13.4721 1.47108L7.94346 6.99967L13.4721 12.5283C13.7324 12.7886 13.7324 13.2107 13.4721 13.4711C13.2117 13.7314 12.7896 13.7314 12.5292 13.4711L7.00065 7.94248L1.47206 13.4711C1.21171 13.7314 0.789596 13.7314 0.529247 13.4711C0.268897 13.2107 0.268897 12.7886 0.529247 12.5283L6.05784 6.99967L0.529247 1.47108C0.268897 1.21073 0.268897 0.788619 0.529247 0.52827C0.789596 0.26792 1.21171 0.26792 1.47206 0.52827L7.00065 6.05687Z" fill="#646464"></path></svg>
                            </span>
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="relative">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" className="svg-inline--fa fa-magnifying-glass absolute top-[30%] left-[5%] text-[#333333]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
                            <input type="text" placeholder="Tìm kiếm" className="w-full border rounded h-[40px] py-2 outline-none border-[#D0D0D0] px-10"/>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4 justify-center">
                        <a className="md:hidden block text-center w-full">
                            <img alt="Ticket" loading="lazy" width="87" height="27" decoding="async" data-nimg="1" className="max-w-min w-[87px] h-[27px] inline-block object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src="https://www.galaxycine.vn/_next/static/media/btn-ticket.01407df7.png" />
                        </a>
                        <div className="flex justify-center items-center w-full">
                            <div className="flex items-center flex-wrap justify-center flex-auto mr-1">
                                <a className="cursor-pointer logo__header grow-0">
                                    <img alt="Galaxy - Cinema" loading="lazy" width="79" height="30" decoding="async" data-nimg="1" src="/_next/static/media/join-Gstar.24c52de9.svg" />
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center flex-wrap justify-end flex-auto mr-1 hidden"></div>
                    </div>
                    <div className="mt-4 flex flex-col">
                        <ul className="flex flex-col justify-start items-start grow-0 h-full ">
                            <div className="text-left md:cursor-pointer group transition-all capitalize pb-2 ">
                                <a className="flex text-sm justify-start items-center md:pr-0 pr-5 group group-[.is-active]:text-[#F58020] transition-all duration-100 ease-in-out">Phim
                                    <span className="text-xs ml-2 block transition-all  text-[#777777]">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
                                    </span>
                                </a>
                                <section className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-[.is-active]:max-h-[500px] group-[.is-active]:block hidden pl-5 w-full">
                                    <ul>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Phim đang chiếu</a>
                                        </li>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Phim sắp chiếu</a>
                                        </li>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Phim IMAX</a>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                            <div className="text-left md:cursor-pointer group transition-all capitalize pb-2  is-active">
                                <a className="flex text-sm justify-start items-center md:pr-0 pr-5 group group-[.is-active]:text-[#F58020] transition-all duration-100 ease-in-out">Góc điện ảnh
                                    <span className="text-xs ml-2 block transition-all  text-[#777777]"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg></span>
                                </a>
                                <section className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-[.is-active]:max-h-[500px] group-[.is-active]:block hidden pl-5 w-full">
                                    <ul>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Thể loại phim</a>
                                        </li>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Diễn Viên</a>
                                        </li>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Đạo Diễn</a>
                                        </li>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Bình Luận Phim</a>
                                        </li>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Blog Điện Ảnh</a>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                            <div className="text-left md:cursor-pointer group transition-all capitalize pb-2 ">
                                <a className="flex text-sm justify-start items-center md:pr-0 pr-5 group group-[.is-active]:text-[#F58020] transition-all duration-100 ease-in-out">Sự Kiện
                                    <span className="text-xs ml-2 block transition-all  text-[#777777]"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg></span>
                                </a>
                                <section className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-[.is-active]:max-h-[500px] group-[.is-active]:block hidden pl-5 w-full">
                                    <ul>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Ưu đãi</a>
                                        </li>
                                        <li className="text-sm text-black xl:hover:pl-0.5 xl:hover:border-l-4  xl:hover:border-[#fd841f] xl:hover:bg-[#fb770b1a]">
                                            <a className="block py-1 capitalize">Phim Hay Tháng</a>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                            <div className="text-left md:cursor-pointer group transition-all max-h-min bg-scroll ">
                                <a className="flex text-sm justify-start items-center md:pr-0 pr-5 group group-[.is-active]:text-[#F58020] transition-all duration-300 ease-in-out">Rạp / Giá Vé
                                    <span className="text-xs ml-2 block  transition-all duration-300 ease-in-out text-[#777777]"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" className="svg-inline--fa fa-angle-down " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg></span>
                                </a>
                                <section className="overflow-scroll bg-scroll transition-all duration-500 ease-in-out max-h-0 group-[.is-active]:block hidden pl-5 pb-4 w-full h-[180px] screen360:h-[380px] screen390:h-[400px] group-[.is-active]:max-h-[450px]">
                                    <ul>
                                        <li className="text-sm text-black hover:pl-0.5 hover:border-l-4  hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 ease-in-out ">
                                            <a className="block py-1">Galaxy Nguyễn Du</a>
                                        </li>
                                        <li className="text-sm text-black hover:pl-0.5 hover:border-l-4  hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 ease-in-out ">
                                            <a className="block py-1">Galaxy Sala</a>
                                        </li>
                                        <li className="text-sm text-black hover:pl-0.5 hover:border-l-4  hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 ease-in-out ">
                                            <a className="block py-1">Galaxy Tân Bình</a>
                                        </li>
                                        <li className="text-sm text-black hover:pl-0.5 hover:border-l-4  hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 ease-in-out ">
                                            <a className="block py-1">Galaxy Kinh Dương Vương</a>
                                        </li>
                                        <li className="text-sm text-black hover:pl-0.5 hover:border-l-4  hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 ease-in-out ">
                                            <a className="block py-1">Galaxy Quang Trung</a>
                                        </li>
                                        <li className="text-sm text-black hover:pl-0.5 hover:border-l-4  hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 ease-in-out ">
                                            <a className="block py-1">Galaxy Bến Tre</a>
                                        </li>
                                        <li className="text-sm text-black hover:pl-0.5 hover:border-l-4  hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300 ease-in-out ">
                                            <a className="block py-1">Galaxy Mipec Long Biên</a>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                        </ul>
                    </div>
                </nav>
                {
                    <SignUp open={isSignUpModalOpen} onClose={handleCloseSignUpModal} />
                }
                {
                    <SignIn isOpen={isSignInModalOpen} onClose={handleCloseSignInModal} />
                }
                {
                    <MovieSearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
                }
            </header>

        </div>
        
    );


};

export default Header;