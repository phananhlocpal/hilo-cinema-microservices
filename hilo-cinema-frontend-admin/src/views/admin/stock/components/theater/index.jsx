// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import {
  columnsDataDevelopment,
} from "views/admin/stock/components/theater/variables/columnsData";
import tableDataDevelopment from "views/admin/stock/components/movie/variables/tableDataDevelopment.json";
import React from "react";
import Theaters from "./components/Theaters";

export default function UserManagement() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <Theaters
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
      </SimpleGrid>
    </Box>
  );
}