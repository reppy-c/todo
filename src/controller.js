import { TYPE_INBOX, TYPE_PROJECT, INBOX_EVERYTHING, INBOX_TODAY, INBOX_PRIORITY, PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX, SORT_PRIORITY } from './utils/constants.js';

import createItem from "./item.js";
import createProject from "./project.js";
import formatDate from "./utils/dateformatter.js";
import { initializeProjects, getItems, getProject, getProjects, addProject } from './manager.js';
import { addMinutes } from 'date-fns';

// Importing the menu icon to use in a TODO item, because the filepath within the template literal is not being caught by webpack
import menuIconURL from "./icons/menu.svg";

// Define constants for the different DOM elements
const ul_list = document.querySelector('#todo-list');
const ul_projects = document.querySelector('#projects-list');
const div_scrim = document.querySelector('#modal-scrim');
const div_modal_create_todo = document.querySelector('#modal-create-todo');
const div_modal_create_project = document.querySelector('#modal-create-project');
const div_modal_sidebar = document.querySelector('#sidebar');
const btn_add_todo = document.querySelector("#add-todo");
const btn_add_project = document.querySelector("#add-project");
const btn_close_todo = document.querySelector("#close-modal-create-todo");
const btn_close_project = document.querySelector("#close-modal-create-project");
const btn_create_todo = document.querySelector("#create-todo");
const btn_create_project = document.querySelector("#create-project");
const select_todo_project = document.querySelector("#todo-project");
const btn_everything = document.querySelector("#inbox-everything");
const btn_today = document.querySelector("#inbox-today");
const btn_priority = document.querySelector("#inbox-priority");
const btn_viewing = document.querySelector("#current-view");
const select_sort = document.querySelector("#sort-list");

let currentViewType = TYPE_INBOX; // The currently selected view type (can be an inbox or a project)
let currentView = INBOX_EVERYTHING; // The currently selected view (can be one of the inboxes, or a project)
let currentSort = SORT_PRIORITY; // The currently selected sort mode (name, priority or date)
let currentModal; // Is set when a modal is displayed so hideModal() can hide it on scrim click

// Function to create HTML out of a todo object using template literals
const itemHTML = (todo) => `
    <div class="checkbox">
    </div>
    <div class="text-items">
        <span class="project">${todo.projectName}</span>
        
        <span class="second-line">
            <div class="priority"></div>
            <span class="description">${todo.description}</span>
        </span>

        <span class="due-date"></span>
    </div>
    
    <button class="item-menu"><img src="${menuIconURL}" /></button>
`;

// Function to create HTML out of a project using template literals
const projectHTML = (proj) => `
    <button data-id="${proj.id}">${proj.name}</button>
`;

// Set the current view (inbox or proj) and refresh the project list
function setCurrentView(id) {
    currentView = id;

    // Display the TODO items as part of that project
    displayItems();
    displayProjects();
}

// Render all current projects (including the inboxes)
function displayProjects() {     
    let currentViewFriendlyName = "";

    // Empty the project list in the sidebar
    ul_projects.innerHTML = "";
    select_todo_project.innerHTML = "";

    // Deselect the inboxes
    btn_everything.classList.remove("current");
    btn_today.classList.remove("current");
    btn_priority.classList.remove("current");

    // If any of the inboxes are the current view, add class current to it
    switch(currentView) {
        case INBOX_EVERYTHING: btn_everything.classList.add("current"); currentViewFriendlyName = "Everything"; break;
        case INBOX_TODAY: btn_today.classList.add("current"); currentViewFriendlyName = "Today"; break;
        case INBOX_PRIORITY: btn_priority.classList.add("current");currentViewFriendlyName = "Priority"; break;
    }

    // Iterate through each project and render each to the sidebar and the create project modal
    let projects = getProjects().forEach((proj) => {
        const projectToCreate = document.createElement("li");
        const optionToCreate = document.createElement("option");

        projectToCreate.classList.add("proj");
        projectToCreate.innerHTML = projectHTML(proj);
        projectToCreate.setAttribute('data-id', proj.id);
        
        // This is for the dropdown in the create project modal
        optionToCreate.value = proj.id;
        optionToCreate.textContent = proj.name;
        
        // Add event listeners to the projects
        projectToCreate.addEventListener("click", () => {
            currentViewType = TYPE_PROJECT;
            currentView = proj.id;
            setCurrentView(proj.id);
        });

        // Highlight which project is being viewed and set default project for the Add TODO modal
        if(proj.id == currentView) {
            projectToCreate.classList.add("current");
            optionToCreate.selected = true;
            currentViewFriendlyName = proj.name;
        }

        ul_projects.append(projectToCreate);
        select_todo_project.append(optionToCreate);
    });

    // If projects is being refreshed, means something happened that should close the modal in mobile
    if(currentModal == div_modal_sidebar) {
        hideModal();
    }

    // Change the label of the viewing button
    btn_viewing.innerHTML = currentViewFriendlyName;
}

