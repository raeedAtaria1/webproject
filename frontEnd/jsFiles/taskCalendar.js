
const role = localStorage.getItem('role');

// Sample tasks for demonstration
let tasks = {
    '2023-06-17': ['Task 1', 'Task 2'],
    '2023-06-20': ['Task 3', 'Task 4'],
    '2023-06-24': ['Task 5'],
    // Add more tasks here...
};

async function fetchTasks() {
    try {
    const userEmail = localStorage.getItem('email');
    let response;
    console.log(role);


    if(role=="admin"){
         response = await fetch('/tasksAdmin', {
            headers: {
              'email': userEmail
            }
          });
    }
    else{
        response = await fetch('/tasks', {
            headers: {
            'email': userEmail
            }
        });

    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasksBeforeHandling = await response.json();
    let ongoingTasks = {};
    tasksBeforeHandling.forEach(task => {
        if (task.status === 'Ongoing') {
        let dueDate = task.dueDate.split('T')[0]; // Extract date part only
        let taskName = task.name;
        console.log(taskName);
        if (dueDate in ongoingTasks) {
            ongoingTasks[dueDate].push(taskName);
        } else {
            ongoingTasks[dueDate] = [taskName];
        }
        }
    });
    console.log(ongoingTasks);
    tasks = ongoingTasks;
    } catch (error) {
    console.error('An error occurred:', error);
    }
}
fetchTasks();

const calendarBody = document.getElementById('calendar-body');
const monthSelect = document.getElementById('month');
const yearInput = document.getElementById('year');
const taskModal = document.getElementById('task-modal');

let currentMonth;
let currentYear;

function generateCalendar(month, year) {
    // Clear previous calendar
    calendarBody.innerHTML = '';

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const startDay = startDate.getDay();
    const daysInMonth = endDate.getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
        const cell = document.createElement('td');
        row.appendChild(cell);
        } else if (date > daysInMonth) {
        break;
        } else {
        const cell = document.createElement('td');
        cell.innerText = date;

        if (year === currentYear && month === currentMonth && date === today.getDate()) {
            cell.classList.add('fw-bold'); // Highlight today's date
        }

        cell.addEventListener('click', showTasks);
        row.appendChild(cell);
        date++;
        }
    }

    calendarBody.appendChild(row);
    }
}
document.getElementById("homeLink").addEventListener("click", goHome);
function goHome() {
    if (role === 'admin') {
    // Redirect to the admin page
    window.location.href = "/managerHomePage.html";
} else {
    // Redirect to the user page
    window.location.href = "/userHomePage.html";
}
}
function showTasks(event) {
    const clickedDate = event.target.innerText;
    const clickedMonth = currentMonth;
    const clickedYear = currentYear;

    const dateKey = `${clickedYear}-${String(clickedMonth + 1).padStart(2, '0')}-${String(clickedDate).padStart(2, '0')}`;
    const tasksForDate = tasks[dateKey] || [];

    const taskDate = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');

    taskDate.innerText = `${clickedDate}/${clickedMonth + 1}/${clickedYear}`;
    taskList.innerHTML = '';

    if (tasksForDate.length > 0) {
    tasksForDate.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('list-group-item');
        taskItem.innerText = `Task${index + 1}: ${task}`;
        taskList.appendChild(taskItem);
    });
    } else {
    const taskItem = document.createElement('li');
    taskItem.classList.add('list-group-item');
    taskItem.innerText = 'No tasks for this day.';
    taskList.appendChild(taskItem);
    }

    taskModal.style.display = 'block';
}

function updateCalendar() {
    const selectedMonth = parseInt(monthSelect.value);
    const selectedYear = parseInt(yearInput.value);

    if (!isNaN(selectedMonth) && !isNaN(selectedYear)) {
    currentMonth = selectedMonth;
    currentYear = selectedYear;
    generateCalendar(currentMonth, currentYear);
    }
}

// Initialize with current month and year
const today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
monthSelect.value = currentMonth.toString();
yearInput.value = currentYear.toString();
generateCalendar(currentMonth, currentYear);
