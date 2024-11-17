import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from "./components/Context/AppContext";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
  <AppProvider>
    <ToastContainer />
    <App />
    </AppProvider>
  </>
);