// Create a whole bunch of these and attach it to #todo-list ul as children li
function displayItems() {       
    // Empty the list before rendering it
    ul_list.innerHTML = "";

    // Manager will return either a project's items, or items from multiple projects
    let itemArray = getItems(currentViewType, currentView, currentSort);

    itemArray.forEach((todo) => {
        // Create a li element
        const itemToCreate = document.createElement("li");
        
        // Add class to the li element
        itemToCreate.classList.add("todo-item");

        // Attach id to it so we can reference it later
        itemToCreate.setAttribute('data-id', todo.id);

        // Add the HTML to the li element
        itemToCreate.innerHTML = itemHTML(todo);

        // If it's a project, don't display the project name
        if(currentViewType == TYPE_PROJECT) {
            itemToCreate.querySelector(".project").style.display = "none";
        }

        // If the date isn't null, then format it
        if(todo.date != null) {
            itemToCreate.querySelector(".due-date").innerHTML = formatDate(todo.date);

            // If it's overdue, make it red
            if(todo.isOverdue()) {
                itemToCreate.querySelector(".due-date").classList.add("overdue");
            }
        }
        
        // Add appropriate priority class
        switch(todo.priority) {
            case PRIORITY_NORMAL: itemToCreate.querySelector(".priority").classList.add("normal"); break;
            case PRIORITY_HIGH: itemToCreate.querySelector(".priority").classList.add("high"); break;
            case PRIORITY_MAX: itemToCreate.querySelector(".priority").classList.add("max"); break;
        }

        // Append the li to the actual DOM
        ul_list.append(itemToCreate);

        // Attach event listeners for checkbox and the menu
    });
}

function showModal(modal) {
    
    // If the currentModal is not null but the sidebar, then hide the sidebar but leave the scrim
    if(currentModal = div_modal_sidebar) {
        currentModal.classList.remove('show');
    }

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
    // Everything inbox sidebar link
    btn_everything.addEventListener("click", () => {
        currentViewType = TYPE_INBOX;
        currentView = INBOX_EVERYTHING;
        displayProjects();
        displayItems();
    });

    // Today inbox sidebar link
    btn_today.addEventListener("click", () => {
        currentViewType = TYPE_INBOX;
        currentView = INBOX_TODAY;
        displayProjects();
        displayItems();
    });

    // High priority inbox sidebar link
    btn_priority.addEventListener("click", () => {
        currentViewType = TYPE_INBOX;
        currentView = INBOX_PRIORITY;
        displayProjects();
        displayItems();
    });

    // Add Project button
    btn_add_project.addEventListener("click", () => {
        showModal(div_modal_create_project);
    });

    // Add TODO button
    btn_add_todo.addEventListener("click", () => {
        showModal(div_modal_create_todo);
    });

    // Current view button
    btn_viewing.addEventListener("click", () => {
        showModal(div_modal_sidebar);
    });

    // Sort button
    select_sort.addEventListener("change", () => {
        currentSort = select_sort.value;
        displayItems();
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
        hideModal();
    });

    // Create TODO button in modal
    btn_create_todo.addEventListener("click", () => {
        const description = document.querySelector("#todo-description").value;
        const date = new Date(document.querySelector("#todo-due-date").value);
        const projectID = document.querySelector("#todo-project").value;
        let adjustedDate = null;

        // Only validation required is to have a description
        if(description == "") {
            document.querySelector("#todo-description").parentElement.classList.add("error");
            return null;
        }
        
        // Only try to adjust date if its a valid date
        if(date != "Invalid Date") {
            // HTML datepicker is weird and assumes the user is specifying a UTC time.
            // So we need to adjust it so the date stored (still UTC) is adjusted.
            adjustedDate = addMinutes(date, date.getTimezoneOffset());
        }

        // Pull back the priority from the selected radio button
        let priority = '';

        switch(document.querySelector('input[name="priority"]:checked').value) {
            case "normal": priority = PRIORITY_NORMAL; break;
            case "high": priority = PRIORITY_HIGH; break;
            case "max": priority = PRIORITY_MAX; break;
        }

        // Add the item to project selected in the dropdown
        getProject(projectID).addItem(description, adjustedDate, priority);

        // Go to project view to ensure user sees the newly added item
        currentViewType = TYPE_PROJECT;
        currentView = projectID;

        // Clear the list and re-render
        displayProjects();
        displayItems();
        
        // Now hide modal and reset the fields after its hidden for next time
        hideModal();
        setTimeout(() => {
            document.querySelector("#todo-description").value = "";
            document.querySelector("#todo-description").parentElement.classList.remove("error");
            document.querySelector("#todo-due-date").value = "";
            document.querySelector("#priority-1").checked = true
        }, 300); 
    });

    // Create Project button in modal
    btn_create_project.addEventListener("click", () => {
        const name = document.querySelector("#project-name").value;

        // Validate that there is a name
        if(name == "") {
            document.querySelector("#project-name").parentElement.classList.add("error");
            return null;
        }

        addProject(name);
        displayProjects();

        // Now hide modal and reset the fields after its hidden for next time
        hideModal();
        setTimeout(() => {
            document.querySelector("#project-name").value = "";
            document.querySelector("#project-name").parentElement.classList.remove("error");
        }, 300); 
    });
}

// This is the one function that will be called by index.js
export function initializeController() {

    // Create default project
    initializeProjects();

    // Display items
    displayItems();
    displayProjects();
    addEventListeners();
}