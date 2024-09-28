import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, Select, Button, Image } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { toBase64 } from "../../utils/toBase64";
import slugify from "slugify";

const UpdateMovieModal = ({ movie, isOpen, onClose, fetchMovies }) => {
    const [title, setTitle] = useState(movie.title);
    const [url, setUrl] = useState(movie.movieUrl);
    const [duration, setDuration] = useState(movie.duration);
    const [releasedDate, setReleasedDate] = useState(movie.releasedDate);
    const [description, setDescription] = useState(movie.description);
    const [trailer, setTrailer] = useState(movie.trailer);
    const [director, setDirector] = useState(movie.director);
    const [largeImage, setLargeImage] = useState(null); // Change to null initially
    const [smallImage, setSmallImage] = useState(null); // Change to null initially
    const [movieType, setselectedMovieType] = useState(movie.movieType);
    const [selectedCountry, setSelectedCountry] = useState(movie.country);
    const [status, setStatus] = useState(movie.status);
    const [countries, setCountries] = useState([]);
    const [scrollBehavior] = useState('inside');
    const [largeImagePreview, setLargeImagePreview] = useState(movie.largeImage); // For preview
    const [smallImagePreview, setSmallImagePreview] = useState(movie.smallImage); // For preview

    useEffect(() => {
        console.log(movie);
        const fetchCountries = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all");
                console.log("API Response:", response.data);

                const countryOptions = response.data
                    .map((country) => ({
                        value: country.cca2,
                        label: country.name.common
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setCountries(countryOptions);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        if (movie) {
            setTitle(movie.title);
            setUrl(movie.movieUrl);
            setDuration(movie.duration);
            setReleasedDate(movie.releasedDate);
            setDescription(movie.description);
            setTrailer(movie.trailer);
            setDirector(movie.director);
            setLargeImage(null); // Reset image to null
            setSmallImage(null); // Reset image to null
            setselectedMovieType(movie.movieType);
            setSelectedCountry(movie.country);
            setStatus(movie.status);
            setLargeImagePreview(movie.largeImage); // Set preview image
            setSmallImagePreview(movie.smallImage); // Set preview image
        }
    }, [movie, isOpen]);

    useEffect(() => {
        if (largeImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLargeImagePreview(reader.result);
            };
            reader.readAsDataURL(largeImage);
        }
    }, [largeImage]);

    useEffect(() => {
        if (smallImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSmallImagePreview(reader.result);
            };
            reader.readAsDataURL(smallImage);
        }
    }, [smallImage]);

    const handleTitleChange = (event) => {
        const newTitle = event.target.value;
        setTitle(newTitle);

        const slug = slugify(newTitle, {
            lower: true,
            strict: true,
            replacement: '-',
        });

        setUrl(slug);
    };

    const onUpdate = async () => {
        const token = localStorage.getItem("jwtToken");

        let imgSmallBase64 = '';
        let imgLargeBase64 = '';

        if (smallImage) imgSmallBase64 = await toBase64(smallImage);
        if (largeImage) imgLargeBase64 = await toBase64(largeImage);

        const data = {
            title: title,
            movieUrl: url,
            duration: duration,
            releasedDate: releasedDate,
            rate: 10,
            country: selectedCountry,
            director: director,
            description: description,
            imgSmall: imgSmallBase64,
            imgLarge: imgLargeBase64,
            movieType: movieType || null,
            trailer: trailer || null,
            status: status || null
        };

        try {
            await axios.put(`http://localhost:8000/MovieService/${movie.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: 'admin',
                    Role: 'admin'
                },
            });
            onClose(); // Close modal on success
            fetchMovies();
        } catch (error) {
            console.error("Error updating movie:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cập nhật phim</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input
                            placeholder="Title"
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Url</FormLabel>
                        <Input
                            placeholder="Url"
                            value={url}
                            readOnly
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Movie Type</FormLabel>
                        <Select
                            placeholder="Select Movie Type"
                            value={movieType}
                            onChange={(e) => setselectedMovieType(e.target.value)}
                        >
                            <option value='Phim 2D lồng tiếng'>2D lồng tiếng</option>
                            <option value='Phim 2D thuyết minh'>2D thuyết minh</option>
                            <option value='Phim 3D'>Phim 3D</option>
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Duration</FormLabel>
                        <Input
                            type='number'
                            placeholder="Duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Released Date</FormLabel>
                        <Input
                            type='date'
                            value={releasedDate}
                            onChange={(e) => setReleasedDate(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Trailer</FormLabel>
                        <Input
                            type='url'
                            placeholder="Link Trailer Youtube"
                            value={trailer}
                            onChange={(e) => setTrailer(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Country</FormLabel>
                        <Select
                            placeholder="Select country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            {Array.isArray(countries) && countries.map((country) => (
                                <option key={country.value} value={country.value}>
                                    {country.label}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Director</FormLabel>
                        <Input
                            placeholder="Director"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Large Image</FormLabel>
                        <Input
                            type="file"
                            onChange={(e) => setLargeImage(e.target.files[0])}
                        />
                        {largeImagePreview && <Image src={largeImagePreview} alt="Large Image Preview" boxSize="150px" objectFit="cover" mt={2} />}
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Small Image</FormLabel>
                        <Input
                            type="file"
                            onChange={(e) => setSmallImage(e.target.files[0])}
                        />
                        {smallImagePreview && <Image src={smallImagePreview} alt="Small Image Preview" boxSize="150px" objectFit="cover" mt={2} />}
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Status</FormLabel>
                        <Select
                            placeholder="Select Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                        </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onUpdate}>
                        Update
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

UpdateMovieModal.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        movieUrl: PropTypes.string,
        duration: PropTypes.number,
        releasedDate: PropTypes.string,
        description: PropTypes.string,
        trailer: PropTypes.string,
        director: PropTypes.string,
        largeImage: PropTypes.string,
        smallImage: PropTypes.string,
        movieType: PropTypes.string,
        country: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchMovies: PropTypes.func.isRequired
};

export default UpdateMovieModal;
