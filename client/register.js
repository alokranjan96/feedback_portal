document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send registration request to the server
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('registerMessage').innerText = data.message;

        if (data.message.trim() === 'User registered successfully!') { 
            // Show the home button after successful registration
            document.getElementById('homeButton').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('registerMessage').innerText = "Error registering user.";
    });
});

// Event listener for the home button
document.getElementById('goHome').addEventListener('click', function() {
    window.location.href = "index.html"; // Redirect to home page
});
