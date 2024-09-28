import { useState, useEffect } from "react";
import axios from "axios";
import { TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Input, Spinner } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

const InvoicePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [selectedStartDate, setSelectedStartDate] = useState();
    const [selectedEndDate, setSelectedEndDate] = useState();
    const [searchQuery, setSearchQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const getInvoiceById = async (invoiceId) => {
        
        try {
            const response = await axios.get(`https://localhost:5004/api/Invoice/GetInvoiceById/${invoiceId}`);
            console.log(response.data);
            setSelectedInvoice(response.data);

        } catch (error) {
            console.error('Error fetching invoice:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/InvoiceService`);
                console.log(response.data);
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleOpenModal = (invoice) => {
        getInvoiceById(invoice.id);
        setIsInvoiceModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsInvoiceModalOpen(false);
        setSelectedInvoice(null);
    };

    const filteredInvoices = invoices
        .filter((invoice) => !selectedStartDate || invoice.date >= selectedStartDate)
        .filter((invoice) => !selectedEndDate || invoice.date <= selectedEndDate)
        .filter((invoice) => !searchQuery || invoice.customer.phoneNumber.includes(searchQuery));

    return (
        <div className="mx-5 my-5">
            <div>
                <h1 className="ml-5 mb-5 font-bold text-3xl">Quản lý hóa đơn</h1>
                <div className="flex justify-between mb-5">
                    <Input
                        placeholder="Tìm kiếm khách hàng"
                        style={{ width: "25rem" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-row">
                    <div >
                        <label className="text-gray-600 text-[.9rem]">Ngày bắt đầu</label>
                        <Input type="date" value={selectedStartDate}
                            onChange={(e) => setSelectedStartDate(e.target.value)} />
                    </div>
                    <div className="ml-5">
                        <label className="text-gray-600 text-[.9rem]">Ngày kết thúc</label>
                        <Input type="date" value={selectedEndDate}
                            onChange={(e) => setSelectedEndDate(e.target.value)} />
                    </div>
                </div>
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Mã hóa đơn</Th>
                                <Th>Ngày</Th>
                                <Th>Tên khách hàng</Th>
                                <Th>Tên nhân viên</Th>
                                <Th>Phương thức thanh toán</Th>
                                <Th>Tổng tiền</Th>
                                <Th>Trạng thái</Th>
                                <Th>Thao tác</Th>
                            </Tr>
                        </Thead>
                        
                            {loading ? (
                                <div className="w-full h-[100px] flex jutify-center items-center">
                                    <Spinner size="xl" color="blue.500" />

                                </div>
                            ) : (
                                <Tbody>
                                {filteredInvoices.map((invoice, index) => (
                                    <Tr key={index}>
                                        <Td>{invoice.id}</Td>
                                        <Td>{invoice.createdDate}</Td>
                                        <Td>{invoice.customer.name}</Td>
                                        <Td>{invoice.employee.name}</Td>
                                        <Td>{invoice.paymentMethod}</Td>
                                        <Td>{invoice.total}</Td>
                                        <Td>{invoice.status}</Td>
                                        <Td>
                                            <Button
                                                leftIcon={<ViewIcon />}
                                                colorScheme="red"
                                                variant="solid"
                                                mr={2}
                                                onClick={() => handleOpenModal(invoice)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                                </Tbody>
                            )}
                    </Table>
                </TableContainer>
            </div>
            {selectedInvoice && (
                <InvoiceDetail
                    data={selectedInvoice}
                    isInvoiceModalOpen={isInvoiceModalOpen}
                    closeModal={handleCloseModal}
                />
            )}  
        </div>
    );
};

const InvoiceDetail = ({ data, isInvoiceModalOpen, closeModal }) => {

    const movieDetail = data.movie;
    const theaterDetail = {
        theaterId: data.theaterId,
        roomId: data.roomId,
        roomName: data.roomName,
        theaterName: data.theaterName
    }
    const selectedSeats = data.seats;
    const selectedFood = data.foods;

    return (
        <Modal open={isInvoiceModalOpen} onClose={closeModal} center showCloseIcon={false}
            styles={{
                modal: {
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.4)',
                },
            }}>
            <div className="bg-white rounded-lg p-6">
                <div className="booking__summary md:mb-4">
                    <div className="h-[6px] bg-primary rounded-t-lg"></div>
                    <div className="bg-white p-4 grid grid-cols-3 xl:gap-2 items-center">
                        <div className="row-span-2 md:row-span-1 xl:row-span-2 block md:hidden xl:block">
                            <img alt={movieDetail.title} loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className="xl:w-full xl:h-full md:w-[80px] md:h-[120px] w-[90px] h-[110px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={`data:image/jpeg;base64,${movieDetail.imgSmall}`} style={{ backgroundColor: "transparent" }} />
                        </div>
                        <div className="row-span-2 md:row-span-1 xl:row-span-2 hidden md:block xl:hidden">
                            <img alt={movieDetail.title} loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className=" w-[220px] h-[150px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={`data:image/jpeg;base64,${movieDetail.imgSmall}`} style={{ color: "transparent" }} />
                        </div>
                        <div className="flex-1 col-span-2 md:col-span-1 row-span-1 xl:col-span-2">
                            <h3 className="text-sm xl:text-base font-bold xl:mb-2 ">
                                {movieDetail.title}
                            </h3>
                            <p className="text-sm inline-block">{movieDetail.type}</p>
                            {/* <span> - </span>
                            <div className="xl:mt-2 ml-2 xl:ml-0 inline-block">
                                <span className="inline-flex items-center justify-center w-[38px] h-7 bg-primary rounded text-sm text-center text-white font-bold not-italic">
                                    T16
                                </span>
                            </div> */}
                        </div>
                        <div className="col-span-2 md:col-span-1 xl:col-span-3">
                            <div>
                                <div className="xl:mt-4 text-sm xl:text-base">
                                    <strong>{theaterDetail.theaterName}</strong>
                                    <span> - </span>
                                    <span className="text-sm xl:text-base">{theaterDetail.roomName}</span>
                                </div>
                                <div className="xl:mt-2 text-sm xl:text-base">
                                    <span>Suất: </span>
                                    <strong>{data.time}</strong>
                                    <span> - </span>
                                    <span className="capitalize text-sm">
                                        <strong> {data.date}</strong>
                                    </span>
                                </div>
                            </div>
                            <div className="xl:block hidden">
                                <div
                                    className={`my-4 border-t border-black border-dashed ${selectedSeats.length === 0 ? 'hidden' : 'xl:block'}`}
                                >
                                </div>
                                {selectedSeats.map((seat, index) => (
                                    <div key={index} className="flex justify-between text-sm mt-2">
                                        <div>
                                            <strong>1x </strong>
                                            <span>{seat.type === "Normal" ? 'Ghế đơn' : 'Ghế đôi'}</span>
                                            <div>
                                                <span>Ghế: </span>
                                                <strong>{seat.name}</strong>
                                            </div>
                                        </div>
                                        <span className="inline-block font-bold ">75.000&nbsp;₫</span>
                                    </div>
                                ))}
                            </div>
                            <div className="xl:block hidden">
                                <div
                                    className={`my-4 border-t border-black border-dashed ${selectedFood.length === 0 ? 'hidden' : 'xl:block'}`}
                                >
                                </div>
                                {
                                    selectedFood.map((food, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>
                                                <strong>{food.quantity}x </strong>
                                                <span>{food.name}</span>
                                            </span>
                                            <span className="inline-block font-bold ">{food.quantity * food.price}&nbsp;₫</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="my-4 border-t border-black border-dashed xl:block hidden"></div>
                        </div>
                        <div className="xl:flex hidden justify-between col-span-3">
                            <strong className="text-base">Tổng cộng</strong>
                            <span className="inline-block font-bold text-primary">
                                {data.total.toLocaleString()}&nbsp;₫
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

InvoiceDetail.propTypes = {
    data: PropTypes.object,
    isInvoiceModalOpen: PropTypes.bool,
    closeModal: PropTypes.func,
};

export default InvoicePage;
