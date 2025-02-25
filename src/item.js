// Named constants
const COMPLETE = true;
const INCOMPLETE = false;
const PRIORITY_NORMAL = "normal";
const PRIORITY_HIGH = "high";
const PRIORITY_VERYHIGH = "very high";

function createItem(title, description, date, priority) {
    return {
        title,
        description,
        date,
        priority,
        completed: INCOMPLETE,

        toggleCompleted() {
            this.completed = !this.completed;
        }
    };
}

export default createItem;