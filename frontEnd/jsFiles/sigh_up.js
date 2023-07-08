
const form = document.getElementById('signupForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = form.elements.fullName.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    const adminEmail = form.elements.InputAdminMail.value || 'noAdmin';
    const role="user";

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
        window.location.href = '/userHomePage.html.html';
    } else {
        const errorMessage = await response.text();
        alert(errorMessage);
    }
    } catch (error) {
    console.error(error);
    console.error("Something went wrong");
    }
});
