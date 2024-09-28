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
import Card from "components/card/Card";
import ActorMenu from "components/menu/ActorMenu";
import EditActorForm from "./EditProducer";
import { fetchActors, fetchActorsByMovieId, hiddenActor } from "reduxHilo/actions/actorAction";
import { fetchMovies } from "reduxHilo/actions/movieAction";

export default function Producers(props) {
  const { columnsData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);

  const dispatch = useDispatch();
  const { loading, actors, error } = useSelector((state) => state.actor);
  const { movies } = useSelector((state) => state.movie);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const [selectedActor, setSelectedActor] = useState(null);
  const [filterInput, setFilterInput] = useState(""); // This will store the selected movieId

  // Fetch all movies and actors when the component mounts
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchActors());
  }, [dispatch]);

  // Fetch actors based on the selected movieId
  useEffect(() => {
    if (filterInput) {
      dispatch(fetchActorsByMovieId(filterInput));
    } else {
      dispatch(fetchActors());
    }
  }, [dispatch, filterInput]);

  const titleMovie = useMemo(() => {
    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
    }));
  }, [movies]);

  const data = useMemo(() => {
    return actors.filter((actor) => actor.status !== "Inactive");
  }, [actors]);

  const handleEdit = (row) => {
    setSelectedActor(row.original);
    onOpen();
  };

  const handleHidden = (row) => {
    const actor = row.original;
    console.log('Selected Actor ID:', actor.id);  // This should show the correct ID
    setSelectedActor(actor);
    onAlertOpen();
  };

  const confirmHidden = () => {
    if (selectedActor) {
      console.log('Hiding Actor ID:', selectedActor.id);  // Ensure the correct ID is used
      dispatch(hiddenActor(selectedActor.id));
      onAlertClose();
      dispatch(fetchActors());
    }
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
            Actors
          </Text>
          <ActorMenu />
        </Flex>
        <Flex mb="20px" px="25px" justify="space-between" align="center">
          <Select
            placeholder="Filter by movie"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            maxW="300px"
          >
            {titleMovie.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
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
            Confirm Hide Actor
          </ModalHeader>
          <ModalBody>
            <Text fontSize="md">
              Are you sure you want to hide the actor "
              <Text as="span" fontWeight="bold">
                {selectedActor?.name}
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

      {selectedActor && (
        <EditActorForm
          isOpen={isOpen}
          onClose={onClose}
          actorId={selectedActor.id}
          fetchActors={fetchActors}
        />
      )}
    </>
  );
}
