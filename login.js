function showFormError(message) {
    const errorElement = document.getElementById('formError');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
    errorElement.focus(); // For accessibility
}

function clearErrors() {
    document.querySelectorAll('[aria-invalid="true"]').forEach(input => {
        input.removeAttribute('aria-invalid');
    });
    document.getElementById('formError').classList.remove('visible');
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Client-side validation
    let hasEmptyFields = false;

    if (!username) {
        document.getElementById('username').setAttribute('aria-invalid', 'true');
        hasEmptyFields = true;
    }

    if (!password) {
        document.getElementById('password').setAttribute('aria-invalid', 'true');
        hasEmptyFields = true;
    }

    if (hasEmptyFields) {
        showFormError('Please fill in all required fields');
        return;
    }

    const submitButton = document.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful!') {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = "feedback_selection.html";
        } else {
            showFormError('Invalid username or password. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormError('Connection error. Please try again later.');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    });
});