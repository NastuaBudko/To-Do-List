const input = document.querySelector('.new_task_text');
const list = document.querySelector('.in_progress_task_list_container');
const completedList = document.querySelector('.completed_task_list_container');
const taskListContainer = document.querySelector('.task');
const button = document.querySelector('.button');
const tasksInProgressText = document.querySelector('.task_list_in_progress_text');
const allTasksTab = document.getElementById('tab-btn-1');
const inProgressTab = document.getElementById('tab-btn-2');
const completedTab = document.getElementById('tab-btn-3');
const noTasksMessage = document.querySelector('.no_task_message');

function createTask() {
    checkEmptyLists()
    if (input.value) {
        const taskContainer = document.createElement('div');
        const li = document.createElement('div');
        const markDoneContainer = document.createElement('div');
        const deleteTask = document.createElement('div');

        if (document.querySelector('.task_list_in_progress_text')) {
        } else {
            const tasksInProgressText = document.createElement('div');
            tasksInProgressText.classList.add('task_list_in_progress_text');
            tasksInProgressText.innerHTML = 'Tasks in progress'
            list.appendChild(tasksInProgressText);
        }

        taskContainer.classList.add('task_container');
        li.classList.add('task_name');
        markDoneContainer.classList.add('mark_done_container')
        deleteTask.classList.add('delete_task')
        if (input.value.trim() == "") {
            input.value = 'Task'
        }
        const newTask = input.value
        li.append(newTask);

        list.appendChild(taskContainer);
        taskContainer.appendChild(markDoneContainer);
        taskContainer.appendChild(li);
        taskContainer.appendChild(deleteTask);

        input.value = "";

        markDoneContainer.addEventListener('click', function () {
            if (markDoneContainer.classList.contains('active')) {
                markDoneContainer.classList.remove('active');
                taskContainer.classList.remove('done');
                moveTaskToInProgress(taskContainer);
            } else {
                markDoneContainer.classList.add('active');
                taskContainer.classList.add('done');
                moveTaskToCompleted(taskContainer);
            }
            checkEmptyLists();
            saveTasks();
        });


        deleteTask.addEventListener('click', function () {
            taskContainer.remove();
            checkEmptyLists();
            saveTasks();
        });
        checkEmptyLists()

    }
}

function moveTaskToCompleted(taskContainer) {
    if (!document.querySelector('.task_list_completed_text')) {
        const tasksCompletedText = document.createElement('div');
        tasksCompletedText.classList.add('task_list_completed_text');
        tasksCompletedText.innerHTML = 'Completed tasks'
        completedList.appendChild(tasksCompletedText);
    }

    completedList.appendChild(taskContainer);
}

function moveTaskToInProgress(taskContainer) {
    if (!document.querySelector('.task_list_in_progress_text')) {
        const tasksInProgressText = document.createElement('div');
        tasksInProgressText.classList.add('task_list_in_progress_text');
        tasksInProgressText.innerHTML = 'Tasks in progress'
        list.appendChild(tasksInProgressText);
    }

    list.appendChild(taskContainer);

}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task_container').forEach(taskContainer => {
        const task = {
            name: taskContainer.querySelector('.task_name').innerText,
            done: taskContainer.classList.contains('done'),
            markDoneActive: taskContainer.querySelector('.mark_done_container').classList.contains('active'),
            deleteTaskHTML: taskContainer.querySelector('.delete_task').outerHTML
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => {
            const taskContainer = document.createElement('div');
            taskContainer.classList.add('task_container');
            const li = document.createElement('div');
            li.classList.add('task_name');
            li.innerText = task.name;
            taskContainer.appendChild(li);
            if (task.done) {
                taskContainer.classList.add('done');
            }
            if (task.done && !document.querySelector('.task_list_completed_text')) {
                const tasksCompletedText = document.createElement('div');
                tasksCompletedText.classList.add('task_list_completed_text');
                tasksCompletedText.innerHTML = 'Completed tasks';
                completedList.appendChild(tasksCompletedText);
            }
            if (!task.done && !document.querySelector('.task_list_in_progress_text')) {
                const tasksInProgressText = document.createElement('div');
                tasksInProgressText.classList.add('task_list_in_progress_text');
                tasksInProgressText.innerHTML = 'Tasks in progress';
                list.appendChild(tasksInProgressText);
            }
            if (task.done) {
                completedList.appendChild(taskContainer);
            } else {
                list.appendChild(taskContainer);
            }

            const markDoneContainer = document.createElement('div');
            markDoneContainer.classList.add('mark_done_container');
            if (task.markDoneActive) {
                markDoneContainer.classList.add('active');
            }
            markDoneContainer.addEventListener('click', function () {
                if (markDoneContainer.classList.contains('active')) {
                    markDoneContainer.classList.remove('active');
                    taskContainer.classList.remove('done');
                    moveTaskToInProgress(taskContainer);
                } else {
                    markDoneContainer.classList.add('active');
                    taskContainer.classList.add('done');
                    moveTaskToCompleted(taskContainer);
                }
                checkEmptyLists();
                saveTasks();

            });

            taskContainer.appendChild(markDoneContainer);

            const deleteTask = document.createElement('div');
            deleteTask.classList.add('delete_task');
            deleteTask.addEventListener('click', function () {
                taskContainer.remove();
                checkEmptyLists();
                saveTasks();
            });
            taskContainer.appendChild(deleteTask);

        });
    }
    checkEmptyLists();
}



window.addEventListener('load', loadTasks);

input.addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
        createTask();
        saveTasks();
    }
})

button.addEventListener('click', function () {
    createTask();
    saveTasks();
});

allTasksTab.addEventListener('change', function () {
    list.style.display = 'block';
    completedList.style.display = 'block';
});

inProgressTab.addEventListener('change', function () {
    list.style.display = 'block';
    completedList.style.display = 'none';
});

completedTab.addEventListener('change', function () {
    list.style.display = 'none';
    completedList.style.display = 'block';
});

function checkEmptyLists() {
    const tasksInProgressText = document.querySelector('.task_list_in_progress_text');
    const taskCompletedText = document.querySelector('.task_list_completed_text');


    if (tasksInProgressText && list.childElementCount === 1) {
        tasksInProgressText.style.display = 'none';
        noTasksMessage.style.display = 'block';
    } else if (tasksInProgressText) {
        tasksInProgressText.style.display = 'block';
        noTasksMessage.style.display = 'none';
    }

    if (taskCompletedText && completedList.childElementCount === 1) {
        taskCompletedText.style.display = 'none';
    } else if (taskCompletedText) {
        taskCompletedText.style.display = 'block';
    }
}

