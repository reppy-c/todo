// This file will manage the projects so that the controller can focus on the DOM manipulation. Eventually it will make use of local storage.

import { INBOX_EVERYTHING, INBOX_TODAY, INBOX_PRIORITY, TYPE_INBOX, TYPE_PROJECT, PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX, SORT_PRIORITY, SORT_DATE, SORT_NAME } from './utils/constants.js';
import createProject from "./project";
import createItem from "./item.js";
import { addDays, isBefore } from 'date-fns';


let projects = [];

export function addProject(name) {
    const newProject= createProject(name);
    projects.push(newProject)

    return newProject;
}

// This is the main function that will return items for
// If it's a project, then return the items from the project
// If it's an inbox, then return all relevant items from all projects
export function getItems(type, id, sort = SORT_PRIORITY) {

    let itemArray = [];

    switch (type) {
        case TYPE_INBOX:
            
            // If it's an inbox, the id will be the id of the inbox 
            switch(id) {
                case INBOX_EVERYTHING:

                    // Loop through every project and concat every item array
                    projects.forEach((proj) => {
                        // Loop through and add every item that is due today or earlier
                        // Adding the project name to this temp structure so we don't need to store it within the item
                        proj.getItems().forEach((todo) => {
                            todo.projectName = proj.name;                    
                            itemArray.push(todo);
                        });
                    });
                break;

                case INBOX_TODAY:
                    // Loop through every project
                    projects.forEach((proj) => {
                        // Loop through every item and add every item that is due today or earlier
                        proj.getItems().forEach((todo) => {

                            if(todo.isTodayOrOverdue()) {
                                todo.projectName = proj.name;                          
                                itemArray.push(todo);
                            }
                        });
                    });
                break;

                case INBOX_PRIORITY:
                    // Loop through every project
                    projects.forEach((proj) => {
                        // Loop through every item and add every item that is due today or earlier
                        proj.getItems().forEach((todo) => {
                            if(todo.isPriority()) {     
                                todo.projectName = proj.name;                
                                itemArray.push(todo);
                            }
                        });
                    });
                break;
            }
        break;

        case TYPE_PROJECT: 
            let project = projects.find(project => project.id === id);

            itemArray = project.getItems();
        break;
    }

    switch(sort) {
        case SORT_PRIORITY:
            itemArray.sort((a, b) => {
                if (a.priority > b.priority) {
                  return -1;
                }
                if (a.priority < b.priority) {
                  return 1;
                }
                // priority must be equal
                return 0;
              });
        break;

        case SORT_DATE:
            itemArray.sort((a, b) => {

                if(a.date == null) {
                    return 1;
                }
                if (isBefore(a.date, b.date)) {
                  return -1;
                }
                if (isBefore(b.date, a.date)) {
                  return 1;
                }
                // dates must be equal
                return 0;
              });
        break;

        case SORT_NAME:
            itemArray.sort((a, b) => {
                const nameA = a.description.toUpperCase(); // ignore upper and lowercase
                const nameB = b.description.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                // names must be equal
                return 0;
              });
        break;
    }

    return itemArray;
}

export function getProjects() {
    return projects;
}

export function getProject(id) {
    return projects.find(project => project.id === id);
}

// Return the ID of an item's project
export function getItemProject(id) {
    const project = projects.find(proj => proj.getItems().some(item => item.id === id));

    if (project) {
        return project.id;
    } else {
        return null; // or handle it in another appropriate way
    }
}

export function initializeProjects() {
    const defaultProject = addProject("Default Project");

    defaultProject.addItem("My first item", addDays(new Date(),-1), PRIORITY_NORMAL);
    defaultProject.addItem("My second item", addDays(new Date(),2), PRIORITY_HIGH);
    defaultProject.addItem("My third item", new Date(), PRIORITY_MAX);

    return defaultProject.id;
}