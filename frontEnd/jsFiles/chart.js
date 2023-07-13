 // Fetch data from the server
 const email = localStorage.getItem('email');
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
 document.getElementById("homeLink").addEventListener("click", goHome);
 let adminYN="false";
 if(role=='admin'){
   adminYN="true"

 }

 fetch('/tasks/status', {
   headers: {
     'email': email, // Replace with the actual user's email
     'admin':adminYN,
   }
 })
   .then(response => response.json())
   .then(data => {
     const completedPercentage = ((data.completedTasks / (data.completedTasks + data.ongoingTasks)) * 100).toFixed(2);
     const ongoingPercentage = ((data.ongoingTasks / (data.completedTasks + data.ongoingTasks)) * 100).toFixed(2);

     const chartData = {
       labels: ['Completed', 'Ongoing'],
       datasets: [{
         data: [data.completedTasks, data.ongoingTasks],
         backgroundColor: ['#00ff00', '#0000ff']
       }]
     };

     // Render the pie chart
     const ctx = document.getElementById('taskChart').getContext('2d');
     new Chart(ctx, {
       type: 'pie',
       data: chartData,
       options: {
         plugins: {
           legend: {
             display: true
           },
           tooltip: {
             callbacks: {
               label: function (context) {
                 let label = context.label || '';

                 if (label) {
                   label += ': ';
                 }
                 if (context.parsed && context.parsed.length > 0) {
                   label += context.parsed[0].toFixed(2) + '%';
                 }
                 return label;
               }
             }
           }
         }
       }
     });

     // Display percentages
     const percentagesContainer = document.createElement('div');
     percentagesContainer.classList.add('row', 'mt-3');

     const completedPercentageContainer = document.createElement('div');
     completedPercentageContainer.classList.add('col-md-6', 'text-center');
     completedPercentageContainer.innerHTML = `<h6>Completed Tasks: ${completedPercentage}%</h6>`;

     const ongoingPercentageContainer = document.createElement('div');
     ongoingPercentageContainer.classList.add('col-md-6', 'text-center');
     ongoingPercentageContainer.innerHTML = `<h6>Ongoing Tasks: ${ongoingPercentage}%</h6>`;

     percentagesContainer.appendChild(completedPercentageContainer);
     percentagesContainer.appendChild(ongoingPercentageContainer);

     document.body.appendChild(percentagesContainer);
   })
   .catch(error => console.error(error));