import { useEffect, useState } from 'react';
import { CarouselDefault } from '../components/home_components/BannerComponent.jsx';
import { useParams } from 'react-router-dom';
import axios from "axios";
import ListMovieNowShowing from "../pages/ListMovieNowShowing.jsx"

const TheaterPage = () => {
    const { theaterId } = useParams();
    const [theater, setTheater] = useState();

    const fetchTheaterById = async (theaterId) => {
        try {
            const response = await axios.get(`http://localhost:8000/TheaterService/${theaterId}`);
            console.log(response.data);
            setTheater(response.data);
        } catch (error) {
            console.error("Somthing wrong in theater page: ", error);
        }
    }

    useEffect(() => {
        fetchTheaterById(theaterId);
    }, [theaterId]);


    return (
        <div>
            <CarouselDefault page='theater' />
            {theater && (
                <div className="cinema__info">
                    <div className="grid lg:grid-cols-3 grid-cols-1  grid-flow-row  gap-y-6  my-0 mx-auto md:items-center screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl md:px-4 sm:px-[45px] px-[16px] py-6">
                        <div className="col-span-2">
                            <h1 className="text-[25px] font-bold" style={{ fontFamily: "Nunito Sans,sans-serif" }}>{theater.name}</h1>
                            <p className="text-sm md:mt-5">
                                <span className="text-grey-40 mr-1">
                                    Địa chỉ:</span> {theater.detailAddress}</p>
                            <p className="text-sm">
                                <span className="text-grey-40">Hotline:</span>
                                <a className="text-blue-10 transition-all duration-300 ml-1" href={`tel:${theater.hotline}`}>{theater.hotline}</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {theater && (
                <div className="bg-gray-200 md:py-8">
                    <div className="my-0 mx-auto items-center screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl md:px-4 sm:px-[45px] px-[16px] py-6">
                        <div className="bg-white p-4">
                            <div className="mb-4">
                                <span className="border-l-4 border-solid border-blue-10 mr-2">
                                </span>
                                <h1 className="text-xl inline-block uppercase font-bold m-0" style={{ fontFamily: "Nunito Sans,sans-serif" }}>Phim Đang Chiếu</h1>
                            </div>
                            <ListMovieNowShowing limit={4} />
                        </div>
                        <div className="grid md:grid-cols-2 grid-cols-1 mt-8">
                            <div className="bg-white p-4">
                                <div className="mb-4">
                                    <span className="border-l-4 border-solid border-blue-10 mr-2"></span>
                                    <h1 className="text-xl inline-block uppercase font-bold m-0" style={{ fontFamily: "Nunito Sans,sans-serif" }}>Giá vé</h1>
                                </div><ul className="cinema__tickets-pricing"><li className="mb-4 text-center">
                                    <img alt="" loading="lazy" width="1280" height="650" decoding="async" data-nimg="1" className="inline object-cover object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" style={{ color: "transparent" }} src="https://cdn.galaxycine.vn/media/2023/12/12/giave-sala-haatopia_1702352361091.jpg" />
                                </li>
                                    <li className="mb-4 text-center">
                                        <img alt="" loading="lazy" width="1280" height="650" decoding="async" data-nimg="1" className="inline object-cover object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" style={{ color: "transparent" }} src="https://cdn.galaxycine.vn/media/2023/12/12/giave-sala-imax_1702352378020.jpg" />
                                    </li>
                                    <li className="mb-4 text-center">
                                        <img alt="" loading="lazy" width="1280" height="650" decoding="async" data-nimg="1" className="inline object-cover object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" style={{ color: "transparent" }} src="https://cdn.galaxycine.vn/media/2023/12/12/giave-sala-lagon-laurus_1702352391401.jpg" />
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white p-4">
                                <div className="mb-4">
                                    <span className="border-l-4 border-solid border-blue-10 mr-2"></span>
                                    <h1 className="text-xl inline-block uppercase font-bold m-0" style={{ fontFamily: "Nunito Sans,sans-serif" }}>Thông tin chi tiết</h1>
                                </div>
                                <div className="cinema__info">
                                    <ul>
                                        <li>
                                            <strong className="text-grey-80">Địa chỉ: </strong>
                                            <strong className='mr-1' style={{ fontFamily: "Nunito Sans,sans-serif" }}>{theater.detailAddress}</strong>
                                        </li>
                                        <li>
                                            <strong className="text-grey-80">Số điện thoại: </strong>
                                            <strong className='mr-1' style={{ fontFamily: "Nunito Sans,sans-serif" }}>{theater.hotline}</strong>
                                        </li>
                                    </ul>
                                    <div className="cinema__map-embed my-4">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4528.4373535557825!2d106.72208299754183!3d10.770808140059383!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f5fb17d951b%3A0x879515ea9e7a7425!2sGalaxy%20Thiso%20Sala!5e0!3m2!1sen!2s!4v1701232001854!5m2!1sen!2" className="w-full h-[250px]"></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default TheaterPage;
