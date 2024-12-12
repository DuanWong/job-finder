'use strict';

import { listen, select } from './utility.js';

/*--------------------------------------------*/
/*User and Subscriber                         */
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
/*Modal                                       */
/*--------------------------------------------*/

const profileImage = document.querySelector('.profile-image');
const modal = document.querySelector('.info-modal');
const subscriberContent = document.querySelector('.subscriber-content');
const subscriberName = document.querySelector('.subscriber-name');
const subscriber = new Subscriber(
    111111,
    "Duan Wang",
    "DuanWang666",
    "duan@example.com",
    ["Page1", "Page2"],
    ["MITT", "Developer"],
    true
);

profileImage.addEventListener('click', () => {
    subscriberName.innerText = subscriber.getName();
    subscriberContent.innerText = subscriber.getInfo();
    modal.style.display = 'flex'; 
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

/*--------------------------------------------*/
/* File name display                          */
/*--------------------------------------------*/

const imageUpload = document.querySelector('.image-upload');
const fileName = document.querySelector('.file-name');

function fileNameDisplay() {
    const file = imageUpload.files[0];

    if (file) {
        fileName.innerText = file.name; 
    } else {
        fileName.innerText = ''; 
    }
}

imageUpload.addEventListener('change', function() {
    fileNameDisplay(imageUpload);
});

/*--------------------------------------------*/
/*Post                                        */
/*--------------------------------------------*/

const postBtn = document.querySelector('.post-button');
const postsSection = document.querySelector('.posts-section');
const textInput = document.querySelector('.message');

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

textInput.addEventListener ('input', togglePostBtn);
imageUpload.addEventListener ('change', togglePostBtn);

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

    const newProfileImage = postHeader.querySelector('.profile-image');
    newProfileImage.addEventListener('click', () => {
        subscriberName.innerText = subscriber.getName();
        subscriberContent.innerText = subscriber.getInfo();
        modal.style.display = 'flex'; 
    });

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

postBtn.addEventListener('click', function() {
    createPost(textInput, imageUpload);
    
    textInput.value = '';
    imageUpload.value = '';
    fileNameDisplay(imageUpload);
    
    togglePostBtn();
});