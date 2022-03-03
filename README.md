<img src="./src/assets/bookshelf-logo.svg" alt="Bookshelf" width="300" height="100">

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Features](#features)
- [Code Features](#code-features)
- [Technology Stack](#technology-stack)
- [Contributors ✨](#contributors-)
- [Contributing](#contributing)
- [License](#license)
  
# Introduction

Bookshelf is an online bookstore system via which users do not need to blindly go to various places to find required books, they just simply go to Bookshelf and find it. The online bookstore system can not only reduce costs, save time, space, to bring convenience to everyone, but also promote the development of the logistics industry, serving three purposes, mutual benefit. Users can view its details, place an order and then the book is delivered to their address. Users can see their orders placed, their status (delivered date, order placed date), and rate/review their ordered products

Live demo [_here_](https://n11-bookshelf.netlify.app/)

### Sample creds

Username : guest_bookshelf@gmail.com \
Password: G*907ues$#t!

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
- Infinite scrolling dashboard showing books list
- Login using email & password and Google SSO
- Payment gateway integration (stripe)
- Deployment done on both Netlify and Heroku

## Technology Stack

![React JS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)\
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)\
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)\
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)\
![Sass](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)\
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)\
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
## Contributors ✨

<a href="https://github.com/Alisha-Mahajan">Alisha Mahajan</a>\
<a href="https://github.com/SVB-knowmywork">Shubham Bansal</a>

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Our commit messages are formatted according to [Conventional Commits](https://conventionalcommits.org/), hence this repository has [commitizen](https://github.com/commitizen/cz-cli) support enabled. Commitizen can help you generate your commit messages automatically.

And to use it, simply call git commit. The tool will help you generate a commit message that follows the below guidelines.

### Commit Message Format

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, an optional scope and a subject:

```plaintext
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

## License

[MIT](/LICENSE)