import createItem from "./item.js";

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

    function updateItem(id, description, date, priority) {
        const itemToUpdate = items.find((item) => item.id === id);//

        itemToUpdate.date = date;
        itemToUpdate.priority = priority;
        itemToUpdate.description = description;
    }

    function deleteItem(id) {
        items = items.filter(item => item.id !== id);
    }

    // Returns a copy of list of items in project, parameter determines the order its returned in
    function getItems() {
        return items;
    }

    return {id, name, addItem, getItems, updateItem, deleteItem};
}

export default createProject;