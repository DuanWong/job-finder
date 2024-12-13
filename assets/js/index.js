"use strict";


import { listen, select } from './utility.js';

 const enteredUsername = select(".username").value.trim();
 const enteredPassword = select(".password").value.trim();
 const errorElement = select(".error-message");
 const loginForm = select(".loginForm");
 

const sampleUser = {
    username: 'user123',
    password: 'password123'
};



function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([sampleUser]));
    }
}

initializeUsers();

listen(loginForm, 'submit', function(event) {
    event.preventDefault(); 

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userMatch = users.find(user => user.username === enteredUsername && user.password === enteredPassword);
    if (userMatch) {
        localStorage.setItem('currentUser', JSON.stringify(userMatch));

        window.location.href = 'home.html';
    } else {
        errorElement.textContent = 'Incorrect username or password.';
    }
});
