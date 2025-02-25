function createTodoItem(title, description) {
    return {
        title,
        description,
        completed: false,
        toggleCompleted() {
            this.completed = !this.completed;
        }
    };
}

export default createTodoItem;