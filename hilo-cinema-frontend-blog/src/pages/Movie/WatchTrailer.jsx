import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TrailerModal = ({ isOpen, onClose, trailerUrl }) => {
    // Function to extract YouTube video ID from URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return ''; // Return an empty string if URL is not valid

        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Xem Trailer</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {trailerUrl ? (
                        <iframe
                            width="100%"
                            height="400px"
                            src={getYouTubeEmbedUrl(trailerUrl)}
                            title="Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <p>Không có trailer để xem.</p>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

TrailerModal.propTypes = {
    isOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    trailerUrl: PropTypes.string.isRequired,
}
export default TrailerModal;
