import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addRoom } from "reduxHilo/actions/roomAction";
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
  Select,
  Button,
  useColorModeValue,
  FormErrorMessage,
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import ModalAlert from "components/alert/modalAlert";

const AddRoomForm = ({ isOpen, onClose, fetchRooms, theaters }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    colNum: "",
    rowNum: "",
    status: "",
    theaterId: "",
  });

  const [errors, setErrors] = useState({});
  const [alertData, setAlertData] = useState({ message: "", type: "success", isVisible: false }); // State để quản lý ModalAlert

  const validate = () => {
    let validationErrors = {};

    if (!formData.name) {
      validationErrors.name = "Name is required";
    }
    if (!formData.colNum || isNaN(formData.colNum) || formData.colNum <= 0) {
      validationErrors.colNum = "Number of columns must be a positive number";
    }
    if (!formData.rowNum || isNaN(formData.rowNum) || formData.rowNum <= 0) {
      validationErrors.rowNum = "Number of rows must be a positive number";
    }
    if (!formData.status) {
      validationErrors.status = "Status is required";
    }
    if (!formData.theaterId) {
      validationErrors.theaterId = "Theater is required";
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        console.log("Form Data being sent:", formData);
        await dispatch(addRoom(formData));
        setAlertData({ message: "Room added successfully", type: "success", isVisible: true });
        onClose();
        fetchRooms();
      } catch (error) {
        setAlertData({
          message: error.response ? error.response.data : error.message,
          type: "error",
          isVisible: true,
        });
      }
    }
  };

  const closeAlert = () => {
    setAlertData({ ...alertData, isVisible: false });
  };

  const formBackgroundColor = useColorModeValue("white", "gray.700");
  const inputBackgroundColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("black", "white");

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="name" isInvalid={errors.name}>
                  <FormLabel color={textColor}>Room Name</FormLabel>
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
                <FormControl id="colNum" isInvalid={errors.colNum}>
                  <FormLabel color={textColor}>Number of Columns</FormLabel>
                  <Input
                    type="number"
                    name="colNum"
                    value={formData.colNum}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.colNum && <FormErrorMessage>{errors.colNum}</FormErrorMessage>}
                </FormControl>
                <FormControl id="rowNum" isInvalid={errors.rowNum}>
                  <FormLabel color={textColor}>Number of Rows</FormLabel>
                  <Input
                    type="number"
                    name="rowNum"
                    value={formData.rowNum}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                    _placeholder={{ color: "gray.500" }}
                  />
                  {errors.rowNum && <FormErrorMessage>{errors.rowNum}</FormErrorMessage>}
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
                <FormControl id="theaterId" isInvalid={errors.theaterId}>
                  <FormLabel color={textColor}>Theater</FormLabel>
                  <Select
                    name="theaterId"
                    value={formData.theaterId}
                    onChange={handleChange}
                    bg={inputBackgroundColor}
                    border={0}
                    color={textColor}
                  >
                    <option value="">Select Theater</option>
                    {theaters.map((theater) => (
                      <option key={theater.id} value={theater.id}>
                        {theater.name}
                      </option>
                    ))}
                  </Select>
                  {errors.theaterId && <FormErrorMessage>{errors.theaterId}</FormErrorMessage>}
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
        message={alertData.message}
        type={alertData.type}
        isVisible={alertData.isVisible}
        onClose={closeAlert}
      />
    </>
  );
};

AddRoomForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchRooms: PropTypes.func.isRequired,
  theaters: PropTypes.array.isRequired, // Thêm prop này để truyền danh sách theaters
};

export default AddRoomForm;
