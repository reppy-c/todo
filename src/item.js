import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';
import { isPast, isToday } from 'date-fns';

function createItem(description, date, priority) {
    
    const id = Date.now() + Math.random().toString(36).substr(2, 9);

    // I like declaring functions this way for readbility
    // Afterwards need to return { functionName }
    function functionName() {

    }
    
    function toggleCompleted() {
        this.completed = !this.completed;
    }

    // Returns true if the due date is today or overdue for the TODAY inbox
    function isTodayOrOverdue() {
        return(isPast(date) || isToday(date));
    }

    // Returns true if its more than normal priority
    function isPriority() {
        if((priority == PRIORITY_HIGH) || (priority == PRIORITY_MAX))
            return(true);
    }

    return {id, description, date, priority, toggleCompleted, isTodayOrOverdue, isPriority};
}

export default createItem;