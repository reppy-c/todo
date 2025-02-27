import "./css/reset.css";
import "./css/styles.css";
import createProject from "./project.js";
import { initializeController } from "./controller.js";  

// This is an IIFE (immediately invoked function expression), basically the main loop
const main = (function () {

    // Initialize the controller
    initializeController();

})();