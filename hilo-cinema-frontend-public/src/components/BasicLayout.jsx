import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { Outlet } from 'react-router-dom';
import TrailerModal from './trailer_components/TrailerModal.jsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllMovies } from '../redux/actions/movieAction.js';
import CheckTokenExpiration from '../helpers/CheckTokenExpiration.jsx';

const BasicLayout = () => {
    CheckTokenExpiration();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllMovies());
    }, [dispatch]);

    return (
            <div className='relative'>
            <Header />
            <div className="line-default block" style={{ borderBottom: '6px solid #f4f4f4', transform: 'matrix(1, 0, 0, -1, 0, 0)' }}></div>
            <Outlet />
            <Footer />
            <TrailerModal/>
        </div>
        
    );
};

export default BasicLayout;

