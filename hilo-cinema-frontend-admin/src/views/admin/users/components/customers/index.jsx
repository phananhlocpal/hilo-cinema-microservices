// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";

import {
  columnsDataDevelopment,

} from "views/admin/users/components/customers/variables/columnsData";
import tableDataDevelopment from "views/admin/users/components/customers/variables/tableDataDevelopment.json";

import React from "react";
import CustomerList from "./components/Customers";

export default function Customers() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      
      <SimpleGrid
        mb='20px'
        mt='30px'
        spacing={{ base: "20px", xl: "20px" }}>
        <CustomerList
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
      </SimpleGrid>
    </Box>
  );
}
