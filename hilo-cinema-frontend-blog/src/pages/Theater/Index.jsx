import { useState, useEffect } from "react";
import axios from "axios";
import { TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Input, Flex } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import CreateTheaterModal from "./Create";
import UpdateTheaterModal from "./Update";
import MyAlertDialog from "../../components/commom_component/alerts/AlertDialog";

const TheaterPage = () => {
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Changed name from `isAlertOpen` to `isAlertOpen`
    const [theaterToDisable, setTheaterToDisable] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // const { isOpen: isAlertDialogOpen, onOpen: onAlertDialogOpen, onClose: onAlertDialogClose } = useDisclosure(); // Renamed

    const fetchTheaters = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await axios.get("http://localhost:8000/TheaterService", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            setTheaters(response.data);
        } catch (error) {
            console.error("Error fetching theaters:", error);
        }
    };

    const disableTheater = async (theaterId) => {
        const token = localStorage.getItem("jwtToken");
    
        try {
            await axios.put(`http://localhost:8000/TheaterService/${theaterId}/disable`, null, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            fetchTheaters(); 
        } catch (error) {
            console.error("Error disabling theater:", error);
        }
    };

    useEffect(() => {
        fetchTheaters();
    }, []);

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCreateClose = () => setCreateOpen(false);

    const handleUpdateOpen = (theater) => {
        setSelectedTheater(theater);
        setUpdateOpen(true);
    };
    const handleUpdateClose = () => {
        setUpdateOpen(false);
        setSelectedTheater(null);
    };

    const handleAlertOpen = (theater) => {
        setTheaterToDisable(theater);
        setIsAlertOpen(true);
    };

    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setTheaterToDisable(null);
    };

    const handleConfirmDisable = () => {
        if (theaterToDisable) {
            disableTheater(theaterToDisable.id);
            handleAlertClose();
        }
    };

    const filteredTheaters = theaters
        .filter((theater) => theater.status == "Active")
        .filter((theater) => theater.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="mx-5 my-5">
            <h1 className="ml-5 mb-5 font-bold text-3xl">Quản lý rạp chiếu</h1>
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
                    placeholder="Tìm kiếm rạp chiếu"
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
                            <Th>Thành phố</Th>
                            <Th>Hotline</Th>
                            <Th isNumeric>Hành động</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredTheaters.map((theater) => (
                            <Tr key={theater.id}>
                                <Td>{theater.name}</Td>
                                <Td>{theater.city}</Td>
                                <Td>{theater.hotline}</Td>
                                <Td>
                                    <Flex justify="flex-end">
                                        <Button
                                            leftIcon={<EditIcon />}
                                            colorScheme="yellow"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleUpdateOpen(theater)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            leftIcon={<DeleteIcon />}
                                            colorScheme="red"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleAlertOpen(theater)}
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
            <CreateTheaterModal isOpen={isCreateOpen} onClose={handleCreateClose} fetchTheaters={fetchTheaters} />
            {selectedTheater && (
                <UpdateTheaterModal
                    theater={selectedTheater}
                    isOpen={isUpdateOpen}
                    onClose={handleUpdateClose}
                    fetchTheaters={fetchTheaters}
                />
            )}
            <MyAlertDialog
                title="Xóa nhân viên"
                content={`Bạn có chắc chắn muốn xóa rạp chiếu "${theaterToDisable?.name}" không?`}
                isOpen={isAlertOpen}
                onClose={handleAlertClose}
                onConfirm={handleConfirmDisable}
            />
        </div>
    );
};

export default TheaterPage;
