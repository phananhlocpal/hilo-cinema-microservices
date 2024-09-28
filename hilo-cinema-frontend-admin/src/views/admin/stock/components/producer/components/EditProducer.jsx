import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActorById, editActor } from "reduxHilo/actions/actorAction";
import { fetchMovies } from "reduxHilo/actions/movieAction";
import Select from 'react-select';
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
  Button,
  useColorModeValue,
  FormErrorMessage,
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import ModalAlert from "components/alert/modalAlert";

const EditProducerForm = ({ isOpen, onClose, actorId, fetchActors }) => {
  const dispatch = useDispatch();
  const actor = useSelector((state) =>
    state.actor.actors.find((a) => a.id === actorId)
  );
  const movies = useSelector((state) => state.movie.movies); // Lấy danh sách phim từ Redux store

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    img: null,
    movieIds: [],
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    if (actor) {
      setFormData({
        ...actor,
        movieIds: actor.movies.map((movie) => movie.id), // Map từ đối tượng phim thành danh sách id phim
      });
    } else {
      dispatch(fetchActorById(actorId));
    }

    // Fetch danh sách phim nếu chưa có trong store
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [actor, actorId, dispatch, movies.length]);

  const validate = () => {
    let validationErrors = {};

    if (!formData.name) {
      validationErrors.name = "Name is required";
    }
    if (!formData.status) {
      validationErrors.status = "Status is required";
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
    }
  };

  const handleMovieChange = (selectedOptions) => {
    setFormData({ ...formData, movieIds: selectedOptions.map(option => option.value) });
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
          if (Array.isArray(formData[key])) {
            formData[key].forEach((value) => {
              formDataToSend.append(`${key}[]`, value);
            });
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Kiểm tra xem FormData có đúng hay không
        for (var pair of formDataToSend.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        await dispatch(editActor(actorId, formDataToSend));  // Gửi FormData

        setAlertMessage("Actor updated successfully");
        setAlertType("success");
        setShowAlert(true);

        onClose(); // Đóng modal sau khi cập nhật thành công
        dispatch(fetchActors());
      } catch (error) {
        console.error("Error updating actor:", error.response ? error.response.data : error.message);
        setAlertMessage("Failed to update the actor. Please try again.");
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

  const movieOptions = movies.map(movie => ({
    value: movie.id,
    label: movie.title
  }));

  // Define the status options
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" }
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Actor</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="name" isInvalid={errors.name}>
                  <FormLabel color={textColor}>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
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
                <FormControl id="status" isInvalid={errors.status}>
                  <FormLabel color={textColor}>Status</FormLabel>
                  <Select
                    name="status"
                    value={statusOptions.find(option => option.value === formData.status)}
                    onChange={(selectedOption) => handleChange({ target: { name: 'status', value: selectedOption.value } })}
                    options={statusOptions}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  />
                  {errors.status && <FormErrorMessage>{errors.status}</FormErrorMessage>}
                </FormControl>
                <FormControl id="img">
                  <FormLabel color={textColor}>Image</FormLabel>
                  <Input
                    type="file"
                    name="img"
                    accept="image/*"
                    onChange={handleFileChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  />
                </FormControl>
                <FormControl id="movieIds">
                  <FormLabel color={textColor}>Movies</FormLabel>
                  <Select
                    isMulti
                    options={movieOptions}
                    value={movieOptions.filter(option => formData.movieIds.includes(option.value))}
                    onChange={handleMovieChange}
                    closeMenuOnSelect={false}
                    placeholder="Select movies..."
                    styles={{
                      option: (provided) => ({
                        ...provided,
                        color: textColor,
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: inputBackgroundColor,
                      }),
                    }}
                  />
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

EditProducerForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actorId: PropTypes.number.isRequired,
};

export default EditProducerForm;
