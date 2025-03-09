// This file will manage the projects so that the controller can focus on the DOM manipulation. Eventually it will make use of local storage.

import { INBOX_EVERYTHING, INBOX_TODAY, INBOX_PRIORITY, TYPE_INBOX, TYPE_PROJECT, PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';
import createProject from "./project";
import createItem from "./item.js";
import { addDays } from 'date-fns';


let projects = [];

export function addProject(name) {
    const newProject= createProject(name);
    projects.push(newProject)

    return newProject;
}

// This is the main function that will return items for
// If it's a project, then return the items from the project
// If it's an inbox, then return all relevant items from all projects
export function getItems(type, id) {

    switch (type) {
        case TYPE_INBOX:
            let itemArray = [];

            // If it's an inbox, the id will be the id of the inbox 
            switch(id) {
                case INBOX_EVERYTHING:
                    // Loop through every project and concat every item array
                    projects.forEach((proj) => {
                        itemArray = itemArray.concat(proj.getItems());
                    });
                    return itemArray;
                break;

                case INBOX_TODAY:
                    // Loop through every project
                    projects.forEach((proj) => {
                        // Loop through every item and add every item that is due today or earlier
                        proj.getItems().forEach((todo) => {
                            if(todo.isTodayOrOverdue())                        
                                itemArray.push(todo);
                        });
                    });
                    return itemArray;
                break;

                case INBOX_PRIORITY:
                    // Loop through every project
                    projects.forEach((proj) => {
                        // Loop through every item and add every item that is due today or earlier
                        proj.getItems().forEach((todo) => {
                            if(todo.isPriority())                        
                                itemArray.push(todo);
                        });
                    });
                    return itemArray;
                break;
            }
        break;
        case TYPE_PROJECT: 
            let project = projects.find(project => project.id === id);

            return project.getItems();
        break;
    }
}

export function getProjects() {
    return projects;
}

export function getProject(id) {
    return projects.find(project => project.id === id);
}

export function initializeProjects() {
    const defaultProject = addProject("Default Project");

    defaultProject.addItem("My first item", new Date(), PRIORITY_NORMAL);
    defaultProject.addItem("My second item", addDays(new Date(),1), PRIORITY_HIGH);
    defaultProject.addItem("My third item", new Date(), PRIORITY_MAX);

    return defaultProject.id;
}