import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { isLogIn } from "../redux/actions/authAction";

const CheckTokenExpiration = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        console.log(token);
        if (token != null) {
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
                } else {
                    // Set a timer to check token expiration
                    setTimeout(() => {
                        localStorage.removeItem("jwtToken");
                        dispatch(isLogIn(false));
                    }, timeLeft * 1000);
                }
            } catch (error) {
                // Handle decoding error (e.g., invalid token)
                localStorage.removeItem("jwtToken");
                dispatch(isLogIn(false));
            }
        } else {
            // If no token is found, update Redux state
            console.log("here");
            dispatch(isLogIn(false));
        }
    }, [dispatch]);
};

export default CheckTokenExpiration;
