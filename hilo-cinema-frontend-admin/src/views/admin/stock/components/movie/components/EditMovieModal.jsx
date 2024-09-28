import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, editMovie } from "reduxHilo/actions/movieAction";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useColorModeValue,
  FormErrorMessage,
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import axios from "axios";
import ModalAlert from "components/alert/modalAlert";

const EditMovieForm = ({ isOpen, onClose, movieId, fetchMovies }) => {
  const dispatch = useDispatch();
  const movie = useSelector((state) =>
    state.movie.movies.find((m) => m.id === movieId)
  );

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    releasedDate: "",
    rate: "",
    country: "",
    director: "",
    description: "",
    movieType: "",
    trailer: "",
    status: "",
    movieUrl: "",  // Thêm trường movieUrl
    imgSmall: null,  // Thêm trường imgSmall cho file mới
    imgLarge: null,  // Thêm trường imgLarge cho file mới
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [currentImgSmall, setCurrentImgSmall] = useState(null);
  const [currentImgLarge, setCurrentImgLarge] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  useEffect(() => {
    if (movie) {
      setFormData({ ...movie });
      if (movie.imgSmallBase64) {
        setCurrentImgSmall(`data:image/jpeg;base64,${movie.imgSmallBase64}`);
      }
      if (movie.imgLargeBase64) {
        setCurrentImgLarge(`data:image/jpeg;base64,${movie.imgLargeBase64}`);
      }
    } else {
      dispatch(fetchMovieDetails(movieId));
    }
  }, [movie, movieId, dispatch]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");

        const countryOptions = response.data
          .map((country) => ({
            value: country.cca2,
            label: country.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(countryOptions);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const validate = () => {
    let validationErrors = {};

    if (!formData.title) {
      validationErrors.title = "Title is required";
    }
    if (!formData.duration || isNaN(formData.duration) || formData.duration <= 0) {
      validationErrors.duration = "Duration must be a positive number";
    }
    if (!formData.releasedDate) {
      validationErrors.releasedDate = "Released date is required";
    }
    if (!formData.rate || isNaN(formData.rate) || formData.rate < 0 || formData.rate > 10) {
      validationErrors.rate = "Rate must be between 0 and 10";
    }
    if (!formData.country) {
      validationErrors.country = "Country is required";
    }
    if (!formData.director) {
      validationErrors.director = "Director is required";
    }
    if (!formData.description) {
      validationErrors.description = "Description is required";
    }
    if (!formData.movieType) {
      validationErrors.movieType = "Movie type is required";
    }
    if (!formData.trailer) {
      validationErrors.trailer = "Trailer URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.trailer)) {
      validationErrors.trailer = "Trailer URL must be a valid URL";
    }
    if (!formData.status) {
      validationErrors.status = "Status is required";
    }
    if (!formData.movieUrl) {
      validationErrors.movieUrl = "Movie URL is required";
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
      if (name === "imgSmall") {
        setCurrentImgSmall(URL.createObjectURL(files[0]));
      } else if (name === "imgLarge") {
        setCurrentImgLarge(URL.createObjectURL(files[0]));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        });

        await dispatch(editMovie(movieId, formDataToSend));  // Sử dụng FormData để gửi dữ liệu

        setAlertMessage("Movie updated successfully");
        setAlertType("success");
        setShowAlert(true);

        onClose(); // Đóng modal sau khi cập nhật thành công
        dispatch(fetchMovies()); // Làm mới danh sách phim
      } catch (error) {
        console.error("Error updating movie:", error.response ? error.response.data : error.message);
        setAlertMessage("Failed to update the movie. Please try again.");
        setAlertType("error");
        setShowAlert(true);
      }
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const formBackgroundColor = useColorModeValue("white", "gray.700");
  const inputBackgroundColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("black", "white");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Movie</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="title" isInvalid={errors.title}>
                  <FormLabel color={textColor}>Title</FormLabel>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
                </FormControl>
                <FormControl id="duration" isInvalid={errors.duration}>
                  <FormLabel color={textColor}>Duration (minutes)</FormLabel>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.duration && <FormErrorMessage>{errors.duration}</FormErrorMessage>}
                </FormControl>
                <FormControl id="releasedDate" isInvalid={errors.releasedDate}>
                  <FormLabel color={textColor}>Released Date</FormLabel>
                  <Input
                    type="date"
                    name="releasedDate"
                    value={formData.releasedDate}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.releasedDate && <FormErrorMessage>{errors.releasedDate}</FormErrorMessage>}
                </FormControl>
                <FormControl id="rate" isInvalid={errors.rate}>
                  <FormLabel color={textColor}>Rate</FormLabel>
                  <Input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="10"
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.rate && <FormErrorMessage>{errors.rate}</FormErrorMessage>}
                </FormControl>
                <FormControl id="country" isInvalid={errors.country}>
                  <FormLabel color={textColor}>Country</FormLabel>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </Select>
                  {errors.country && <FormErrorMessage>{errors.country}</FormErrorMessage>}
                </FormControl>
                <FormControl id="director" isInvalid={errors.director}>
                  <FormLabel color={textColor}>Director</FormLabel>
                  <Input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.director && <FormErrorMessage>{errors.director}</FormErrorMessage>}
                </FormControl>
                <FormControl id="description" isInvalid={errors.description}>
                  <FormLabel color={textColor}>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
                </FormControl>
                <FormControl id="movieType" isInvalid={errors.movieType}>
                  <FormLabel color={textColor}>Movie Type</FormLabel>
                  <Select
                    name="movieType"
                    value={formData.movieType}
                    onChange={handleChange}
                  >
                    <option value="action">Action</option>
                    <option value="adventure">Adventure</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Horror</option>
                    <option value="romance">Romance</option>
                    <option value="sci-fi">Science Fiction (Sci-Fi)</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="thriller">Thriller</option>
                    <option value="mystery">Mystery</option>
                    <option value="documentary">Documentary</option>
                    <option value="animation">Animation</option>
                    <option value="musical">Musical</option>
                    <option value="crime">Crime</option>
                    <option value="biography">Biography (Biopic)</option>
                    <option value="historical">Historical</option>
                    <option value="war">War</option>
                    <option value="western">Western</option>
                    <option value="family">Family</option>
                    <option value="sport">Sport</option>
                    <option value="superhero">Superhero</option>
                  </Select>

                  {errors.movieType && <FormErrorMessage>{errors.movieType}</FormErrorMessage>}
                </FormControl>
                <FormControl id="trailer" isInvalid={errors.trailer}>
                  <FormLabel color={textColor}>Trailer URL</FormLabel>
                  <Input
                    type="url"
                    name="trailer"
                    value={formData.trailer}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.trailer && <FormErrorMessage>{errors.trailer}</FormErrorMessage>}
                </FormControl>
                <FormControl id="movieUrl" isInvalid={errors.movieUrl}>
                  <FormLabel color={textColor}>Movie URL</FormLabel>
                  <Input
                    type="text"
                    name="movieUrl"
                    value={formData.movieUrl}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.movieUrl && <FormErrorMessage>{errors.movieUrl}</FormErrorMessage>}
                </FormControl>
                <FormControl id="imgSmall">
                  <FormLabel color={textColor}>Small Image</FormLabel>
                  {currentImgSmall && <img src={currentImgSmall} alt="Current Small Image" style={{ marginBottom: '10px', maxWidth: '200px' }} />}
                  <Input
                    type="file"
                    name="imgSmall"
                    accept="image/*"
                    onChange={handleFileChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  />
                </FormControl>
                <FormControl id="imgLarge">
                  <FormLabel color={textColor}>Large Image</FormLabel>
                  {currentImgLarge && <img src={currentImgLarge} alt="Current Large Image" style={{ marginBottom: '10px', maxWidth: '200px' }} />}
                  <Input
                    type="file"
                    name="imgLarge"
                    accept="image/*"
                    onChange={handleFileChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  />
                </FormControl>
                <FormControl id="status" isInvalid={errors.status}>
                  <FormLabel color={textColor}>Status</FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                  {errors.status && <FormErrorMessage>{errors.status}</FormErrorMessage>}
                </FormControl>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ModalAlert
        isVisible={showAlert}
        message={alertMessage}
        type={alertType}
        onClose={handleCloseAlert}
      />
    </>
  );
};


EditMovieForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movieId: PropTypes.string.isRequired,
  fetchMovies: PropTypes.func.isRequired,
};

export default EditMovieForm;
