import { TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Flex } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

const MovieTable = ({ movies, onEdit, onDelete }) => (
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
                {movies.map((movie) => (
                    <Tr key={movie.id}>
                        <Td>{movie.title}</Td>
                        <Td>{movie.director}</Td>
                        <Td isNumeric>{movie.duration}</Td>
                        <Td>
                            <Flex justify="flex-end">
                                <Button leftIcon={<EditIcon />} colorScheme="yellow" mr={2} onClick={() => onEdit(movie)}>
                                    Sửa
                                </Button>
                                <Button leftIcon={<DeleteIcon />} colorScheme="red" variant="outline" onClick={() => onDelete(movie)}>
                                    Ẩn
                                </Button>
                            </Flex>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </TableContainer>
);

export default MovieTable;
