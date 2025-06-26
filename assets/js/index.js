'use strict';

import { listen, select } from './utility.js';

/*--------------------------------------------*/
/*Class                                       */
/*--------------------------------------------*/

class User {
    #id;
    #name;
    #userName;
    #email;

    constructor(id, name, userName, email) {
        this.#id = id;
        this.#name = name;
        this.#userName = userName;
        this.#email = email;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getUserName() {
        return this.#userName;
    }

    getEmail() {
        return this.#email;
    }

    getInfo() {
        return `Name: ${this.#name}\nUsername: ${this.#userName}\nEmail: ${this.#email}`;
    }
}

class Subscriber extends User {
    #pages;
    #groups;
    #canMonetize;

    constructor(id, name, userName, email, pages, groups, canMonetize) {
        super(id, name, userName, email);
        this.#pages = pages;
        this.#groups = groups;
        this.#canMonetize = canMonetize;
    }

    getPages() {
        return this.#pages;
    }

    getGroups() {
        return this.#groups;
    }

    getCanMonetize() {
        return this.#canMonetize;
    }

    getInfo() {
        return `${super.getInfo()}\nGroups: ${this.#groups.join(", ")}`;
    }
}

/*--------------------------------------------*/
/*Object, Variables, DOM                      */
/*--------------------------------------------*/

const profileImage = select('.profile-image');
const modal = select('.info-modal');
const subscriberContent = select('.subscriber-content');
const imageUpload = select('.image-upload');
const fileName = select('.file-name');
const postBtn = select('.post-button');
const postsSection = select('.posts-section');
const textInput = select('.message');
const userContainer = select('.user-container'); 
const xMark= select('.fa-xmark');
const subscriber = new Subscriber(
    111111,
    "Duan Wang",
    "duanwang",
    "duan@example.com",
    ["Page1", "Page2"],
    ["MITT", "Developer"],
    true
);
const API_URL = 'https://randomuser.me/api/?nat=CA&results=10&seed=same';
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    mode: 'cors'
}

/*--------------------------------------------*/
/*Functions                                   */
/*--------------------------------------------*/

function fileNameDisplay() {
    const file = imageUpload.files[0];

    if (file) {
        fileName.innerText = file.name; 
    } else {
        fileName.innerText = ''; 
    }
}

function togglePostBtn() {
    if (textInput.value.trim() !== '' || imageUpload.files.length > 0) {
        postBtn.disabled = false;
        postBtn.style.backgroundColor = '#2994ff';
        postBtn.style.cursor = 'pointer';
    } else {
        postBtn.disabled = true;
        postBtn.style.backgroundColor = '#82b7eb';
        postBtn.style.cursor = 'not-allowed';
    }
}

function formatDate(date) {
    const options = { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options); 
}

function createPost(textInput, imageUpload) {
    const postText = textInput.value;
    const imageFile = imageUpload.files[0];

    const post = document.createElement('div');
    post.classList.add('post-display');

    const postHeader = document.createElement('div');
    postHeader.classList.add('post-header');
    postHeader.innerHTML = `
        <div class="image-div">
          <img class="profile-image" src="assets/img/profile image.png" alt="Profile Pic">
          <p class="name">${subscriber.getName()}</p>
        </div>
        <div class="date-box">
          <p class="date">${formatDate(new Date())}</p>
        </div>
    `;
    post.appendChild(postHeader);

    const postContent = document.createElement('div');
    postContent.classList.add('post-content');
    if (postText) {
        postContent.textContent = postText;
    }
    if (imageFile) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(imageFile);
        postContent.appendChild(img);
    }
    post.appendChild(postContent);

    postsSection.prepend(post);
}

async function getUsers() {
    try {
        const response = await fetch(API_URL, options);

        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        const users = data.results;

        userContainer.innerHTML = '';
        displayUsers(users);

    } catch (error) {
        console.log(error.message);
    }
}

function displayUsers(users) {
    users.forEach(user => {
        const profilePicture = user.picture.large;
        const fullName = `${user.name.first} ${user.name.last}`;
        const city = user.location.city;

        const userDiv = document.createElement('div');
        userDiv.classList.add('user');

        userDiv.innerHTML = `
            <img src="${profilePicture}" alt="Profile Picture"/>
            <div>
              <h3>${fullName}</h3>
              <p>City: ${city}</p>
            </div>
            <i class="fa-solid fa-user-plus"></i>
        `;

        userContainer.appendChild(userDiv);
    });
}

getUsers();

/*--------------------------------------------*/
/*EventListener                               */
/*--------------------------------------------*/

listen(profileImage, 'click', () => {
    subscriberContent.innerText = subscriber.getInfo();
    modal.style.display = 'flex'; 
});

listen(modal, 'click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

listen(xMark, 'click', () => {
    modal.style.display = 'none';
});

listen(imageUpload, 'change', function() {
    fileNameDisplay(imageUpload);
});

listen(textInput, 'input', togglePostBtn);

listen(imageUpload, 'change', togglePostBtn);

listen(postBtn, 'click', function() {
    createPost(textInput, imageUpload);
    
    textInput.value = '';
    imageUpload.value = '';
    fileNameDisplay(imageUpload);
    
    togglePostBtn();
});