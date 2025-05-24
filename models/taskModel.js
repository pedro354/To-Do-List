const fs = require('node:fs');

fs.existsSync("data/tasks.json") ? console.log("File exists") : console.log("File does not exist");

const taskModel = {
    getAllTasks() {
        try {
            const tasks = fs.readFileSync("data/tasks.json", "utf-8")
            return JSON.parse(tasks || "[]");

        } catch (error) {
            console.error("Erro ao ler tarefa:", error);
            return [];
        }
    },
    getTaskById(id) {
        const tasks = this.getAllTasks();
        return tasks.find(task => task.id === id);
    },
    createTask(title, done = false) {
        const tasks = this.getAllTasks();
        const newTask = {
            id: Date.now().toString(),
            title,
            done,
        }
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    },
    saveTasks(taskBd) {
        fs.writeFileSync("data/tasks.json", JSON.stringify(taskBd, null, 2));

    },
    updateTask(id, updatedData) {
        const tasks = this.getAllTasks();
        const task = tasks.find(task => task.id === id);
        if (!task) {
            console.log("Task not found");
            return null;
        }
        Object.assign(task, updatedData);
        this.saveTasks(tasks);
        return task;
    },
    deleteTask(id) {
        const tasks = this.getAllTasks();
        const taskToDelete = tasks.find(task => task.id === id);
        if (!taskToDelete) return null;

        const updatedTasks = tasks.filter(task => task.id !== id);
        this.saveTasks(updatedTasks);
        return taskToDelete;
    },

}
module.exports = taskModel;
