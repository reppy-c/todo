import { PRIORITY_NORMAL, PRIORITY_HIGH, PRIORITY_MAX } from './utils/constants.js';
import { endOfYesterday, isBefore, isPast, isToday } from 'date-fns';

function createItem(description, date, priority) {
    
    const id = Date.now() + Math.random().toString(36).substr(2, 9);

    // I like declaring functions this way for readbility
    // Afterwards need to return { functionName }
    function functionName() {

    }
    
    function toggleCompleted() {
        this.completed = !this.completed;
    }

    // Returns true if due date is today or overdue
    function isTodayOrOverdue() {
        return(isPast(date) || isToday(date));
    }

    // Returns true if due date is before the end of yesterday
    function isOverdue() {
        return(isBefore(date, endOfYesterday()));
    }

    // Returns true if its more than normal priority
    function isPriority() {
        if((priority == PRIORITY_HIGH) || (priority == PRIORITY_MAX))
            return(true);
    }

    return {id, description, date, priority, toggleCompleted, isTodayOrOverdue, isOverdue, isPriority};
}

export default createItem;