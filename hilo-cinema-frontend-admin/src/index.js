import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "../src/theme/theme";
import { allReducers } from "./reduxHilo/reducers/index.jsx";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { thunk } from "redux-thunk";
import ForgotPassword from "views/auth/signIn/forgotPassword";
import VerifyOTP from "views/auth/signIn/verifyOTP";
import NewPassword from "views/auth/signIn/newPassword";
import ConfirmPayment from "views/admin/sales/ticket/components/ConfirmPayment";

const store = createStore(allReducers, applyMiddleware(thunk));

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      {/* Thêm ColorModeScript ngay dưới ChakraProvider */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ThemeEditorProvider>
        <HashRouter>
          <Switch>
            <Route path={`/auth`} component={AuthLayout} />
            <Route path={`/forgot-password`} component={ForgotPassword} />
            <Route path={`/verify-otp`} component={VerifyOTP} />
            <Route path={`/new-password`} component={NewPassword} />
            <Route path={`/payment-confirm`} component={ConfirmPayment} />
            <Route path={`/admin`} component={AdminLayout} />
            <Redirect from="/" to="/admin" />
          </Switch>
        </HashRouter>
      </ThemeEditorProvider>
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);
