document.addEventListener('DOMContentLoaded', (event) => {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id');
  
    fetch(`/tasks/${id}`)
      .then(response => response.json())
      .then(task => {
        document.getElementById('taskName').value = task.name;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskDueDate').value = task.dueDate;
      });
  
    let form = document.getElementById('newTaskForm');
    form.addEventListener('submit', async (event) => {
      const confirmSave = confirm("Are you sure you want to edit the task?");
  
      if (!confirmSave) {
        return; // Exit the function if the user cancels the save
      }
      event.preventDefault();
  
      var updatedTaskData = {
        name: document.getElementById('taskName').value,
        description: document.getElementById('taskDescription').value,
        dueDate: document.getElementById('taskDueDate').value,
      };
  
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTaskData),
        });
  
        if (response.ok) {
          document.getElementById('message').textContent = 'Task updated successfully!';
          document.getElementById('message').style.color = 'green';
          const role = localStorage.getItem('role');
          if (role == 'user') {
            window.location.href = '/userHomePage.html';
            return;
          }
          window.location.href = '/managerHomePage.html';
        } else {
          const errorMessage = await response.text();
          alert(errorMessage);
        }
      } catch (error) {
        console.error("JavaScript error:", error);
        console.error(error);
        document.getElementById('message').textContent = 'Something went wrong while updating the task. Please try again.';
        document.getElementById('message').style.color = 'red';
      }
    });
  });
  