import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { closeTrailerModal } from '../../redux/actions/trailerAction'; // Correct import path

const TrailerModal = () => {
    const dispatch = useDispatch();
    const { isOpen, trailerUrl } = useSelector((state) => state.trailer);

    // Function to extract YouTube video ID from URL
    const getYouTubeEmbedUrl = (trailerUrl) => {
        if (!trailerUrl) return '';

        const videoId = trailerUrl.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    };

    const customStyles = {
        iframe: {
            width: '100%',
            height: '100%',
            border: 'none',
            padding: '0px',
            margin: '0px',
        },
    };

    return (
        <Modal open={isOpen} onClose={() => dispatch(closeTrailerModal())} center classNames={{ modal: 'w-[85vw] h-[85vh] p-0 m-0 overflow-hidden', }} styles={{
            modal: {
                maxWidth: '85vw',
                minWidth: '85vw',
                maxHeight: '85vh',
                padding: '0',
            },
        }} showCloseIcon={false}>
            {trailerUrl ? (
                <iframe
                    style={customStyles.iframe}
                    src={getYouTubeEmbedUrl(trailerUrl)}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <p>Không có trailer để xem.</p>
            )}
        </Modal>
    );
};

export default TrailerModal;
