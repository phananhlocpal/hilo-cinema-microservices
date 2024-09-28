import { useState, useEffect } from "react";
import axios from "axios";

const useFetchCountries = () => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const { data } = await axios.get("https://restcountries.com/v3.1/all");
                const formattedCountries = data.map(({ cca2, name }) => ({
                    value: cca2,
                    label: name.common
                })).sort((a, b) => a.label.localeCompare(b.label));
                setCountries(formattedCountries);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchCountries();
    }, []);

    return countries;
};

export default useFetchCountries;
