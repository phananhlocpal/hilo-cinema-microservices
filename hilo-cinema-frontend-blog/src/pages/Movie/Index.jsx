import { useState, useEffect } from "react";
import axios from "axios";
import { TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Input, Flex, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon, EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import CreateMovieModal from "./Create";
import UpdateMovieModal from "./Update";
import MyAlertDialog from "../../components/commom_component/alerts/AlertDialog";
import TrailerModal from "./WatchTrailer";

const MoviePage = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [movieToDisable, setMovieToDisable] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [trailerUrl, setTrailerUrl] = useState(null);

    const { isOpen: isTrailerOpen, onOpen: onTrailerOpen, onClose: onTrailerClose } = useDisclosure();

    const fetchMovies = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await axios.get("http://localhost:8000/MovieService", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            setMovies(response.data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const disableMovie = async (movieId) => {
        const token = localStorage.getItem("jwtToken");

        try {
            await axios.patch(`http://localhost:8000/MovieService/${movieId}/disable`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            fetchMovies(); 
        } catch (error) {
            console.error("Error disabling movie:", error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCreateClose = () => setCreateOpen(false);

    const handleUpdateOpen = (movie) => {
        setSelectedMovie(movie);
        setUpdateOpen(true);
    };
    const handleUpdateClose = () => {
        setUpdateOpen(false);
        setSelectedMovie(null);
    };

    const handleAlertOpen = (movie) => {
        setMovieToDisable(movie);
        setIsAlertOpen(true);
    };

    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setMovieToDisable(null);
    };

    const handleConfirmDisable = () => {
        if (movieToDisable) {
            disableMovie(movieToDisable.id);
            handleAlertClose();
        }
    };

    const handleWatchTrailer = (movie) => {
        if (movie.trailer) {
            setTrailerUrl(movie.trailer);
            onTrailerOpen();
        } else {
            alert("No trailer available for this movie.");
        }
    };

    const filteredMovies = movies
            .filter(movie => movie.status === 'Active') 
            .filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mx-5 my-5">
            <h1 className="ml-5 mb-5 font-bold text-3xl">Quản lý phim</h1>
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
                    placeholder="Tìm kiếm phim"
                    style={{ width: "25rem" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Tiêu đề</Th>
                            <Th>Đạo diễn</Th>
                            <Th isNumeric>Thời lượng</Th>
                            <Th isNumeric>Hành động</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredMovies.map((movie) => (
                            <Tr key={movie.id}>
                                <Td>{movie.title}</Td>
                                <Td>{movie.director}</Td>
                                <Td isNumeric>{movie.duration}</Td>
                                <Td>
                                    <Flex justify="flex-end">
                                        <Button
                                            leftIcon={<EditIcon />}
                                            colorScheme="yellow"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleUpdateOpen(movie)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            leftIcon={<DeleteIcon />}
                                            colorScheme="red"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleAlertOpen(movie)}
                                        >
                                            Ẩn
                                        </Button>
                                        <Button
                                            leftIcon={<ExternalLinkIcon />}
                                            colorScheme="teal"
                                            variant="solid"
                                            onClick={() => handleWatchTrailer(movie)}
                                        >
                                            Xem Trailer
                                        </Button>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <CreateMovieModal isOpen={isCreateOpen} onClose={handleCreateClose} fetchMovies={fetchMovies} />
            {selectedMovie && (
                <UpdateMovieModal
                    movie={selectedMovie}
                    isOpen={isUpdateOpen}
                    onClose={handleUpdateClose}
                    fetchMovies={fetchMovies}
                />
            )}
            <MyAlertDialog
                title="Ẩn phim"
                content={`Bạn có chắc chắn muốn ẩn phim "${movieToDisable?.title}" không?`}
                isOpen={isAlertOpen}
                onClose={handleAlertClose}
                onConfirm={handleConfirmDisable}
            />
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={onTrailerClose}
                trailerUrl={trailerUrl}
            />
        </div>
    );
};

export default MoviePage;
