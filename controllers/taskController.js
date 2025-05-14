const taskModel = require("../models/taskModel")

const taskController = {
    // GET/ → Listar todas as tarefas (index)
    index: (req, res) => {
        const tasks = taskModel.getAllTasks()
        res.render("index", { tasks })
    },
    // GET /:id      → Mostrar uma tarefa específica (show)
    show: (req, res) => {
        const {id} = req.params
        if(!id) throw new Error("Lista de tarefas não encontrada")
            const tasks = taskModel.getTaskById(id)
        res.render("show", { tasks })
    },
    // POST/        → Criar nova tarefa (create)
    create: (req, res) =>{
        const {title} = req.body
        const newTask = taskModel.createTask(title)
        taskModel.saveTasks(newTask)
        res.redirect("/")
    },
    // PUT /:id      → Atualizar uma tarefa existente (update)
    update: (req, res) => {
        const {id} = req.params
        const {title} = req.body
        const task = taskModel.getTaskById(id)
        if(!task) throw new Error("Tarefa não encontrada")
        taskModel.updateTask(id, title)
    },
    // DELETE /:id   → Excluir uma tarefa (delete)
    delete: (req, res) => {
        const {id} = req.params
        const task = taskModel.getTaskById(id)
        if(!task) throw new Error("Tarefa não encontrada")
        taskModel.deleteTask(id)
    }
}

module.exports = taskController