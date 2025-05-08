
const addTaskBtn = document.getElementById('addTaskBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const taskInput = document.getElementById('task');
const sectionInputs = document.getElementById('tasksContainer');

let taskList = []

function saveTasksToLocalStorage() {
    localStorage.setItem('taskList', JSON.stringify(taskList));
}

function loadTasksFromLocalStorage() {
    const savedTask = JSON.parse(localStorage.getItem('taskList'));
    if (savedTask) {
        taskList = savedTask
        renderTasks()
    }
}
function createButton(text, className, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.classList.add(className);
    btn.addEventListener('click', onClick);
    return btn;
}

function renderTasks() {
    sectionInputs.textContent = '';


    taskList.forEach((task, index) => {
        const li = document.createElement('li')

        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.taskText;
        taskSpan.classList.add('taskText');

        const updateInput = document.createElement('input');
        updateInput.classList.add('updateInput');
        updateInput.type = 'hidden';

        const updateBtn = createButton(
            'Atualizar',
            'updateBtn',
            (ev) => {
                ev.preventDefault();
                editTask(index, taskSpan, updateInput, updateBtn);
            }
        );

        task.done ? taskSpan.style.textDecoration = 'line-through' : 'none';

        const completeBtn = createButton(
            task.done ? 'Desfazer' : 'Concluir',
            'completeBtn',
            (ev) => {
                ev.preventDefault();
                completeTask(index);
            }
        );

        const deleteBtn = createButton(
            'Excluir',
            'deleteBtn',
            (ev) => {
                ev.preventDefault();
                deleteTask(index);
            }
        );

        const actionDiv = document.createElement('div');
        actionDiv.classList.add('actionDiv');
        actionDiv.append(updateInput, updateBtn, completeBtn, deleteBtn);

        
        li.append(taskSpan, actionDiv);
        sectionInputs.appendChild(li);


    });
}

function capitalizarTexto(texto) {
    return texto
        .toLowerCase()
        .replace(/\b\w/g, letra => letra.toUpperCase());
}

function addTask(taskText) {
    const taskTrim = taskText.trim();
    if (taskTrim === '') {
        return alert('Preencha o campo de texto!');
    } else {
        const textoCapitalizado = capitalizarTexto(taskTrim);
        taskList.push({ taskText: textoCapitalizado, done: false });
        saveTasksToLocalStorage();
        renderTasks();
    }
}

function editTask(index, taskSpan, updateInput, updateBtn) {
    if (updateBtn.textContent === 'Atualizar') {
        updateInput.value = taskSpan.textContent;
        updateInput.type = 'text';
        taskSpan.classList.add('hidden');
        updateInput.classList.add('updateInput', 'active');
        updateInput.focus();
        updateInput.setSelectionRange(updateInput.value.length, updateInput.value.length);
        updateBtn.textContent = 'Salvar';
    } else {
        const updateText = capitalizarTexto(updateInput.value.trim());
        if (updateText === '') return alert('Texto não pode estar vazio!');
        taskList[index].taskText = updateText;
        updateInput.type = 'hidden';
        saveTasksToLocalStorage();
        taskSpan.textContent = updateText;
        updateInput.classList.remove('active');
        taskSpan.classList.remove('hidden');
        updateBtn.textContent = 'Atualizar';
    }
}
function completeTask(index) {
    taskList[index].done = !taskList[index].done;
    saveTasksToLocalStorage()
    renderTasks()
}

function deleteTask(index) {
    taskList.splice(index, 1);
    saveTasksToLocalStorage()
    renderTasks()
}

clearAllBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    taskList = [];
    saveTasksToLocalStorage();
    renderTasks();
});

document.querySelector(".taskForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';
});

loadTasksFromLocalStorage()
