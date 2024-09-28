import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const useCheckTokenExpiration = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                // Calculate remaining time before the token expires
                const currentTime = Date.now() / 1000;
                const timeLeft = decodedToken.exp - currentTime;

                // If the token is expired or about to expire
                if (timeLeft <= 0) {
                    // Remove the token and redirect to login page
                    localStorage.removeItem("jwtToken");
                    navigate("/dang-nhap");
                } else {
                    // Set a timer to check token expiration
                    setTimeout(() => {
                        localStorage.removeItem("jwtToken");
                        navigate("/dang-nhap");
                    }, timeLeft * 1000);
                }
            } catch (error) {
                // Handle decoding error (e.g., invalid token)
                localStorage.removeItem("jwtToken");
                navigate("/dang-nhap");
            }
        } else {
            // If no token is found, redirect to login page
            navigate("/dang-nhap");
        }
    }, [navigate]);
};

export default useCheckTokenExpiration;
