// This file will manage the projects so that the controller can focus on the DOM manipulation. Eventually it will make use of local storage.

import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';
import createProject from "./project";

let projects = [];

export function addProject(name) {
    const newProject= createProject(name);
    projects.push(newProject)

    return newProject;
}

export function getProjects() {
    return projects;
}

export function initializeProjects() {
    const defaultProject = addProject("New Project");

    defaultProject.addItem("My first item", new Date(), PRIORITY_NORMAL);
    defaultProject.addItem("My second item", new Date(), PRIORITY_HIGH);
    defaultProject.addItem("My third item", new Date(), PRIORITY_MAX);

    return defaultProject;
}