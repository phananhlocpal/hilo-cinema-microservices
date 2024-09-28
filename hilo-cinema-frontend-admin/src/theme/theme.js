import { extendTheme } from "@chakra-ui/react";
import { CardComponent } from "./additions/card/card";
import { buttonStyles } from "./components/button";
import { badgeStyles } from "./components/badge";
import { inputStyles } from "./components/input";
import { progressStyles } from "./components/progress";
import { sliderStyles } from "./components/slider";
import { textareaStyles } from "./components/textarea";
import { switchStyles } from "./components/switch";
import { linkStyles } from "./components/link";
import { globalStyles } from "./styles";

// Cấu hình useColorMode
const config = {
  initialColorMode: "light", // Chế độ mặc định là "light"
  useSystemColorMode: false, // Không sử dụng chế độ của hệ thống
};

const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1600px",
};

export default extendTheme(
  {
    config, // Thêm cấu hình useColorMode vào theme
    breakpoints, // Định nghĩa trực tiếp breakpoints
  },
  globalStyles,
  badgeStyles, // badge styles
  buttonStyles, // button styles
  linkStyles, // link styles
  progressStyles, // progress styles
  sliderStyles, // slider styles
  inputStyles, // input styles
  textareaStyles, // textarea styles
  switchStyles, // switch styles
  CardComponent // card component
);
