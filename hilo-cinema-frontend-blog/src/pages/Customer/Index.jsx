import { useState, useEffect } from "react";
import axios from "axios";
import { TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Input, Flex } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import CreateCustomerModal from "./create";
import UpdateCustomerModal from "./update";
import MyAlertDialog from "../../components/commom_component/alerts/AlertDialog";

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Changed name from `isAlertOpen` to `isAlertOpen`
    const [customerToDisable, setCustomerToDisable] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // const { isOpen: isAlertDialogOpen, onOpen: onAlertDialogOpen, onClose: onAlertDialogClose } = useDisclosure(); // Renamed

    const fetchCustomers = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await axios.get("http://localhost:8000/CustomerService", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const disableCustomer = async (customerId) => {
        const token = localStorage.getItem("jwtToken");
    
        try {
            await axios.put(`http://localhost:8000/CustomerService/${customerId}/disable`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            fetchCustomers(); 
        } catch (error) {
            console.error("Error disabling customer:", error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCreateClose = () => setCreateOpen(false);

    const handleUpdateOpen = (customer) => {
        setSelectedCustomer(customer);
        setUpdateOpen(true);
    };
    const handleUpdateClose = () => {
        setUpdateOpen(false);
        setSelectedCustomer(null);
    };

    const handleAlertOpen = (customer) => {
        setCustomerToDisable(customer);
        setIsAlertOpen(true);
    };

    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setCustomerToDisable(null);
    };

    const handleConfirmDisable = () => {
        if (customerToDisable) {
            disableCustomer(customerToDisable.id);
            handleAlertClose();
        }
    };

    const filteredCustomers = customers
        // .filter((customer) => customer.status == "Active")
        .filter((customer) => customer.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="mx-5 my-5">
            <h1 className="ml-5 mb-5 font-bold text-3xl">Quản lý khách hàng</h1>
            <div className="flex justify-between mb-5">
                <Button
                    colorScheme="blue"
                    className="ml-5"
                    onClick={handleCreateOpen}
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                    }}
                >
                    Tạo mới
                </Button>
                <Input
                    placeholder="Tìm kiếm khách hàng"
                    style={{ width: "25rem" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Tên</Th>
                            <Th>Email</Th>
                            <Th>Điện thoại</Th>
                            <Th>Địa chỉ</Th>
                            <Th>Giới tính</Th>
                            <Th>Ngày sinh</Th>
                            <Th isNumeric>Hành động</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredCustomers.map((customer) => (
                            <Tr key={customer.id}>
                                <Td>{customer.name}</Td>
                                <Td>{customer.email}</Td>
                                <Td>{customer.phone}</Td>
                                <Td>{customer.address}</Td>
                                <Td>{customer.gender}</Td>
                                <Td>{customer.birthdate}</Td>
                                <Td>
                                    <Flex justify="flex-end">
                                        <Button
                                            leftIcon={<EditIcon />}
                                            colorScheme="yellow"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleUpdateOpen(customer)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            leftIcon={<DeleteIcon />}
                                            colorScheme="red"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleAlertOpen(customer)}
                                        >
                                            Xóa
                                        </Button>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <CreateCustomerModal isOpen={isCreateOpen} onClose={handleCreateClose} fetchCustomers={fetchCustomers} />
            {selectedCustomer && (
                <UpdateCustomerModal
                    customer={selectedCustomer}
                    isOpen={isUpdateOpen}
                    onClose={handleUpdateClose}
                    fetchCustomers={fetchCustomers}
                />
            )}
            <MyAlertDialog
                title="Xóa khách hàng"
                content={`Bạn có chắc chắn muốn xóa khách hàng "${customerToDisable?.name}" không?`}
                isOpen={isAlertOpen}
                onClose={handleAlertClose}
                onConfirm={handleConfirmDisable}
            />
        </div>
    );
};

export default CustomerPage;
