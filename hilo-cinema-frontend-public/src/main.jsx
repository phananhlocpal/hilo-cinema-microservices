import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { allReducers } from './redux/reducers/index.js';
import { thunk } from 'redux-thunk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 import { ChakraProvider } from '@chakra-ui/react';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Cấu hình Redux Persist
const persistConfig = {
  key: 'root',
  whitelist: ["auth", "schedule"],
  storage,
};

const muiTheme = createTheme();
const persistedReducer = persistReducer(persistConfig, allReducers);

// Tạo store với persistedReducer
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ChakraProvider>
      <ThemeProvider theme={muiTheme}> 
      <CssBaseline/>
      <QueryClientProvider client={queryClient}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </QueryClientProvider>
      </ThemeProvider>
              
      </ChakraProvider>
    </PersistGate>
  </Provider>
);
