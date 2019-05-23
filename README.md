# Quick Credit
[![Build Status](https://travis-ci.org/Hervera/quick-credit.svg?branch=develop)](https://travis-ci.org/Hervera/quick-credit)   [![Coverage Status](https://coveralls.io/repos/github/Hervera/quick-credit/badge.svg?branch=develop)](https://coveralls.io/github/Hervera/quick-credit?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/ce61c0098ed96b19c18f/maintainability)](https://codeclimate.com/github/Hervera/quick-credit/maintainability)

Quick Credit is an online lending platform that provides short term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.

# Github-pages
GitHub pages (gh-pages) of this project is accessed using this link [Quick Credit](https://hervera.github.io/quick-credit/UI).

# Heruko Link

Quick Credit API [documentation](https://hervera-quick-credit.herokuapp.com/documentation/).

## Features

1. User (client) can sign up.
2. User (client) can login.
3. User (client) can request for only one loan at a time.
4. User (client) can view loan repayment history, to keep track of his/her liability or
responsibilities.
5. Admin can mark a client as verified , after confirming his/her home and work address.
6. Admin can view a specific loan application.
7. Admin can approve or reject a client’s loan application.
8. Admin can post loan repayment transaction in favour of a client.
9. Admin can view all loan applications.
10. Admin can view all current loans (not fully repaid).
11. Admin can view all repaid loans.

# Setup
- You need to have `git`, `NodeJS` and `npm` installed on your local environment.
- Clone the application with `git clone` command.
- `npm install` to install all the dependencies in local environment
- `npm update` to update the dependencies if new version available.

# Dependencies
* `NodeJs` Runtime environment that helps to run JavaScript not only in the browser even on the server.
* `Express` NodeJS framework used for making the back-end.
* `Joi` and `Morgan` API request body error validation and HTTP Request logger respectively.
* `body-parser` Parse incoming requests.
* `swagger` Open-source software framework that helps developers design, build, document, and consume RESTful Web services.

# Getting Started
Starting application run the following npm scripts
* `npm start` for starting the server.

# Testing
When you need to test the application and view test coverage run:
* `npm test` for running the tests, and 
* `npm run coverage` for getting the coverage summary.

# API Endpoint

* POST `/api/v2/auth/signup` Create user account.
* POST `/api/v2/auth/signin` Login a user.

* GET `/api/v2/users` Get all users.
* GET `/api/v2/users/<:user-id>` Get a specific user.
* PATCH `/api/v2/users/<:user-email>/verify` Mark a user as verified.
* GET `/api/v2/loans/<:loan-id` Get a specific loan application. 
* GET `/api/v2/loans?status=approved&repaid=false` Get all current loans that are not fully repaid. 
* GET `/api/v2/loans?status=approved&repaid=true` Get all repaid loans. 
* GET `/api/v2/loans` Get all loan applications 
* GET `/api/v2/loans/<:loan-id>/repayments` View loan repayment history. 
* POST `/api/v2/loans` Create a loan application.
* PATCH `/api/v2/loans/<:loan-id>` Approve or reject a loan application. Specify the status in the request’s body.
* POST `/api/v2/loans/<:loan-id>/repayment` Create a loan repayment record.


