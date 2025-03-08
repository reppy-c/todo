import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';

import createItem from "./item.js";
import createProject from "./project.js";
import formatDate from "./utils/dateformatter.js";
import { initializeProjects, getProject, getProjects, addProject } from './manager.js';

// Importing the menu icon to use in a TODO item, because the filepath within the template literal is not being caught by webpack
import menuIconURL from "./icons/menu.svg";
import { addMinutes } from 'date-fns';


// Define constants for the different DOM elements
const ul_list = document.querySelector('#todo-list');
const ul_projects = document.querySelector('#projects-list');
const div_scrim = document.querySelector('#modal-scrim');
const div_modal_create_todo = document.querySelector('#modal-create-todo');
const div_modal_create_project = document.querySelector('#modal-create-project');
const btn_add_todo = document.querySelector("#add-todo");
const btn_add_project = document.querySelector("#add-project");
const btn_close_todo = document.querySelector("#close-modal-create-todo");
const btn_close_project = document.querySelector("#close-modal-create-project");
const btn_create_todo = document.querySelector("#create-todo");
const btn_create_project = document.querySelector("#create-project");

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

// Function to create HTML out of a project using template literals
const projectHTML = (proj) => `
    <button data-id="${proj.id}">${proj.name}</button>
`;

// Set the current project and refresh the project list
function setCurrentProject(id) {

    // Set the global variable for the current project
    currentProject = getProject(id);

    // Display the TODO items as part of that project
    displayItems();
    displayProjects();
}

// Display all current projects (including the inboxes)
function displayProjects() {     

    // Empty the project list in the sidebar
    ul_projects.innerHTML = "";

    // Iterate through each project and render each to the sidebar
    let projects = getProjects().forEach((proj) => {
        const projectToCreate = document.createElement("li");

        projectToCreate.classList.add("proj");
        projectToCreate.innerHTML = projectHTML(proj);
        projectToCreate.setAttribute('data-id', proj.id);
        
        projectToCreate.addEventListener("click", () => {
            setCurrentProject(proj.id);
        });

        if(proj.id == currentProject.id) {
             projectToCreate.classList.add("current");
        }

        ul_projects.append(projectToCreate);
    });
}

// Create a whole bunch of these and attach it to #todo-list ul as children li
function displayItems(order) {       
    
    // Empty the list before rendering it
    ul_list.innerHTML = "";

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
        ul_list.append(itemToCreate);

        // Attach event listeners for checkbox and the menu

    });
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

    // Add Project button
    btn_add_project.addEventListener("click", () => {
        showModal(div_modal_create_project);
    });

    // Close TODO button
    btn_close_todo.addEventListener("click", () => {
        hideModal();
    });

    // Close Project button
    btn_close_project.addEventListener("click", () => {
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

        // Clear the list and re-render
        displayItems();
        
        // Now hide modal and reset the fields after its hidden for next time
        hideModal();
        setTimeout(() => {
            document.querySelector("#todo-description").value = "";
            document.querySelector("#todo-due-date").value = "";
            document.querySelector("#priority-1").checked = true
        }, 300); 
    });

    // Create Project button in modal
    btn_create_project.addEventListener("click", () => {
        
        const name = document.querySelector("#project-name").value;
        addProject(name);
        displayProjects();

        // Now hide modal and reset the fields after its hidden for next time
        hideModal();
        setTimeout(() => {
            document.querySelector("#project-name").value = "";
        }, 300); 
    });
}

// This is the one function that will be called by index.js
export function initializeController() {

    // Create default project
    currentProject = initializeProjects();
    
    // Display items
    displayItems();
    displayProjects();
    addEventListeners();
}