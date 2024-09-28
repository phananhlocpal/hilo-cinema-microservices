import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import axios from "axios";
import PropTypes from "prop-types";
import { addActor, fetchActors } from "reduxHilo/actions/actorAction"; // Action để thêm Actor
import ModalAlert from "components/alert/modalAlert";
import { fetchMovies } from "reduxHilo/actions/movieAction";

const AddProducerForm = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { movies } = useSelector((state) => state.movie);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        img: null,
        status: "",
        movieIds: [],
    });

    const [errors, setErrors] = useState({});
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);
    
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
        setErrors({ ...errors, [name]: "" }); // Clear the error for the current field
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, img: files[0] }); // Sử dụng một trường img cho hình ảnh
        setErrors({ ...errors, [name]: "" }); // Clear the error for the current field
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                const data = new FormData();
                Object.keys(formData).forEach((key) => {
                    data.append(key, formData[key]);
                });

                await dispatch(addActor(data)); // Sử dụng FormData để gửi yêu cầu thêm Actor
                setAlertMessage("Actor added successfully!");
                setIsAlertVisible(true); // Hiển thị thông báo thành công
                onClose(); // Đóng modal sau khi thêm thành công
                dispatch(fetchActors()); // Làm mới danh sách diễn viên sau khi thêm
            } catch (error) {
                console.error("Error saving actor:", error.response ? error.response.data : error.message);
            }
        }
    };

    const formBackgroundColor = useColorModeValue("white", "gray.700");
    const inputBackgroundColor = useColorModeValue("gray.100", "gray.600");
    const textColor = useColorModeValue("black", "white");

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Actor</ModalHeader>
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

                                {/* Input cho hình ảnh */}
                                <FormControl id="img" isInvalid={errors.img}>
                                    <FormLabel color={textColor}>Image</FormLabel>
                                    <Input
                                        type="file"
                                        name="img"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    />
                                    {errors.img && <FormErrorMessage>{errors.img}</FormErrorMessage>}
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
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Select>
                                    {errors.status && <FormErrorMessage>{errors.status}</FormErrorMessage>}
                                </FormControl>

                                {/* Danh sách phim mà Actor tham gia */}
                                <FormControl id="movieIds">
                                    <FormLabel color={textColor}>Movies</FormLabel>
                                    <Select
                                        name="movieIds"
                                        value={formData.movieIds}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    >
                                       {movies.map((movie) => (
                                            <option key={movie.id} value={movie.id}>
                                                {movie.title}
                                            </option>
                                        ))}
                                    </Select>
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

            {/* Hiển thị ModalAlert sau khi thêm thành công */}
            <ModalAlert
                isVisible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
                message={alertMessage}
            />
        </>
    );
};

AddProducerForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddProducerForm;
