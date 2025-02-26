import createItem from "./item.js";
import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_VERYHIGH } from './constants.js';

// Factory function for creating projects
function createProject(projectName) {
    
    // Create ID for project to uniquely refer to in DOM
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    let name = projectName;
    let items = [];
    
    // Function called by the controller, returns an ID that can be put into the DOM for future reference
    function addItem(description, date, priority) {
        let item = createItem(description, date, priority);
        items.push(item);
        return(item.id);
    }

    // Returns a copy of list of items in project, parameter determines the order its returned in
    function getItems() {

    }

    return {id, addItem, getItems};
}

export default createProject;