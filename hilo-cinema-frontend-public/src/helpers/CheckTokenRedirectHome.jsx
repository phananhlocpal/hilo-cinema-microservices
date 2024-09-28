import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correcting the import statement
import { useDispatch } from "react-redux";
import { isLogIn } from "../redux/actions/authAction";

const CheckTokenRedirectHome = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook to navigate programmatically

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
                    // Remove the token and update Redux state
                    localStorage.removeItem("jwtToken");
                    dispatch(isLogIn(false));
                    navigate("/trang-chu"); // Redirect to the home page
                } else {
                    // Set a timer to check token expiration
                    setTimeout(() => {
                        localStorage.removeItem("jwtToken");
                        dispatch(isLogIn(false));
                        navigate("/trang-chu"); // Redirect to the home page
                    }, timeLeft * 1000);
                }
            } catch (error) {
                // Handle decoding error (e.g., invalid token)
                localStorage.removeItem("jwtToken");
                dispatch(isLogIn(false));
                navigate("/trang-chu"); // Redirect to the home page
            }
        } else {
            // If no token is found, update Redux state
            dispatch(isLogIn(false));
            navigate("/trang-chu"); // Redirect to the home page
        }
    }, [dispatch, navigate]);
};

export default CheckTokenRedirectHome;
