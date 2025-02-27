import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';

import createItem from "./item.js";
import createProject from "./project.js";
import formatDate from "./utils/dateformatter.js";

// Importing the menu icon to use in a TODO item, because the filepath within the template literal is not being caught by webpack
import menuIconURL from "./icons/menu.svg";

const li_list = document.querySelector('#todo-list');
let currentProject;

// Function to create HTML out of a todo object using template literals
const itemHTML = (todo) => `
    <div class="checkbox">
    </div>
    <div class="text-items">
        <span class="description">${todo.description}</span>
        <span class="second-line">
            <div class="priority ${todo.priority}"></div>
            <span class="due-date">${formatDate(todo.date)}</span>
        </span>
    </div>
    
    <button class="item-menu"><img src="${menuIconURL}" /></button>
`;

// Attach event listener to Add TODO button

// This is the one function that will be called by index.js
export function initializeController() {

    // Create a whole bunch of these and attach it to #todo-list ul as children li
    function displayItems(order) {       
        
        // Iterate through current project
        currentProject.getItems().forEach((todo) => {
            // Create a li element
            const itemToCreate = document.createElement("li");
            
            // Add class to the li element
            itemToCreate.classList.add("todo-item");

            // Add the HTML to the li element
            itemToCreate.innerHTML = itemHTML(todo);

            // Append the li to the actual DOM
            li_list.append(itemToCreate);
        });
    }

    // Create default project
    currentProject = createProject("My Project");
    currentProject.addItem("My first item", new Date(), PRIORITY_NORMAL);
    currentProject.addItem("My second item", new Date(), PRIORITY_HIGH);
    currentProject.addItem("My third item", new Date(), PRIORITY_MAX);
    
    // Display items
    displayItems();
}