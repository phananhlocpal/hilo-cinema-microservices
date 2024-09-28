import { Button } from "@chakra-ui/react";
import darkLogo from "../../assets/img/darkLogo.png";

const HomePage = () => {
    return (
        <div className="flex justify-center items-center" style={{ width: "100%", height: "calc(100vh - 200px)" }}>
            <div className="flex flex-col items-center">
                <img src={darkLogo} className="size-40" />
                <h1 className=" text-gray-700" style={{ fontSize: "2rem" }}>
                    Let&apos;s create <span className="text-blue-800 font-bold" style={{ fontSize: "2.5rem" }}>BLOGS</span> together!
                </h1>
                <Button className="mt-5">Start</Button>
            </div>
        </div>
    );
};

export default HomePage;