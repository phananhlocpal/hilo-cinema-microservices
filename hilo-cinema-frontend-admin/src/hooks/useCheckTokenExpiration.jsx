import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";

const useCheckTokenExpiration = () => {
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                const timeLeft = decodedToken.exp - currentTime;

                if (timeLeft <= 0) {
                    localStorage.removeItem("token");
                    history.push("/auth");
                } else {
                    setTimeout(() => {
                        localStorage.removeItem("token");
                        history.push("/auth");
                    }, timeLeft * 1000);
                }
            } catch (error) {
                localStorage.removeItem("token");
                history.push("/auth");
            }
        } else {
            history.push("/auth");
        }
    }, [history])
};

export default useCheckTokenExpiration;
