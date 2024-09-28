// create.jsx
import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, Select, Button } from "@chakra-ui/react";
import axios from "axios";
import slugify from "slugify";
import { toBase64 } from "../../utils/toBase64";
import PropTypes from "prop-types";

const CreateMovieModal = ({ isOpen, onClose, fetchMovies }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [duration, setDuration] = useState('');
    const [releasedDate, setReleasedDate] = useState('');
    const [description, setDescription] = useState('');
    const [trailer, setTrailer] = useState('');
    const [director, setDirector] = useState('');
    const [largeImage, setLargeImage] = useState(null);
    const [smallImage, setSmallImage] = useState(null);
    const [movieType, setselectedMovieType] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [scrollBehavior] = useState('inside')

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all");
                console.log("API Response:", response.data); // Log the response data

                const countryOptions = response.data
                    .map((country) => ({
                        value: country.cca2, // Use country code as value
                        label: country.name.common // Use country name as label
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setCountries(countryOptions);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

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

    const handleLargeImageChange = (event) => {
        setLargeImage(event.target.files[0]);
    };

    const handleSmallImageChange = (event) => {
        setSmallImage(event.target.files[0]);
    };

    const onSave = async () => {
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
            status: "Active",
        };

        try {
            await axios.post("http://localhost:8000/MovieService", data, {
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
            console.error("Error saving movie:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Tạo mới phim</ModalHeader>
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
                            onChange={handleLargeImageChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Small Image</FormLabel>
                        <Input
                            type="file"
                            onChange={handleSmallImageChange}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onSave}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

CreateMovieModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchMovies: PropTypes.func.isRequired,
}
export default CreateMovieModal;
