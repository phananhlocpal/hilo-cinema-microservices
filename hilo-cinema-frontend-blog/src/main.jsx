import React from 'react'
import ReactDOM from 'react-dom/client'
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import { allReducers } from "./redux/reducers/index.jsx"
import { thunk } from 'redux-thunk';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App.jsx'
import './index.css'

const store = createStore(allReducers, applyMiddleware(thunk));

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>,
  </Provider>

)