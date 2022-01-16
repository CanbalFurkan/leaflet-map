import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "leaflet/dist/leaflet.css";
import Map from "./Map";
import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(<Map />, rootElement);
