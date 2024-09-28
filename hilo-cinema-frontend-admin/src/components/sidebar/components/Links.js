import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, useColorModeValue, Collapse } from "@chakra-ui/react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

export function SidebarLinks(props) {
  const { routes } = props;
  const location = useLocation();
  const activeColor = useColorModeValue("gray.700", "white");
  const inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  const activeIcon = useColorModeValue("brand.500", "white");
  const textColor = useColorModeValue("secondaryGray.500", "white");
  const brandColor = useColorModeValue("brand.500", "brand.400");
  const activeRoute = (routePath) => {
    return location.pathname === routePath;
  };

  // Sử dụng useState bên ngoài hàm callback
  const [dropdownStates, setDropdownStates] = useState({});

  const toggleDropdown = (index) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.routes) {
        // Handle dropdown menu
        const isOpen = dropdownStates[index] || false;
        return (
          <Box key={index} mb={route.name === "Stock Management" ? "5px" : "5px"}>
            <Flex
              align='center'
              justify='space-between'
              px='10px'
              py='5px'
              cursor='pointer'
              onClick={() => toggleDropdown(index)}
            >
              <HStack spacing={activeRoute(route.layout + route.path) ? "22px" : "26px"}>
                <Flex w='100%' alignItems='center' justifyContent='center'>
                  <Box
                    color={activeRoute(route.layout + route.path) ? activeIcon : textColor}
                    me='18px'
                  >
                    {route.icon}
                  </Box>
                  <Text
                    me='auto'
                    color={activeRoute(route.layout + route.path) ? activeColor : textColor}
                    fontWeight={activeRoute(route.layout + route.path) ? "bold" : "normal"}
                  >
                    {route.name}
                  </Text>
                </Flex>
              </HStack>
              <Box>
                {isOpen ? <MdExpandLess /> : <MdExpandMore />}
              </Box>
            </Flex>
            <Collapse in={isOpen} animateOpacity>
              <Box pl="10px">
                {createLinks(route.routes)}
              </Box>
            </Collapse>
          </Box>
        );
      } else if (route.layout === "/admin" || route.layout === "/auth" || route.layout === "/rtl") {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            {route.icon ? (
              <Box>
                <HStack spacing={activeRoute(route.layout + route.path) ? "22px" : "26px"} py='5px' ps='10px'>
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box color={activeRoute(route.layout + route.path) ? activeIcon : textColor} me='18px'>
                      {route.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={activeRoute(route.layout + route.path) ? activeColor : textColor}
                      fontWeight={activeRoute(route.layout + route.path) ? "bold" : "normal"}
                    >
                      {route.name}
                    </Text>
                  </Flex>
                  <Box
                    h='36px'
                    w='4px'
                    bg={activeRoute(route.layout + route.path) ? brandColor : "transparent"}
                    borderRadius='5px'
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack spacing={activeRoute(route.layout + route.path) ? "22px" : "26px"} py='5px' ps='10px'>
                  <Text
                    me='auto'
                    color={activeRoute(route.layout + route.path) ? activeColor : inactiveColor}
                    fontWeight={activeRoute(route.layout + route.path) ? "bold" : "normal"}
                  >
                    {route.name}
                  </Text>
                  <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;
