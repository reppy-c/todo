import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';

function createItem(description, date, priority) {
    
    const id = Date.now() + Math.random().toString(36).substr(2, 9);

    // I like declaring functions this way for readbility
    // Afterwards need to return { functionName }
    function functionName() {

    }
    
    function toggleCompleted() {
        this.completed = !this.completed;
    }

    return {id, description, date, priority, toggleCompleted};
}

export default createItem;