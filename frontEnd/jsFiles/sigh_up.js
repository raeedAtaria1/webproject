  document.addEventListener('DOMContentLoaded', () => {
    const workerCheckbox = document.getElementById('workerCheckbox');
    const adminEmailField = document.getElementById('adminEmailField');

    workerCheckbox.addEventListener('change', () => {
      if (workerCheckbox.checked) {
        adminEmailField.style.display = 'block'; // Show the admin email field
        document.getElementById('InputAdminMail').setAttribute('required', ''); // Make it mandatory
      } else {
        document.getElementById('InputAdminMail').value = ''; // Clear the admin email field

        adminEmailField.style.display = 'none'; // Hide the admin email field
        document.getElementById('InputAdminMail').removeAttribute('required'); // Make it optional
      }
    });
  });

const form = document.getElementById('signupForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = form.elements.fullName.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    let adminEmail = form.elements.InputAdminMail.value || 'noAdmin';
    if( form.elements.InputAdminMail.value=="")
           adminEmail='noAdmin';
    const role="user";
    console.log(adminEmail);
    try {
    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName, email, password,role,adminEmail})
    });
    if (response.ok) {
        localStorage.setItem('email', email);
        window.location.href = '/userHomePage.html';
    } else {
        const errorMessage = await response.text();
        alert(errorMessage);
    }
    } catch (error) {
    console.error(error);
    console.error("Something went wrong");
    }
});
