// client/login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the server
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful!') {
            // Set logged in status
            localStorage.setItem('loggedIn', 'true');
            // Redirect to feedback form
            window.location.href = "feedback.html"; // Redirect to the feedback form
        } else {
            // Check if the user is not registered
            if (data.message === 'Invalid username or password') {
                const isFirstTimeUser  = confirm("It seems like you are logging in for the first time. Would you like to register?");
                if (isFirstTimeUser ) {
                    window.location.href = "register.html"; // Redirect to the registration page
                } else {
                    document.getElementById('loginMessage').innerText = data.message;
                }
            } else {
                document.getElementById('loginMessage').innerText = data.message;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Redirect to registration page when the link is clicked
document.getElementById('registerLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    window.location.href = "register.html"; // Redirect to the registration page
});
