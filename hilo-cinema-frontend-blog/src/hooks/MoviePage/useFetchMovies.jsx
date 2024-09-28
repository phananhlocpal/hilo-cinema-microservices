import { useState, useEffect } from "react";
import axios from "axios";

const useFetchMovies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const { data } = await axios.get("http://localhost:8000/MovieService", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Site: 'admin',
                    },
                });
                setMovies(data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, []);

    return movies;
};

export default useFetchMovies;
