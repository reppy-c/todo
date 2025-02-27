import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './constants.js';

import createItem from "./item.js";
import createProject from "./project.js";
import formatDate from "./dateformatter.js";

const li_list = document.querySelector('#todo-list');
let currentProject;

// This is the one function that will be called by index.js
export function initializeController() {

    // Function to create HTML out of a todo object using template literals to make it easier to create the HTML.
    const itemHTML = (todo) => `
        <div class="checkbox">
        </div>
        <div class="text-items">
            <span class="description">${todo.description}</span>
            <span class="due-date">${formatDate(todo.date)}</span>
        </div>
        <div class="priority ${todo.priority}">
        </div>
    `;

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