// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";

import {
  columnsDataDevelopment,

} from "views/admin/users/components/employees/variables/columnsData";
import tableDataDevelopment from "views/admin/users/components/employees/variables/tableDataDevelopment.json";

import React from "react";
import EmployeeList from "./components/Employees";

export default function Employees() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      
      <SimpleGrid
        mb='20px'
        mt='30px'
        spacing={{ base: "20px", xl: "20px" }}>
        <EmployeeList
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
      </SimpleGrid>
    </Box>
  );
}
