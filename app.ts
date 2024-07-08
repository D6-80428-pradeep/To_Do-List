document.addEventListener('DOMContentLoaded', () => {
    const taskTableBody = document.getElementById('taskTableBody') as HTMLTableSectionElement;
    const newTaskNameInput = document.getElementById('newTaskNameInput') as HTMLInputElement;
    const newTaskDescInput = document.getElementById('newTaskDescInput') as HTMLInputElement;
    const addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const currentPoints = document.getElementById('currentPoints') as HTMLDivElement;
    const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
    const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
    const sortBtn = document.getElementById('sortBtn') as HTMLButtonElement;
    let points = 0;
    let currentDate = new Date();

    interface Task {
        name: string;
        description: string;
        completed: boolean;
    }

    function updateDateTime(): void {
        const now = new Date();
        const dateTimeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        document.getElementById('current-datetime')!.textContent = dateTimeStr;
    }

    function updateCurrentDateDisplay(): void {
        const dateStr = currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        document.getElementById('current-date')!.textContent = dateStr;
    }

    function formatDate(date: Date): string {
        return date.toLocaleDateString('en-GB');
    }

    function loadTasks(): void {
        const formattedDate = formatDate(currentDate);
        const tasks: Task[] = JSON.parse(localStorage.getItem(`tasks-${formattedDate}`) || '[]');
        taskTableBody.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task));
        points = parseInt(localStorage.getItem('points') || '0');
        currentPoints.textContent = `Current Points: ${points}`;
    }

    function saveTasks(tasks: Task[]): void {
        const formattedDate = formatDate(currentDate);
        localStorage.setItem(`tasks-${formattedDate}`, JSON.stringify(tasks));
    }

    function addTaskToDOM(task: Task): void {
        const tr = document.createElement('tr');
        tr.className = task.completed ? 'completed' : '';

        const tdName = document.createElement('td');
        tdName.textContent = task.name;
        tr.appendChild(tdName);

        const tdDesc = document.createElement('td');
        tdDesc.textContent = task.description;
        tr.appendChild(tdDesc);

        const tdActions = document.createElement('td');
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn btn-success btn-sm me-2';
        completeBtn.textContent = 'Complete';
        completeBtn.onclick = () => completeTask(task.name);

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning btn-sm me-2';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTask(task.name, task.description);
        if (task.completed) {
            editBtn.disabled = true;
            completeBtn.disabled = true;
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.name);

        tdActions.appendChild(completeBtn);
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);

        tr.appendChild(tdActions);
        taskTableBody.appendChild(tr);
    }

    function addTask(event: Event): void {
        event.preventDefault();
        const taskName = newTaskNameInput.value.trim();
        const taskDesc = newTaskDescInput.value.trim();
        if (!taskName || !taskDesc) return;

        const tasks: Task[] = JSON.parse(localStorage.getItem(`tasks-${formatDate(currentDate)}`) || '[]');
        tasks.push({ name: taskName, description: taskDesc, completed: false });
        saveTasks(tasks);
        addTaskToDOM({ name: taskName, description: taskDesc, completed: false });
        newTaskNameInput.value = '';
        newTaskDescInput.value = '';
        newTaskNameInput.focus();
    }

    function completeTask(taskName: string): void {
        const tasks: Task[] = JSON.parse(localStorage.getItem(`tasks-${formatDate(currentDate)}`) || '[]');
        const task = tasks.find(task => task.name === taskName);
        if (task && !task.completed) {
            task.completed = true;
            saveTasks(tasks);
            loadTasks();
            points++;
            localStorage.setItem('points', points.toString());
            currentPoints.textContent = `Current Points: ${points}`;
        }
    }

    function editTask(taskName: string, taskDescription: string): void {
        const newTaskName = prompt('Edit task name', taskName);
        const newTaskDesc = prompt('Edit task description', taskDescription);
        if (newTaskName && newTaskDesc) {
            const tasks: Task[] = JSON.parse(localStorage.getItem(`tasks-${formatDate(currentDate)}`) || '[]');
            const task = tasks.find(task => task.name === taskName);
            if (task) {
                task.name = newTaskName;
                task.description = newTaskDesc;
                saveTasks(tasks);
                loadTasks();
            }
        }
    }

    function deleteTask(taskName: string): void {
        const tasks: Task[] = JSON.parse(localStorage.getItem(`tasks-${formatDate(currentDate)}`) || '[]');
        const newTasks = tasks.filter(task => task.name !== taskName);
        saveTasks(newTasks);
        loadTasks();
    }

    function searchTasks(): void {
        const searchText = searchInput.value.toLowerCase();
        const tasks = Array.from(taskTableBody.children) as HTMLTableRowElement[];
        tasks.forEach(task => {
            const taskText = task.firstChild?.textContent?.toLowerCase() || '';
            if (taskText.indexOf(searchText) !== -1) {
                task.style.display = 'table-row';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function sortTasks(): void {
        const tasks: Task[] = JSON.parse(localStorage.getItem(`tasks-${formatDate(currentDate)}`) || '[]');
        tasks.sort((a, b) => a.name.localeCompare(b.name));
        saveTasks(tasks);
        loadTasks();
    }

    function changeDate(days: number): void {
        currentDate.setDate(currentDate.getDate() + days);
        updateCurrentDateDisplay();
        loadTasks();
    }

    setInterval(updateDateTime, 1000);
    updateCurrentDateDisplay();
    loadTasks();
    addTaskBtn.addEventListener('click', addTask);
    searchInput.addEventListener('input', searchTasks);
    prevBtn.addEventListener('click', () => changeDate(-1));
    nextBtn.addEventListener('click', () => changeDate(1));
    sortBtn.addEventListener('click', sortTasks);
});
