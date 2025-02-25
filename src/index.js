import "./reset.css";
import "./styles.css";
import createProject from "./project.js";
import { format } from "date-fns";  

const project = createProject("My Project");

console.log(project.name);