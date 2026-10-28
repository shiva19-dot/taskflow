
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskList = document.getElementById('task-list');

const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const pendingCount = document.getElementById('pending-count');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');

const dateElement = document.getElementById('today-date');

let tasks = [];
let currentFilter = 'All';

// Show today's date
dateElement.textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
});

// Communicate with the backend API
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
    }

    return data;
}

// Load tasks from MongoDB
async function loadTasks() {
    try {
        tasks = await apiRequest('/api/tasks');
        renderTasks();
    } catch (error) {
        console.error('Could not load tasks:', error);
        taskList.textContent =
            'Could not load tasks. Please check the server and MongoDB.';
    }
}

// Add a new task
taskForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (title === '') {
        alert('Please enter a task name.');
        return;
    }

    try {
        await apiRequest('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                category: taskCategory.value,
                priority: taskPriority.value
            })
        });

        taskTitle.value = '';
        taskCategory.value = 'Personal';
        taskPriority.value = 'Medium';

        await loadTasks();
    } catch (error) {
        alert('Could not add task: ' + error.message);
    }
});

// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === 'Pending') {
            return !task.completed;
        }

        if (currentFilter === 'Completed') {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';

        const heading = currentFilter === 'All'
            ? 'Your fresh start begins here'
            : 'No tasks found here';

        emptyState.innerHTML = `
            <div class="empty-icon">✦</div>
            <h3>${heading}</h3>
            <p>Add a task above or try another filter.</p>
        `;

        taskList.appendChild(emptyState);
    }

    filteredTasks.forEach(function (task) {
        const card = document.createElement('article');
        card.className = 'task-card';

        if (task.completed) {
            card.classList.add('completed');
        }

        const title = document.createElement('h3');
        title.textContent = task.title;

        const details = document.createElement('p');
        details.className = 'task-details';
        details.textContent =
            task.category + ' · ' + task.priority + ' priority';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Mark task completed');

        // Update completion status in MongoDB
        checkbox.addEventListener('change', async function () {
            try {
                await apiRequest('/api/tasks/' + task._id, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed: checkbox.checked
                    })
                });

                await loadTasks();
            } catch (error) {
                alert('Could not update task: ' + error.message);
                await loadTasks();
            }
        });

        const info = document.createElement('div');
        info.className = 'task-info';
        info.appendChild(title);
        info.appendChild(details);

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        // Edit a task
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';

        editButton.addEventListener('click', async function () {
            const newTitle = prompt('Edit your task:', task.title);

            if (newTitle === null) {
                return;
            }

            if (newTitle.trim() === '') {
                alert('Task name cannot be empty.');
                return;
            }

            try {
                await apiRequest('/api/tasks/' + task._id, {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: newTitle.trim()
                    })
                });

                await loadTasks();
            } catch (error) {
                alert('Could not edit task: ' + error.message);
            }
        });

        // Delete a task
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';

        deleteButton.addEventListener('click', async function () {
            const confirmed = confirm('Do you want to delete this task?');

            if (!confirmed) {
                return;
            }

            try {
                await apiRequest('/api/tasks/' + task._id, {
                    method: 'DELETE'
                });

                await loadTasks();
            } catch (error) {
                alert('Could not delete task: ' + error.message);
            }
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        const left = document.createElement('div');
        left.className = 'task-left';
        left.appendChild(checkbox);
        left.appendChild(info);

        card.appendChild(left);
        card.appendChild(actions);

        taskList.appendChild(card);
    });

    updateStats();
}

// Update statistics and progress bar
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;

    progressText.textContent = percentage + '%';
    progressBar.style.width = percentage + '%';
}

// Handle All, Pending, and Completed filters
const filterButtons = document.querySelectorAll('.filter');

filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (item) {
            item.classList.remove('active');
        });

        button.classList.add('active');

        renderTasks();
    });
});

// Load saved tasks when the page opens
loadTasks();
