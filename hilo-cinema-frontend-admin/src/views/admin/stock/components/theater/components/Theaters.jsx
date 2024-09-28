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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { fetchTheaters, hiddenTheater } from "reduxHilo/actions/theaterAction"; // Updated imports
import Card from "components/card/Card";
import EditTheater from "./EditTheaterModal";
import TheaterMenu from "components/menu/TheaterMenu";

export default function Theaters(props) {
  const { columnsData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);

  const dispatch = useDispatch();
  const { loading, theaters, error } = useSelector((state) => state.theater); // Updated state to theaters

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTheater, setSelectedTheater] = useState(null); // Updated state to theaters
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    dispatch(fetchTheaters()); // Updated function to fetch theaters
  }, [dispatch]);

  const city = useMemo(() => {
    const citySet = new Set();
    theaters.forEach((theater) => { // Updated from movies to theaters
      if (theater.city) {
        citySet.add(theater.city);
      }
    });
    return Array.from(citySet);
  }, [theaters]);

  const data = useMemo(() => {
    return theaters
      .filter((theater) => theater.status !== "Inactive") // Updated from movies to theaters
      .filter((theater) =>
        filterInput
          ? theater.city &&
            theater.city.toLowerCase().includes(filterInput.toLowerCase())
          : true
      );
  }, [theaters, filterInput]); // Updated dependencies to theaters

  const handleEdit = (row) => {
    setSelectedTheater(row.original); // Updated from movie to theater
    onOpen();
  };

  const handleHidden = (row) => {
    dispatch(hiddenTheater(row.original.id)); // Updated function to hide theater
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
              className="mr-2 text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(row)}
            >
              Edit
            </Button>
            <Button
              className="text-red-500 hover:text-red-700"
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
            Theaters
          </Text>
          <TheaterMenu></TheaterMenu>
        </Flex>
        <Flex mb="20px" px="25px" justify="space-between" align="center">
          <Select
            placeholder="Filter by city"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            maxW="300px"
          >
            {city.map((coun) => (
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

      {selectedTheater && (
        <EditTheater
          isOpen={isOpen}
          onClose={onClose}
          theaterId={selectedTheater.id} // Updated from movieId to theaterId
          fetchTheaters={fetchTheaters} // Updated function to fetch theaters
        />
      )}
    </>
  );
}
