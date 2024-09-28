import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTab, fetchMovies } from '../redux/actions/homeAction.js';
import { CarouselDefault } from '../components/home_components/BannerComponent.jsx';
import PromotionalNewsComponent from '../components/home_components/PromotionalNewsComponent.jsx';
import BlogComponent from '../components/home_components/BlogComponent.jsx';
import CinemaControlTab from '../components/home_components/CinemaControlTab.jsx';
import CinemaListComponent from '../components/home_components/CinemaListComponent.jsx';

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    dispatch(setTab(newValue));
  };

  return (
    <div>
      <CarouselDefault page='home'/>
      <div className='px-28 pt-10'>
        <div className='flex flex-row'>
          <div className='w-3 h-12 mr-3 bg-blue-600'></div>
          <div className='flex justify-center items-center h-13'>
            <p className='mr-5 font-bold text-blue-600'>PHIM</p>
          </div>
          <CinemaControlTab onChange={handleTabChange} />
        </div>
        <div>
          <CinemaListComponent />
        </div>
      </div>
      <div className="line-default block" style={{ borderBottom: '6px solid #f4f4f4', transform: 'matrix(1, 0, 0, -1, 0, 0)' }}></div>
      <div className='px-28 pt-10'>
        <div className='flex flex-row'>
          <div className='w-3 h-12 mr-3 bg-blue-600'></div>
          <div className='mr-20 flex justify-center items-center h-13'>
            <p className='font-bold text-blue-600 whitespace-nowrap '>GÓC ĐIỆN ẢNH</p>
          </div>
        </div>
        <div>
          <BlogComponent/>
        </div>
      </div>
      <div className="line-default block" style={{ borderBottom: '6px solid #f4f4f4', transform: 'matrix(1, 0, 0, -1, 0, 0)' }}></div>
      <div className='px-28 pt-10'>
        <div className='flex flex-row'>
          <div className='w-3 h-12 mr-3 bg-blue-600'></div>
          <div className='mr-20 flex justify-center items-center h-13'>
            <p className='font-bold text-blue-600 whitespace-nowrap '>TIN TỨC KHUYẾN MÃI</p>
          </div>
        </div>
        <div>
          <PromotionalNewsComponent/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
