#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  const userArgs = process.argv.slice(2);
  
  const User = require("./models/usersModel");
  const Message = require("./models/messagesModel");

  
  const users = [];
  const messages = [];

  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    await createMessages();

    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  

  async function userCreate(index, firstName, secondName, usernameEmail, password, membershipStatus, adminStatus) {
    const user = new User({ 
        firstName: firstName,
        secondName: secondName,
        usernameEmail: usernameEmail,
        password: password,
        membershipStatus: membershipStatus,
        adminStatus: adminStatus,
    });
    await user.save();
    users[index] = user;
    console.log(`Added user: ${usernameEmail}`);
  }
  
  async function messageCreate(index, title, timestamp, text, messageByUser) {
    const messagedetail = {
      title: title,
      timestamp: timestamp,
      text: text,
      messageByUser: messageByUser,
    };
  
    const message = new Message(messagedetail);
    await message.save();
    messages[index] = message;
    console.log(`Added message: ${title}`);
  }


  
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([
        userCreate(0, "Alice", "Smith", "alicesmith@gmail.com", "Password123!", false, true),
        userCreate(1, "John", "Doe", "johndoe@gmail.com", "SecurePass456!", false, false),
        userCreate(2, "Emma", "Johnson", "emmajohnson@gmail.com", "MyPass789!", true, false),
        userCreate(3, "Michael", "Brown", "michaelbrown@gmail.com", "SafePassword0!", true, true),
    ]);
  }
 
  async function createMessages() {
    console.log("Adding messages");
    await Promise.all([
        messageCreate(0, "Welcome to the Community", "2024-05-21T08:00:00Z", "We are excited to have you here. Let's make this community great!", users[0]),
      messageCreate(1, "Weekly Update", "2024-05-20T12:00:00Z", "Here's what happened in the community this week...", users[0]),
      messageCreate(2, "Question About Features", "2024-05-19T15:30:00Z", "Can anyone explain how to use the new feature?", users[1]),
      messageCreate(3, "Suggestion for Improvement", "2024-05-18T18:45:00Z", "I think it would be great if we could have a dark mode.", users[1]),
      messageCreate(4, "Issue with Login", "2024-05-17T09:20:00Z", "Is anyone else having trouble logging in today?", users[2]),
      messageCreate(5, "Event Announcement", "2024-05-16T14:00:00Z", "Join us for our next community event on Saturday!", users[2]),
      messageCreate(6, "Feature Request", "2024-05-15T11:10:00Z", "Could you add a search function to the forum?", users[3]),
      messageCreate(7, "Bug Report", "2024-05-14T16:40:00Z", "I found a bug in the messaging system. Messages are not being sent.", users[3]),
    ]);
  }
