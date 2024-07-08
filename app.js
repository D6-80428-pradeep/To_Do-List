document.addEventListener('DOMContentLoaded', function () {
    var taskTableBody = document.getElementById('taskTableBody');
    var newTaskNameInput = document.getElementById('newTaskNameInput');
    var newTaskDescInput = document.getElementById('newTaskDescInput');
    var addTaskBtn = document.getElementById('addTaskBtn');
    var searchInput = document.getElementById('searchInput');
    var currentPoints = document.getElementById('currentPoints');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var sortBtn = document.getElementById('sortBtn');
    var points = 0;
    var currentDate = new Date();
    function updateDateTime() {
        var now = new Date();
        var dateTimeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        document.getElementById('current-datetime').textContent = dateTimeStr;
    }
    function updateCurrentDateDisplay() {
        var dateStr = currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        document.getElementById('current-date').textContent = dateStr;
    }
    function formatDate(date) {
        return date.toLocaleDateString('en-GB');
    }
    function loadTasks() {
        var formattedDate = formatDate(currentDate);
        var tasks = JSON.parse(localStorage.getItem("tasks-".concat(formattedDate)) || '[]');
        taskTableBody.innerHTML = '';
        tasks.forEach(function (task) { return addTaskToDOM(task); });
        points = parseInt(localStorage.getItem('points') || '0');
        currentPoints.textContent = "Current Points: ".concat(points);
    }
    function saveTasks(tasks) {
        var formattedDate = formatDate(currentDate);
        localStorage.setItem("tasks-".concat(formattedDate), JSON.stringify(tasks));
    }
    function addTaskToDOM(task) {
        var tr = document.createElement('tr');
        tr.className = task.completed ? 'completed' : '';
        var tdName = document.createElement('td');
        tdName.textContent = task.name;
        tr.appendChild(tdName);
        var tdDesc = document.createElement('td');
        tdDesc.textContent = task.description;
        tr.appendChild(tdDesc);
        var tdActions = document.createElement('td');
        var completeBtn = document.createElement('button');
        completeBtn.className = 'btn btn-success btn-sm me-2';
        completeBtn.textContent = 'Complete';
        completeBtn.onclick = function () { return completeTask(task.name); };
        var editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning btn-sm me-2';
        editBtn.textContent = 'Edit';
        editBtn.onclick = function () { return editTask(task.name, task.description); };
        if (task.completed) {
            editBtn.disabled = true;
            completeBtn.disabled = true;
        }
        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function () { return deleteTask(task.name); };
        tdActions.appendChild(completeBtn);
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        taskTableBody.appendChild(tr);
    }
    function addTask(event) {
        event.preventDefault();
        var taskName = newTaskNameInput.value.trim();
        var taskDesc = newTaskDescInput.value.trim();
        if (!taskName || !taskDesc)
            return;
        var tasks = JSON.parse(localStorage.getItem("tasks-".concat(formatDate(currentDate))) || '[]');
        tasks.push({ name: taskName, description: taskDesc, completed: false });
        saveTasks(tasks);
        addTaskToDOM({ name: taskName, description: taskDesc, completed: false });
        newTaskNameInput.value = '';
        newTaskDescInput.value = '';
        newTaskNameInput.focus();
    }
    function completeTask(taskName) {
        var tasks = JSON.parse(localStorage.getItem("tasks-".concat(formatDate(currentDate))) || '[]');
        var task = tasks.find(function (task) { return task.name === taskName; });
        if (task && !task.completed) {
            task.completed = true;
            saveTasks(tasks);
            loadTasks();
            points++;
            localStorage.setItem('points', points.toString());
            currentPoints.textContent = "Current Points: ".concat(points);
        }
    }
    function editTask(taskName, taskDescription) {
        var newTaskName = prompt('Edit task name', taskName);
        var newTaskDesc = prompt('Edit task description', taskDescription);
        if (newTaskName && newTaskDesc) {
            var tasks = JSON.parse(localStorage.getItem("tasks-".concat(formatDate(currentDate))) || '[]');
            var task = tasks.find(function (task) { return task.name === taskName; });
            if (task) {
                task.name = newTaskName;
                task.description = newTaskDesc;
                saveTasks(tasks);
                loadTasks();
            }
        }
    }
    function deleteTask(taskName) {
        var tasks = JSON.parse(localStorage.getItem("tasks-".concat(formatDate(currentDate))) || '[]');
        var newTasks = tasks.filter(function (task) { return task.name !== taskName; });
        saveTasks(newTasks);
        loadTasks();
    }
    function searchTasks() {
        var searchText = searchInput.value.toLowerCase();
        var tasks = Array.from(taskTableBody.children);
        tasks.forEach(function (task) {
            var _a, _b;
            var taskText = ((_b = (_a = task.firstChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
            if (taskText.indexOf(searchText) !== -1) {
                task.style.display = 'table-row';
            }
            else {
                task.style.display = 'none';
            }
        });
    }
    function sortTasks() {
        var tasks = JSON.parse(localStorage.getItem("tasks-".concat(formatDate(currentDate))) || '[]');
        tasks.sort(function (a, b) { return a.name.localeCompare(b.name); });
        saveTasks(tasks);
        loadTasks();
    }
    function changeDate(days) {
        currentDate.setDate(currentDate.getDate() + days);
        updateCurrentDateDisplay();
        loadTasks();
    }
    setInterval(updateDateTime, 1000);
    updateCurrentDateDisplay();
    loadTasks();
    addTaskBtn.addEventListener('click', addTask);
    searchInput.addEventListener('input', searchTasks);
    prevBtn.addEventListener('click', function () { return changeDate(-1); });
    nextBtn.addEventListener('click', function () { return changeDate(1); });
    sortBtn.addEventListener('click', sortTasks);
});
