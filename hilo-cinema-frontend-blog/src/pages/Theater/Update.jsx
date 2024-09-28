import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Select, Button } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";

const UpdateTheaterModal = ({ theater, isOpen, onClose, fetchTheaters }) => {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [hotline, setHotline] = useState('');
    const [status, setStatus] = useState('');

    const [scrollBehavior] = useState('inside');

    useEffect(() => {
        if (theater) {
            setName(theater.name);
            setCity(theater.city);
            setDetailAddress(theater.detailAddress);
            setHotline(theater.hotline);
            setStatus(theater.status);
        }
    }, [theater, isOpen]);

    const onUpdate = async () => {
        const token = localStorage.getItem("jwtToken");

        const data = {
            id: theater.id,
            name: name,
            city: city,
            detailAddress: detailAddress,
            hotline: hotline,
            status: status,
        };

        try {
            await axios.put(`http://localhost:8000/TheaterService/${theater.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: 'admin',
                },
            });
            onClose(); // Close modal on success
            fetchTheaters();
        } catch (error) {
            console.error("Error updating theater:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cập nhật rạp chiếu</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Thành phố</FormLabel>
                        <Input
                            placeholder="Thành phố"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Địa chỉ</FormLabel>
                        <Input
                            placeholder="Địa chỉ"
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Hotline</FormLabel>
                        <Input
                            placeholder="Hotline"
                            value={hotline}
                            onChange={(e) => setHotline(e.target.value)}
                        />
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
                    <Button colorScheme="blue" mr={3} onClick={onUpdate}>
                        Update
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

UpdateTheaterModal.propTypes = {
    theater: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchTheaters: PropTypes.func.isRequired
};

export default UpdateTheaterModal;
