import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Select, Button } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";

const UpdateCustomerModal = ({ customer, isOpen, onClose, fetchCustomers }) => {
    const [name, setName] = useState(customer.name);
    const [email, setEmail] = useState(customer.email);
    const [phone, setPhone] = useState(customer.phone);
    const [address, setAddress] = useState(customer.address);
    const [status, setStatus] = useState(customer.status);
    const [scrollBehavior] = useState('inside');

    useEffect(() => {
        // Reset form state when the modal opens
        if (customer) {
            setName(customer.name);
            setEmail(customer.email);
            setPhone(customer.phone);
            setAddress(customer.address);
            setStatus(customer.status);
        }
    }, [customer, isOpen]);

    const onUpdate = async () => {
        const token = localStorage.getItem("jwtToken");

        const data = {
            id: customer.id, // Use the customer ID
            name: customer.name,
            email: customer.email,
            address: customer.address,
            phone: customer.phone,
            gender: customer.gender, 
            birthdate: customer.birthdate, // Assuming birthdate is part of customer object
            password: customer.password, // Assuming password is part of customer object
            created_date: customer.created_date, // Assuming created_date is part of customer object
            status: status || null,
        };

        try {
            await axios.put(`http://localhost:8000/CustomerService/${customer.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: 'admin',
                },
            });
            onClose(); // Close modal on success
            fetchCustomers();
        } catch (error) {
            console.error("Error updating customer:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cập nhật khách hàng</ModalHeader>
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
                            type='tel'
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Address</FormLabel>
                        <Input
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
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

UpdateCustomerModal.propTypes = {
    customer: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchCustomers: PropTypes.func.isRequired
};

export default UpdateCustomerModal;
