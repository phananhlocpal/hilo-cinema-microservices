import React, { useEffect, useState } from 'react'
import Avatar1 from "assets/img/avatars/avatar1.png";
import Avatar2 from "assets/img/avatars/avatar2.png";
import Avatar3 from "assets/img/avatars/avatar3.png";
import Avatar4 from "assets/img/avatars/avatar4.png";
import NFT from "components/card/NFT";
import {
    Flex,
    Link,
    Text,
    useColorModeValue,
    SimpleGrid,
  } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import dataMovie from 'views/admin/sales/variables/dataMovie.json';
function TrendingMovie() {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorBrand = useColorModeValue("brand.500", "white");
    
    const dispatch = useDispatch();
    const [movies, setMovies] = useState([]);
    const { user, token } = useSelector((state) => state.auth);
    useEffect(() => {
        if (token) {
          setMovies(dataMovie);
        }
      }, [dispatch, token]);
    return (
        <Flex direction="column" mt={5}>
            <Flex
                mt="45px"
                mb="20px"
                justifyContent="space-between"
                direction={{ base: "column", md: "row" }}
                align={{ base: "start", md: "center" }}
            >
                <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                    Trending Movies
                </Text>
                <Flex
                    align="center"
                    me="20px"
                    ms={{ base: "24px", md: "0px" }}
                    mt={{ base: "20px", md: "0px" }}
                >
                    <Link
                        color={textColorBrand}
                        fontWeight="500"
                        me={{ base: "34px", md: "44px" }}
                        to="#art"
                    >
                        Art
                    </Link>
                    <Link
                        color={textColorBrand}
                        fontWeight="500"
                        me={{ base: "34px", md: "44px" }}
                        to="#music"
                    >
                        Music
                    </Link>
                    <Link
                        color={textColorBrand}
                        fontWeight="500"
                        me={{ base: "34px", md: "44px" }}
                        to="#collectibles"
                    >
                        Collectibles
                    </Link>
                    <Link color={textColorBrand} fontWeight="500" to="#sports">
                        Sports
                    </Link>
                </Flex>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
                {movies.map((movie, index) => (
                    <NFT
                        key={index}
                        name={movie.title}
                        author={`By ${movie.director}`}
                        bidders={[
                            Avatar1,
                            Avatar2,
                            Avatar3,
                            Avatar4,
                            Avatar1,
                            Avatar1,
                            Avatar1,
                            Avatar1,
                        ]}
                        image={movie.imgSmall}
                        rate={`${movie.rate} / 10`}
                        download={movie.trailer}
                    />
                ))}
            </SimpleGrid>
        </Flex>
    )
}

export default TrendingMovie