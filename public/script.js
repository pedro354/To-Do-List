
const addTaskBtn = document.getElementById('addTaskBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const taskInput = document.getElementById('task');
const sectionInputs = document.getElementById('tasksContainer');

let taskList = [];
function showLoading(message) {
    const loading = document.getElementById('loading');
    loading.textContent = message;
    loading.style.display = 'block';

}

function hideLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

}

function showError(mensagem) {
    const container = document.getElementById("error-container");
    container.textContent = mensagem;
    container.style.display = "block";
}
function showEmptyMessage(message) {
    const empty = document.getElementById('empty');
    empty.textContent = message;
    empty.style.display = 'block';
}

function hideEmptyMessage() {
    const empty = document.getElementById('empty');
    empty.style.display = 'none';
}

async function loadTaskFromBackEnd() {
    showLoading("Carregando listas de tarefas");

    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        const data = await response.json();
        taskList = data;
        if(taskList.length === 0) {
            setTimeout(() => {
                showLoading(),
                hideLoading()
                showEmptyMessage('Nenhuma tarefa encontrada!')
            }, 1000);
        }else{
            setTimeout(() => {
                hideLoading();
                renderTasks();
            }, 1000);
        }
    } catch (error) {
        console.error('Erro ao carregar as tarefas!', error);
        showError('Erro ao carregar as tarefas!');
    }
    console.log(taskList)
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

    taskList.forEach((task) => {

        const li = document.createElement('li')
        li.classList.add('fade-in');

        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.title;
        taskSpan.classList.add('title');

        requestAnimationFrame(() => {
            li.classList.add('loaded');
        });


        const updateInput = document.createElement('input');
        updateInput.classList.add('updateInput');
        updateInput.type = 'hidden';

        const updateBtn = createButton(
            'Atualizar',
            'updateBtn',
            (ev) => {
                ev.preventDefault();
                if (updateInput.type === 'hidden') {
                    updateInput.type = 'text';
                    updateInput.value = task.title;
                    updateInput.classList.add('active');
                    taskSpan.classList.add('hidden');
                    updateBtn.textContent = 'Salvar';
                    updateInput.focus()
                    updateInput.setSelectionRange(updateInput.value.length, updateInput.value.length);
                } else {

                    updateTask(task, taskSpan, updateInput, updateBtn);

                }
            }

        );

        const completeBtn = createButton(
            task.done ? 'Desfazer' : 'Concluir',
            'completeBtn',
            (ev) => {
                ev.preventDefault();
                completeTask(task, taskSpan, completeBtn);
            }
        );

        const deleteBtn = createButton(
            'Excluir',
            'deleteBtn',
            (ev) => {
                ev.preventDefault();
                deleteTask(task.id, task);
            }
        );

        const actionDiv = document.createElement('div');
        actionDiv.classList.add('actionDiv');
        actionDiv.append(updateInput, updateBtn, completeBtn, deleteBtn);


        li.append(taskSpan, actionDiv);
        sectionInputs.appendChild(li);


    });
}

function capitalizarTexto(text) {
    return text
        .toLowerCase()
        .replace(/\b\w/g, letra => letra.toUpperCase());
}
async function addTask(title) {
    showLoading("Nova Tarefa Adicionada!");

    const taskTrim = title.trim();
    if (taskTrim === '') {
        return alert('Preencha o campo de texto!');
    }
    const textoCapitalizado = capitalizarTexto(taskTrim);
    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: textoCapitalizado, done: false })
        })
        if (!response.ok) {
            throw new Error('Erro ao salvar a tarefa!');
        }
        const savedTask = await response.json();
        taskList.push(savedTask);
        setTimeout(() => {
            showLoading(),
                hideLoading()
            renderTasks()
        }, 1000);
        taskInput.value = '';
        console.log(savedTask)
        console.log(taskList);

    } catch (error) {
        console.error('Erro ao salvar a tarefa!', error);
        alert('Erro ao salvar a tarefa!');

    }
}

async function updateTask(task, taskSpan, updateInput, updateBtn) {
    showLoading('Tarefa atualizada com sucesso!');
    try {
        const textoCapitalizado = capitalizarTexto(updateInput.value.trim());
        if (!textoCapitalizado) return;
        const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: textoCapitalizado })
        })

        if (!response.ok) {
            throw new Error('Erro ao atualizar a tarefa!');
        }

        const updatedTask = (await response.json())[0];


        // Atualiza UI
        task.title = textoCapitalizado;
        taskSpan.textContent = textoCapitalizado;
        Object.assign(task, updatedTask)
        updateInput.type = 'hidden';
        updateInput.classList.remove('active');
        taskSpan.classList.remove('hidden');
        updateBtn.textContent = 'Atualizar';

    } catch (error) {
        console.error('Erro ao atualizar a tarefa!', error);
        alert('Erro ao atualizar a tarefa!');
    }
}
async function completeTask(task, taskSpan, completeBtn) {
    showLoading('Tarefa concluída com sucesso!');
    try {
        const status = !task.done;
        task.done = status;
        const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: task.title, done: status })
        });

        const completedTask = (await response.json())[0];

        Object.assign(task, completedTask);

        taskSpan.classList.toggle('line-through', task.done);
        completeBtn.textContent = task.done ? 'Desfazer' : 'Concluir';

    } catch (error) {
        console.error('Erro ao atualizar a tarefa!', error);
        alert('Erro ao atualizar a tarefa!');
    }
}

async function deleteTask(id) {

    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir a tarefa!');
        }

        const index = taskList.findIndex((t) => t.id === id);
        if (index !== -1) {
            taskList.splice(index, 1);
        }
        renderTasks();
    } catch (error) {
        console.error('Erro ao excluir a tarefa!', error);
        alert('Erro ao excluir a tarefa!');
    }
}


clearAllBtn.addEventListener('click', async (ev) => {
    ev.preventDefault();
    await fetch('http://localhost:3000/api/tasks', {
        method: 'DELETE',
    });
    taskList = [];
    renderTasks();
});

document.querySelector(".taskForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';
});


loadTaskFromBackEnd();
