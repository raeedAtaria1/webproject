
function isDateValidAndGreaterThanToday(dateString) {
    const today = new Date();
    const inputDate = new Date(dateString);
  
    // Check if the input date is valid
    if (isNaN(inputDate.getTime())) {
      return false;
    }
  
    // Check if the input date is greater than today
    if (inputDate <= today) {
      return false;
    }
  
    return true;
  }
    const role = localStorage.getItem('role');
    function goHome() {
    if (role === 'admin') {
    // Redirect to the admin page
    window.location.href = "/managerHomePage.html";
} else {
    // Redirect to the user page
    window.location.href = "/userHomePage.html";
}
}

// Add event listener to the "Home" link
document.getElementById("homeLink").addEventListener("click", goHome);
        // Retrieve the role from localStorage

    // Get the user email input field element
    const userEmailInput = document.getElementById('hideWhenNotAdmin');
    // Check if the role is 'admin'
    if (role === 'admin') {
    // Show the user email input field
    userEmailInput.style.display = 'block';
    const employeeDropdown = document.getElementById('employeeDropdown');
    employeeDropdown.required = true;
    const adminEmail=localStorage.getItem('email');
    // Assume you have a button with the id "fetchWorkersBtn" in your HTML
    async function getEmployeeEmails() {
            try {
                const adminEmail = localStorage.getItem('email');
                const response = await fetch('/getWorkers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adminEmail })
                });

                if (!response.ok) {
                throw new Error('Error fetching workers: ' + response.statusText);
                }

                const workers = await response.json();
                const employeeEmails = workers.map(obj => obj.email);
                const option = document.createElement('option');
                option.value = adminEmail;
                option.textContent = adminEmail;
                option.style.color = 'blue'; // Set the color to red, you can change it to any desired color

                employeeDropdown.appendChild(option);
                employeeEmails.forEach(email => {
                    const option = document.createElement('option');
                    option.value = email;
                    option.textContent = email;
                    employeeDropdown.appendChild(option);
                });
          

                // Display the workers in your UI or perform any other necessary actions
            } catch (error) {
                console.error('Error:', error);
                // Handle the error in your UI
            }
            }

    getEmployeeEmails();




    } else {
    // Hide the user email input field
    userEmailInput.style.display = 'none';
    }
// sends the new task to the server 
let form = document.getElementById('newTaskForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const confirmSave = confirm("Are you sure you want to save the task?");

    if (!confirmSave) {
        return; // Exit the function if the user cancels the save
    }
    
    
    const taskName = form.elements.taskName.value;
    const taskDescription = form.elements.taskDescription.value;
    const dueDate = form.elements.taskDueDate.value;
    let userEmail = localStorage.getItem('email');
    adminEmail = localStorage.getItem('adminEmail');

    if (role === 'admin') {
        userEmail =  employeeDropdown.value;
        adminEmail=localStorage.getItem('email');
        console.log('user '+userEmail);
        console.log('adminEmail '+adminEmail);


    }
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
    // Check if the due date is valid and greater than today
  if (!isDateValidAndGreaterThanToday(dueDate)) {
    alert("Please enter a valid due date that is greater than today.");
    return;
  }

    try {
        
        const response = await fetch('/addTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formattedDateTime, taskDescription, dueDate, taskName, userEmail,status,adminEmail})
        });
        if (response.ok) {
        const role = localStorage.getItem('role');
        console.log(role);
        if(role=='user'){
                    window.location.href = '/userHomePage.html';
                    return;
                        }
        console.log('done');
        window.location.href = '/managerHomePage.html';

        } else {
        const errorMessage = await response.text();
        console.error("Server error:", errorMessage);
        }
    } catch (error) {
        console.error("JavaScript error:", error);
        console.error(error);
        document.getElementById('message').textContent = 'Something went wrong while adding the task. Please try again.';
        document.getElementById('message').style.color = 'red';
    }
    });
