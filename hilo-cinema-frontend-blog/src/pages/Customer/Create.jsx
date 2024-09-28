// createCustomer.jsx
import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, Select, Button } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";

const CreateCustomerModal = ({ isOpen, onClose, fetchCustomers }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');

    const [scrollBehavior] = useState('inside');

    const onSave = async () => {
        const token = localStorage.getItem("jwtToken");

        const data = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            gender: gender,
            birthdate: birthdate,
        };

        try {
            await axios.post("http://localhost:8000/CustomerService", data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: 'admin',
                    Role: 'admin'
                },
            });
            onClose(); // Close modal on success
            fetchCustomers();
        } catch (error) {
            console.error("Error saving customer:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Tạo mới khách hàng</ModalHeader>
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
                        <FormLabel>Email</FormLabel>
                        <Input
                            type='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Phone</FormLabel>
                        <Input
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Address</FormLabel>
                        <Textarea
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Gender</FormLabel>
                        <Select
                            placeholder="Select Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Birthdate</FormLabel>
                        <Input
                            type='date'
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
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

CreateCustomerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchCustomers: PropTypes.func.isRequired,
};

export default CreateCustomerModal;
