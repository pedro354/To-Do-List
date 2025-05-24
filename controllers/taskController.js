const taskModel = require("../models/taskModel")

const taskController = {
    // GET/ → Listar todas as tarefas (index)
    index: (req, res) => {
        const tasks = taskModel.getAllTasks()
        res.json(tasks)
    },
    // GET /:id      → Mostrar uma tarefa específica (show)
    show: (req, res) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: "ID não informado" });

        const task = taskModel.getTaskById(id);
        if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });

        res.json(task);
    },
    // POST /api/task        → Criar nova tarefa (create)
    create: (req, res) => {
        const { title, done } = req.body
        if (!title) return res.status(400).json({ message: "Título é obrigatório" });
        const newTask = taskModel.createTask(title, done ?? false)
        res.status(201).json(newTask)
    },

    // PUT /:id      → Atualizar uma tarefa existente (update)
    update: (req, res) => {
        const { id } = req.params;
        const { title, done } = req.body;

        if (!id) return res.status(400).json({ message: "ID não informado" });
        if (!title) return res.status(400).json({ message: "Título não informado" });

        const task = taskModel.getTaskById(id);
        if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });

        const updatedTask = taskModel.updateTask(id, {title, done});
        return res.status(200).json(updatedTask);
    },
    // DELETE /:id   → Excluir uma tarefa (delete)
    delete: (req, res) => {
        const id = req.params.id
        console.log('ID recebido para exclusão:', req.params.id);
        console.log('Tarefas atuais:', taskModel.getAllTasks());

        const deletedTask = taskModel.getTaskById(id)
        if (!deletedTask) return res.status(404).json({ message: "Tarefa não encontrada" });

        taskModel.deleteTask(id)
        return res.status(200).json(deletedTask);
    },
    deletedAllTasks: (req, res) => {
        taskModel.saveTasks([])
        res.status(200).json({ message: "Todas as tarefas foram excluídas com sucesso" });
    }
    
}

module.exports = taskController