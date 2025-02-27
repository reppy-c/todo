import "./reset.css";
import "./styles.css";
import createProject from "./project.js";
import { initializeController } from "./controller.js";
import { format } from "date-fns";  

// This is an IIFE (immediately invoked function expression), basically the main loop
const main = (function () {

    // Initialize the controller
    initializeController();

})();