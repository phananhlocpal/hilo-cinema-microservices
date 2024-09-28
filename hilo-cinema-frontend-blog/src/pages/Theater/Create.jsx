// createTheater.jsx
import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, Button } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";

const CreateTheaterModal = ({ isOpen, onClose, fetchTheaters }) => {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [hotline, setHotline] = useState('');

    const [scrollBehavior] = useState('inside');

    const onSave = async () => {
        const token = localStorage.getItem("jwtToken");

        const data = {
            name: name,
            city: city,
            detailAddress: detailAddress,
            hotline: hotline,
            status: "Active",
        };

        try {
            await axios.post("http://localhost:8000/TheaterService", data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: 'admin',
                },
            });
            onClose();
            fetchTheaters();
        } catch (error) {
            console.error("Error saving theater:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Tạo mới rạp chiếu</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="Tên rạp chiếu"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>City</FormLabel>
                        <Input
                            placeholder="Thành phố"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Địa chỉ</FormLabel>
                        <Input
                            placeholder="Địa chỉ chi tiết"
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Hotline</FormLabel>
                        <Textarea
                            placeholder="Hotline"
                            value={hotline}
                            onChange={(e) => setHotline(e.target.value)}
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

CreateTheaterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchTheaters: PropTypes.func.isRequired,
};

export default CreateTheaterModal;
