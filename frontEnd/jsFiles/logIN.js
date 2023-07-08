const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = form.elements.email.value;
  const password = form.elements.password.value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      localStorage.setItem('email', email);
      const data = await response.json();
      const { role, adminEmail } = data;
      localStorage.setItem('role', role);
      localStorage.setItem('adminEmail', adminEmail);
      if(role=='user'){
              window.location.href = '/userHomePage.html';
              return;
                      }
      window.location.href = '/managerHomePage.html';
     
                     } 
      else {
      const errorMessage = await response.text();
      alert(errorMessage);
           }
  } catch (error) {
    console.error(error);
    console.error("Something went wrong");
  }
});
