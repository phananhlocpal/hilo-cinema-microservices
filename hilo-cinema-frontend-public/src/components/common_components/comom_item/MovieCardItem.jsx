import { Payments, PlayArrow } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { openTrailerModal } from '../../../redux/actions/trailerAction';   

const MovieCardItem = ({
    widthCard = '140px',
    heightCard = '210px',
    title = "N/A",
    imageUrl = "",
    href = "#",
    trailer,
    id
}) => {

    const dispatch = useDispatch();

    const handlePlayClick = () => {
      dispatch(openTrailerModal(trailer));
    };

    // Convert widthCard and heightCard to numbers for comparison
    const widthCardNumber = parseInt(widthCard);
    const heightCardNumber = parseInt(heightCard);

    var trailerButtonWidth = 0
    var trailerButtonHeight = 0
    if (widthCardNumber > 140 && heightCardNumber > 210) {
        trailerButtonWidth = `calc(${widthCard} * 3 / 5`;
        trailerButtonHeight = `calc(${heightCard} * 1 / 9)`;
    }
    if (widthCardNumber <= 140 && heightCardNumber <= 210) {
        trailerButtonWidth = `80px`;
        trailerButtonHeight = `45px`;
    }

    // Check if width and height are greater than the threshold
    const showText = widthCardNumber > 140 && heightCardNumber > 210;
  
    return (
        <div key={id} className="list-none text-sm text-black py-2 transition-all duration-300">
            <div className="inline-block relative max-w-full" style={{ width: widthCard, height: heightCard }}>
                <div className="inline-block cursor-pointer rounded overflow-hidden card__movies max-w-full false">
                    <div className="object-cover rounded relative card__img max-w-full">
                        <div className="absolute hidden md:block w-full h-full z-10 cursor-pointer bg-[#00000080] transition-all duration-300 ease-in-out opacity-0 hover:opacity-100">
                            <div className="card__hover__content flex flex-col justify-center items-center w-full h-full">
                                <a href={`/chon-phim/${href}`} className={`flex items-center justify-center text-white bg-[#f26b38] hover:bg-[#fb9440] rounded text-sm px-5 py-2.5 text-center dark:hover:bg-[#fb9440] dark:focus:ring-[#fb9440]`} style={{ width: trailerButtonWidth, height: trailerButtonHeight }}>
                                    <Payments alt="Logo Buy Ticket" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" className={`${showText ? 'mr-2' : ''}`} />
                                    {showText && <span>Mua vé</span>}
                                </a>
                                <a onClick={() => handlePlayClick(trailer)}  className={`flex items-center justify-center mt-3 border-white border-2 text-white bg-transparent hover:bg-[#fb9440] rounded text-sm px-5 py-2.5 text-center`} style={{ width: trailerButtonWidth, height: trailerButtonHeight }}>
                                    <PlayArrow alt="Logo Watch Trailer" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" className={`${showText ? 'mr-2' : ''}`} />
                                    {showText && <span>Xem trailer</span>}
                                </a>
                            </div>
                        </div>
                        <a href={`/chon-phim/${href}`}>
                            <img alt={title} loading="lazy" style={{ width: widthCard, height: heightCard }} decoding="async" data-nimg="1" className="undefined object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0" src={`data:image/jpeg;base64,${imageUrl}`} />
                        </a>
                        <div className="votes">
                            <p className="absolute right-[5px] bottom-10">
                                <span>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="svg-inline--fa fa-star text-yellow-300 mr-5 text-[12px]" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                                    </svg>
                                </span>
                                <span className="text-[18px] font-bold text-white">9</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="Card_card__title mt-2">
                    <a href={`/chon-phim/${href}`} className="text-sm font-semibold not-italic w-[140px] overflow-hidden">{title}</a>
                </div>
            </div>
            
        </div>
    );
};

MovieCardItem.propTypes = {
    widthCard: PropTypes.string,
    heightCard: PropTypes.string,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    href: PropTypes.string,
    trailer: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default MovieCardItem;
