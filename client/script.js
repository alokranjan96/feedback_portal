// client/script.js

// Check if user is logged in
if (!localStorage.getItem('loggedIn')) {
    window.location.href = "index.html"; // Redirect to login if not logged in
}

document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const teacherName = document.getElementById('teacherName').value;
    const subject = document.getElementById('subject').value;  // Added subject
    const teachingSkills = document.querySelector('input[name="teachingSkills"]:checked').value;
    const approachability = document.querySelector('input[name="approachability"]:checked').value;
    const explanation = document.querySelector('input[name="explanation"]:checked').value;
    const engagement = document.querySelector('input[name="engagement"]:checked').value;
    const feedbackQuality = document.querySelector('input[name="feedbackQuality"]:checked').value;
    const timeManagement = document.querySelector('input[name="timeManagement"]:checked').value;
    const participation = document.querySelector('input[name="participation"]:checked').value;
    const comments = document.getElementById('comments').value;

    const feedbackData = {
        teacherName,
        subject,  // Send subject data
        teachingSkills,
        approachability,
        explanation,
        engagement,
        feedbackQuality,
        timeManagement,
        participation,
        comments
    };

    fetch('/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            window.location.href = "thankYou.html"; // Redirect to Thank You page
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
