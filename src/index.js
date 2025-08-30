import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";     // ✅ our new styles
// remove/comment default CRA styles: index.css/App.css if they exist

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
