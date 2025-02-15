// Check if user is logged in
if (!localStorage.getItem('loggedIn')) {
    window.location.href = "index.html";
}

document.getElementById('feedbackForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    let feedbackData = {};

    // Check which form we're handling
    if (document.getElementById('teacherName')) {
        // Teacher Feedback
        feedbackData = {
            type: 'teacher',
            teacherName: document.getElementById('teacherName').value,
            subject: document.getElementById('subject').value,
            teachingSkills: document.querySelector('input[name="teachingSkills"]:checked')?.value,
            approachability: document.querySelector('input[name="approachability"]:checked')?.value,
            explanation: document.querySelector('input[name="explanation"]:checked')?.value,
            engagement: document.querySelector('input[name="engagement"]:checked')?.value,
            feedbackQuality: document.querySelector('input[name="feedbackQuality"]:checked')?.value,
            timeManagement: document.querySelector('input[name="timeManagement"]:checked')?.value,
            participation: document.querySelector('input[name="participation"]:checked')?.value,
            comments: document.getElementById('comments').value
        };
    } else if (document.getElementById('studentName')) {
        // Student Feedback
        feedbackData = {
            type: 'student',
            studentName: document.getElementById('studentName').value,
            rollNumber: document.getElementById('rollNumber').value,
            attentiveness: document.querySelector('input[name="attentiveness"]:checked')?.value,
            assignments: document.querySelector('input[name="assignments"]:checked')?.value,
            participation: document.querySelector('input[name="participation"]:checked')?.value,
            understanding: document.querySelector('input[name="understanding"]:checked')?.value,
            interest: document.querySelector('input[name="interest"]:checked')?.value,
            discipline: document.querySelector('input[name="discipline"]:checked')?.value,
            comments: document.getElementById('comments').value
        };
    }

    fetch('/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            window.location.href = "thankYou.html";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});