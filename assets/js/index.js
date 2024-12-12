"use strict";

// js/login.js

// Sample user credentials initialization
const sampleUser = {
    username: 'user123',
    password: 'password123'
};

// Function to initialize users in localStorage if not already present
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        // Initialize with a sample user
        localStorage.setItem('users', JSON.stringify([sampleUser]));
    }
}

// Call the initialization function on script load
initializeUsers();

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    // Get entered credentials
    const enteredUsername = document.getElementById('username').value.trim();
    const enteredPassword = document.getElementById('password').value.trim();
    const errorElement = document.getElementById('error');

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if entered credentials match any user
    const userMatch = users.find(user => user.username === enteredUsername && user.password === enteredPassword);

    if (userMatch) {
        // Credentials are correct; optionally store current user info
        localStorage.setItem('currentUser', JSON.stringify(userMatch));

        // Redirect to home page (ensure home.html exists)
        window.location.href = 'home.html';
    } else {
        // Display error message
        errorElement.textContent = 'Incorrect username or password.';
    }
});
