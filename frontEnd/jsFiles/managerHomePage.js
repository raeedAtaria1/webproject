fetchTasks();
document.getElementById('searchButton').addEventListener('click', searchTasks);
document.getElementById('showOngoingTasksButton').addEventListener('click', showOngoingTasks);
document.getElementById('showAllTasksButton').addEventListener('click', showAllTasks);
function showAllTasks() {
const tableRows = document.querySelectorAll('#taskTableBody tr');

tableRows.forEach(row => {
row.style.display = '';
});
}

function showOngoingTasks() {
const tableRows = document.querySelectorAll('#taskTableBody tr');

tableRows.forEach(row => {
const taskStatus = row.querySelector('td:nth-child(6) button').textContent.trim();

if (taskStatus === 'Ongoing') {
  row.style.display = '';
} else {
  row.style.display = 'none';
}
});
}
async function fetchTasks() {
  try {
    const userEmail = localStorage.getItem('email');
    const response = await fetch('/tasksAdmin', {
      headers: {
        'email': userEmail
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasks = await response.json();
    const tableBody = document.getElementById('taskTableBody');
    tableBody.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight

    tasks.forEach(task => {
      const row = document.createElement('tr');
      row.id = `task-${task.id}`;

      // Convert the due date to a Date object and ignore the time part
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Set due date's time to midnight

      if (dueDate < today) {
        row.classList.add('highlight'); // Add the "highlight" class to overdue tasks
      } else {
        row.classList.add('no-highlight'); // Add the "no-highlight" class to other tasks
      }

      row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.description}</td>
        <td>${task.dueDate}</td>
        <td><button class="btn btn-warning btn-sm text-white" onclick="editTask('${task.id}')">Edit</button></td>
        <td><button class="btn btn-sm btn-danger" onclick="removeTask('${task.id}')">Remove</button></td>
        <td>
          <button class="btn btn-${task.status === 'Ongoing' ? 'primary' : 'success'}" onclick="updateTaskStatus('${task.id}')">
            ${task.status === 'Ongoing' ? 'Ongoing' : 'Completed'}
          </button>
        </td>
        <td>${task.userEmail}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}



async function removeTask(taskId) {
  try {
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      console.error('Response status:', response.status);
      const responseBody = await response.text();
      console.error('Response body:', responseBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const taskRow = document.getElementById(`task-${taskId}`);
    taskRow.classList.add('removed-task');

    // Re-fetch tasks and update the table
    fetchTasks();
  } catch (error) {
    console.error("There was an error deleting the task:", error);
  }
}
function editTask(id) {
var editPage = 'editTaskPage.html?id=' + id;
window.location.href=editPage;
}

function updateTaskStatus(taskId) {

  const taskButton = document.querySelector(`#task-${taskId} td:nth-child(6) button`);
const currentStatus = taskButton.textContent.trim();

console.log(currentStatus);

if (currentStatus === 'Completed') {
if (confirm('Are you sure you want to mark this task as Ongoing?')) {
    updateTaskStatusOnServer(taskId, 'Ongoing');
}
} else if (currentStatus === 'Ongoing' || currentStatus === 'Pending') {
// Display a confirmation message to the user
if (confirm('Are you sure you want to mark this task as completed?')) {
    updateTaskStatusOnServer(taskId, 'Completed');
}
}
}

function searchTasks() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const tableRows = document.querySelectorAll('#taskTableBody tr');

  tableRows.forEach(row => {
    const taskName = row.querySelector('td:first-child').innerText.toLowerCase();
    const taskDescription = row.querySelector('td:nth-child(2)').innerText.toLowerCase();

    if (taskName.includes(searchTerm) || taskDescription.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}


async function updateTaskStatusOnServer(taskId, status) {
try {
const userEmail = document.querySelector(`#task-${taskId} td:nth-child(7)`).textContent;
const response = await fetch(`/tasks/${taskId}/status`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'email': userEmail
  },
  body: JSON.stringify({ status })
});

if (!response.ok) {
  console.error('Response status:', response.status);
  const responseBody = await response.text();
  console.error('Response body:', responseBody);
  throw new Error(`HTTP error! status: ${response.status}`);
}

// Task status updated successfully
// You can perform any additional actions here if needed
fetchTasks();
} catch (error) {
console.error("There was an error updating the task status:", error);
}
}

// sends the new task to the server 
let form = document.getElementById('newTaskForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const taskName = form.elements.taskName.value;
  const taskDescription = form.elements.taskDescription.value;
  const dueDate = form.elements.dueDate.value;
  const userEmail = localStorage.getItem('email');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JavaScript months start from 0
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const status='Ongoing';
  const formattedDateTime =
    `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T` +
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  // document.getElementById('createdAt').value = formattedDateTime;

  try {
    const response = await fetch('/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formattedDateTime, taskDescription, dueDate, taskName, userEmail,status})
    });

    if (response.ok) {
      document.getElementById('message').textContent = 'Task added successfully!';
      document.getElementById('message').style.color = 'green';
    } else {
      const errorMessage = await response.text();
      alert(errorMessage);
    }
  } catch (error) {
    console.error(error);
    console.error("Something went wrong");
  }
});
