<strong>Project Title: Exclusive Clubhouse</strong>

<strong>Description:</strong>

In this project, I built a web application for an exclusive clubhouse where members can post anonymous messages. While all visitors can read the messages, only members can see the author of each post. The application involves user authentication, database management, and implementing role-based access control.

<strong>Technologies Used:</strong>

<ul>
  <li><strong>Node.js:</strong> For server-side JavaScript execution.</li>
  <li><strong>Express.js:</strong> For handling HTTP requests and routing.</li>
  <li><strong>MongoDB:</strong> For database management and storing user and message data.</li>
  <li><strong>Mongoose:</strong> For interacting with MongoDB using an object data modeling (ODM) library.</li>
  <li><strong>Passport.js:</strong> For user authentication.</li>
  <li><strong>bcrypt:</strong> For password hashing and security.</li>
</ul>
<strong>Features:</strong>

<ul>
  <li><strong>Database Models:</strong>
    <ul>
      <li><strong>User Model:</strong> Stores user details including full name, email (used as username), hashed password, and membership status. An optional admin field is added for role-based access.</li>
      <li><strong>Message Model:</strong> Stores messages with a title, timestamp, text content, and a reference to the author.</li>
    </ul>
  </li>
  <li><strong>User Authentication:</strong>
    <ul>
      <li><strong>Sign-Up Form:</strong> Allows users to create an account with full name, email, password, and a confirm password field. Passwords are hashed using bcrypt, and inputs are validated.</li>
      <li><strong>Login Form:</strong> Users can log in using their email and password. Authentication is handled using Passport.js.</li>
      <li><strong>Join the Club:</strong> Users need to enter a secret passcode to gain membership status. This feature adds exclusivity to the clubhouse.</li>
    </ul>
  </li>
  <li><strong>Message Management:</strong>
    <ul>
      <li><strong>Create Messages:</strong> Logged-in users can create new messages. This functionality is only visible to authenticated users.</li>
      <li><strong>Display Messages:</strong> All messages are displayed on the homepage. Non-members see only the message content, while members can also see the author’s name and date.</li>
      <li><strong>Admin Capabilities:</strong> An admin user can see and delete any message. Admin status is granted either through a special passcode or a checkbox during sign-up.</li>
    </ul>
  </li>
  <li><strong>Role-Based Access:</strong>
    <ul>
      <li><strong>Membership Status:</strong> Only users with membership status can see message authors and dates.</li>
      <li><strong>Admin Privileges:</strong> Admins have additional permissions, including the ability to delete messages. Admin users are distinguished with a special field in the database.</li>
    </ul>
  </li>
  <li><strong>Deployment:</strong> The project is deployed on a chosen PaaS (Platform as a Service) provider, making it accessible online.</li>
</ul>
