import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';

import createItem from "./item.js";
import createProject from "./project.js";
import formatDate from "./utils/dateformatter.js";

// Importing the menu icon to use in a TODO item, because the filepath within the template literal is not being caught by webpack
import menuIconURL from "./icons/menu.svg";
import { addMinutes } from 'date-fns';


// Define constants for the different DOM elements
const li_list = document.querySelector('#todo-list');
const div_scrim = document.querySelector('#modal-scrim');
const div_modal_create_todo = document.querySelector('#modal-create-todo');
const div_modal_create_project = document.querySelector('#modal-create-project');
const btn_add_todo = document.querySelector("#add-todo");
const btn_close_todo = document.querySelector("#close-modal-create-todo");
const btn_create_todo = document.querySelector("#create-todo");

// Other variables
let currentProject;
let currentModal;

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

// Create a whole bunch of these and attach it to #todo-list ul as children li
function displayItems(order) {       
    
    // Iterate through current project
    currentProject.getItems().forEach((todo) => {
        // Create a li element
        const itemToCreate = document.createElement("li");
        
        // Add class to the li element
        itemToCreate.classList.add("todo-item");

        // Attach id to it so we can reference it later
        itemToCreate.setAttribute('data-id', todo.id);

        // Add the HTML to the li element
        itemToCreate.innerHTML = itemHTML(todo);

        // Append the li to the actual DOM
        li_list.append(itemToCreate);

        // Attach event listeners for checkbox and the menu

    });
}

// Just empty out the DOM list so we can re-render it
function clearItems() {
    li_list.innerHTML = "";
}

function showModal(modal) {
    
    // Toggle visibility of the modal and scrim
    div_scrim.style.visibility = 'visible';
    modal.style.visibility = 'visible';
    
    // Add show class to trigger transition
    div_scrim.classList.add('show');
    modal.classList.add('show');
    
    // Set global variable for hiding later
    currentModal = modal;
}

// Hide the currently displayed modal and the scrim
function hideModal() {
    
    // Remove current showing modal, 
    if(currentModal){
        currentModal.classList.remove('show');

        setTimeout(() => {
            currentModal.style.visibility = 'hidden';
            currentModal = null;
        }, 300); // Match the duration of the CSS transition
    }

    // Remove the scrim
    div_scrim.classList.remove('show');

    setTimeout(() => {
        div_scrim.style.visibility = 'hidden';
    }, 300); // Match the duration of the CSS transition

    
}

// Attach all the event listeners
function addEventListeners() {
    
    // Add TODO button
    btn_add_todo.addEventListener("click", () => {
        showModal(div_modal_create_todo);
    });

    // Close TODO button
    btn_close_todo.addEventListener("click", () => {
        hideModal();
    });

    // Scrim 
    div_scrim.addEventListener("click", () => {
        // div_modal_create_todo.classList.remove('show');
        hideModal();
    });

    // Create TODO button in modal
    btn_create_todo.addEventListener("click", () => {
        
        const description = document.querySelector("#todo-description").value;
        const date = new Date(document.querySelector("#todo-due-date").value);

        // HTML datepicker is weird and assumes the user is specifying a UTC time.
        // So we need to adjust it so the date stored (still UTC) is adjusted.
        const adjustedDate = addMinutes(date, date.getTimezoneOffset());

        // Pull back the priority from the selected radio button
        const priority = document.querySelector('input[name="priority"]:checked').value;

        // Add the item to the current project
        currentProject.addItem(description, adjustedDate, priority);


        li_list.innerHTML = "";
        displayItems();
        hideModal();
    });

}

// This is the one function that will be called by index.js
export function initializeController() {

    // Create default project
    currentProject = createProject("My Project");
    currentProject.addItem("My first item", new Date(), PRIORITY_NORMAL);
    currentProject.addItem("My second item", new Date(), PRIORITY_HIGH);
    currentProject.addItem("My third item", new Date(), PRIORITY_MAX);
    
    // Display items
    displayItems();
    addEventListeners();
}