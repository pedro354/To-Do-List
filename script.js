
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('task');
const sectionInputs = document.getElementById('sectionInputs');

let taskList = []

function saveTasksToLocalStorage()	{
    localStorage.setItem('taskList', JSON.stringify(taskList));
}    

function loadTasksFromLocalStorage(){
        console.log('Load button clicked');
        const savedTask = JSON.parse(localStorage.getItem('taskList'));
        console.log(savedTask);
        if(savedTask){
            taskList = savedTask
            renderTasks()
        }
}

function renderTasks() {
    sectionInputs.textContent = ''

    taskList.forEach((task, index) => {
    const li = document.createElement('li')

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.taskText;
    taskSpan.id = 'taskSpan'
    taskSpan.classList.add('taskText');
    
    const updateInput = document.createElement('input');
    updateInput.id = 'updateInput';
    updateInput.style.display = 'none';
    updateInput.type = 'text';


    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Atualizar';
    updateBtn.id = 'updateBtn';
    updateBtn.addEventListener('click', (ev) =>{
        ev.preventDefault();
        editTask(index, taskSpan, updateInput, updateBtn);
    })
    if (task.done) {
        taskSpan.style.textDecoration = 'line-through';
        updateBtn.style.display = 'none';
    } else {
        updateBtn.style.display = 'inline';
    }
    
    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Concluir';
    completeBtn.id = 'completeBtn';
    completeBtn.addEventListener('click', (ev) =>{
        ev.preventDefault();
        completeTask(index)
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.id = 'deleteBtn';

    deleteBtn.addEventListener('click', (ev) =>{
        ev.preventDefault();
        deleteTask(index)
        
    });  
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('actionDiv');
    actionDiv.append(updateInput, updateBtn, completeBtn,deleteBtn);
  
    li.append(taskSpan, actionDiv);
    sectionInputs.appendChild(li);
});
}

function addTask(taskText){
    const taskTrim = taskText.trim();
    if(taskTrim === '') {
        saveTasksToLocalStorage()
        renderTasks()
        return alert('Preencha o campo de texto!');
    } else {
        taskList.push({taskText: taskInput.value, done: false});
        saveTasksToLocalStorage()
        renderTasks()
    }
}

function editTask(index, taskSpan, updateInput, updateBtn) {

    if(updateBtn.textContent === 'Atualizar') {
        updateInput.value = taskSpan.textContent;
        taskSpan.style.display = 'none';
        updateInput.style.display = 'inline';
        updateInput.style.width = '100px';
        updateBtn.textContent = 'Salvar';
    } else {
        const updateText = updateInput.value;
        taskList[index].taskText = updateText;
        saveTasksToLocalStorage()
        taskSpan.textContent = updateText;
        updateInput.style.display = 'none';
        taskSpan.style.display = 'inline';
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


addTaskBtn.addEventListener('click', (ev) => {
    console.log('Button clicked');
    ev.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';

});



loadTasksFromLocalStorage()
