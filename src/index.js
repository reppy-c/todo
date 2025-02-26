import "./reset.css";
import "./styles.css";
import createProject from "./project.js";
import { format } from "date-fns";  

// This is an IIFE (immediately invoked function expression), basically the main loop
const main = (function () {

    // Create default project
    const project = createProject("My Project");
    
})();