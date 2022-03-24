<img src="./src/assets/bookshelf-logo.svg" alt="Bookshelf" width="300" height="100">

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Features](#features)
- [Code Features](#code-features)
- [Technology Stack](#technology-stack)
- [Contributors](#contributors)
- [License](#license)
  
# Introduction

Bookshelf is an online bookstore system via which users do not need to blindly go to various places to find required books, they just simply go to Bookshelf and find it. The online bookstore system can not only reduce costs, save time, space, to bring convenience to everyone, but also promote the development of the logistics industry, serving three purposes, mutual benefit. Users can view its details, place an order and then the book is delivered to their address. Users can see their orders placed, their status (delivered date, order placed date), and rate/review their ordered products

Live demo [_here_](https://n11-bookshelf.netlify.app/)

### Sample creds

- For normal user login:  

    Username : guest_bookshelf@gmail.com \
    Password : G*907ues$#t!

- For admin login:

    Username : admin_bookshelf@gmail.com \
    Password : Mnbvcxz@12

Project also provide guest login functionality, just check `Sign in as Guest` checkbox and hit `Sign in` button
## Installation

- Clone this repository to your local machine
- Use the `yarn` command to install dependencies
- Inside the root directory run command `yarn start` to open the app in your browser of choice
- Several environment variables are needed to run the app. Below are listed:

```plaintext
// port number where app will host
PORT= // optional (defaults to 3000)

REACT_APP_API_URL= // required, backend server url

REACT_APP_STRIPE_API_KEY= // required, stripe public key
REACT_APP_GOOGLE_CLIENT_ID= //required, OAuth client id created on GCP for app SSO

REACT_APP_GUEST_EMAIL= // required, account username used for guest login
REACT_APP_GUEST_PASSWORD= // required, account username used for guest login

// delay added for infinite scrolling -- in ms
REACT_APP_LOADING_DELAY= // optional (defaults to 1000)

```

## Features

- List of books with details available and options to search, sort and filter are also available so that user can find required book
- Books can be added to cart for later purchase
- Review and rate purchased book
- Order history
- User profile section to view/edit info like name and address

## Code Features

- Material-UI styled components and animations using Framer-Motion
- React functional components used with hooks
- Global state management using Redux (Redux Toolkit)
- Infinite scrolling dashboard showing books list
- Login using email & password and Google SSO
- Payment gateway integration (stripe)
- Deployment on Netlify

## Technology Stack

![React JS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)\
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)\
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)\
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)\
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)\
![Sass](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
## Contributors

<a href="https://github.com/Alisha-Mahajan">Alisha Mahajan</a>\
<a href="https://github.com/SVB-knowmywork">Shubham Bansal</a>

## License

[MIT](/LICENSE)