# url-shortener-BE

This Repository is created for submitting the allocated task from Node JS Day - 6 session.

Task Name - Develop a URL shortening web Application with Frontend and backend.

Application Workflow:
-
1 - Registration and Account Activation:

- User navigates to the registration page.
- User enters their firstname, lastname, email and password.
- Backend validates and stores the user's credentials (hashed password for security).
- An activation link is sent to the user's email.
- User clicks on the activation link to verify their email and activate their account.

2 - Login:

- User navigates to the login page.
- User enters their email and password.
- Backend validates the credentials.
- Upon successful validation, a JWT (JSON Web Token) is generated and returned to the frontend.
- Frontend stores the JWT securely (e.g., in local storage).

3 - Forgot Password:

- User clicks on the "Forgot Password" link.
- User enters their email.
- Backend generates a password reset token and sends it to the user's email.
- User clicks on the link in the email to reset their password.
- User enters a new password and confirms it.
- Backend updates the user's password.

4 - Create Short URL:

- Authenticated user navigates to the "Create Short URL" page.
- User enters the original URL they want to shorten.
- Frontend sends a request to the backend with the original URL.
- Backend generates a short URL (e.g., using a unique ID or a library like shortid).
- Backend stores the original URL and short URL pair in the database.
- Backend responds with the newly created short URL.

5 - URL List Table:

- Authenticated user navigates to the "URL List" page.
- Frontend sends a request to fetch all URLs associated with the user.
- Backend retrieves URLs from the database based on the user's ID.
- Backend responds with the list of URLs.
- Frontend displays the list of URLs in a table format, showing short URLs, original - URLs, and click counts.

6 - URL Statistics (Daily and Monthly Counts):

- Authenticated user navigates to the "URL Statistics" page.
- Frontend sends a request to fetch daily and monthly URL creation counts.
- Backend calculates the count of URLs created in the last 24 hours (daily) and last 30 days (monthly).
- Backend responds with the daily and monthly counts.
- Frontend displays the counts in a dashboard or card format.

7 - Technologies Involved:

Frontend: 
- React.js
- Axios for making HTTP requests to the backend.
- React Router for navigation between different pages.

Backend: 
- Node.js with Express.js

Database: 
- MongoDB


Please find the following files for Source code.

- /models/Url.js
- /models/User.js
- /routes/auth.js
- /routes/url.js
- /server.js

Thankyou and awaiting feedback.
