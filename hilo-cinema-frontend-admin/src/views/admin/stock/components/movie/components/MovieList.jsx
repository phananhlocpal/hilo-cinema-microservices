import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { fetchMovies, hiddenMovie } from "reduxHilo/actions/movieAction";
import Card from "components/card/Card";
import Menu from "components/menu/MovieMenu";
import EditMovieForm from "./EditMovieModal";

export default function Movies(props) {
  const { columnsData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);

  const dispatch = useDispatch();
  const { loading, movies, error } = useSelector((state) => state.movie);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const country = useMemo(() => {
    const countrySet = new Set();
    movies.forEach((movie) => {
      if (movie.country) {
        countrySet.add(movie.country);
      }
    });
    return Array.from(countrySet);
  }, [movies]);

  const data = useMemo(() => {
    return movies
      .filter((movie) => movie.status !== "Inactive")
      .filter((movie) =>
        filterInput
          ? movie.country &&
            movie.country.toLowerCase().includes(filterInput.toLowerCase())
          : true
      );
  }, [movies, filterInput]);

  const handleEdit = (row) => {
    setSelectedMovie(row.original);
    onOpen();
  };

  const handleHidden = (row) => {
    setSelectedMovie(row.original);
    onAlertOpen(); // Mở modal xác nhận
  };

  const confirmHidden = () => {
    dispatch(hiddenMovie(selectedMovie.id));
    onAlertClose(); // Đóng modal sau khi ẩn phim
    dispatch(fetchMovies());
  };

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <Button
              colorScheme="blue"
              mr={2}
              onClick={() => handleEdit(row)}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleHidden(row)}
            >
              Hide
            </Button>
          </div>
        ),
      },
    ],
    [columns]
  );

  const tableInstance = useTable(
    {
      columns: columnsWithActions,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageOptions,
    gotoPage,
    state: { pageIndex },
  } = tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <>
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex px="25px" justify="space-between" mb="20px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Movies
          </Text>
          <Menu></Menu>
        </Flex>
        <Flex mb="20px" px="25px" justify="space-between" align="center">
          <Select
            placeholder="Filter by country"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            maxW="300px"
          >
            {country.map((coun) => (
              <option key={coun} value={coun}>
                {coun}
              </option>
            ))}
          </Select>
        </Flex>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text className="text-red-500">{error}</Text>
        ) : (
          <>
            <Table
              {...getTableProps()}
              className="table-auto w-full"
              variant="simple"
              mb="24px"
            >
              <Thead>
                {headerGroups.map((headerGroup, index) => (
                  <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                      <Th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="text-left px-4 py-2 border-b border-gray-200"
                        key={index}
                      >
                        <div className="flex justify-between items-center">
                          {column.render("Header")}
                        </div>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()} color={textColor}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={index}>
                      {row.cells.map((cell, index) => (
                        <Td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border-b border-gray-200"
                          key={index}
                        >
                          {cell.render("Cell")}
                        </Td>
                      ))}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            <Flex justifyContent="center" alignItems="center" mt="4">
              <div className="flex space-x-2">
                {pageOptions.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => gotoPage(pageNumber)}
                    className={`px-3 py-1 border rounded ${
                      pageIndex === pageNumber
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    }`}
                  >
                    {pageNumber + 1}
                  </button>
                ))}
              </div>
            </Flex>
          </>
        )}
      </Card>

      {/* Modal Alert */}
      <Modal isOpen={isAlertOpen} onClose={onAlertClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg" fontWeight="bold">
            Confirm Hide Movie
          </ModalHeader>
          <ModalBody>
            <Text fontSize="md">
              Are you sure you want to hide the movie "
              <Text as="span" fontWeight="bold">
                {selectedMovie?.title}
              </Text>
              "? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmHidden} mr={3}>
              Hide
            </Button>
            <Button onClick={onAlertClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedMovie && (
        <EditMovieForm
          isOpen={isOpen}
          onClose={onClose}
          movieId={selectedMovie.id}
          fetchMovies={fetchMovies}
        />
      )}
    </>
  );
}
