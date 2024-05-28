const Message = require("../models/messagesModel")
const User = require("../models/usersModel")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require('bcryptjs')

// GET Display all member messages on the home page, but only show the author and date of the messages to other club-members.

exports.index_get = asyncHandler(async (req, res, next) => {
    let allMessages = await Message.find({}).exec()
    const usernameSearch = await User.find({}).exec()
    allMessages.forEach(message => {
        let messageID = `${message.messageByUser}`
        usernameSearch.forEach(user => {
            let userID = `${user._id}`
            if (messageID === userID) {
                message.fullName = `${user.firstName} ${user.secondName}`
            }
        })
    })
    res.render("index", {user: res.locals.currentUser, title: "Messsages List", messages_list: allMessages });
        

  });

exports.message_delete_get = asyncHandler(async (req, res, next) => {
    const messageToDelete = await Message.findById(req.params.id).exec()
    const usernameSearch = await User.find({}).exec()
    let messageID = `${messageToDelete.messageByUser}`
        usernameSearch.forEach(user => {
            let userID = `${user._id}`
            if (messageID === userID) {
                messageToDelete.fullName = `${user.firstName} ${user.secondName}`
            }
        })
    console.log("logged in user", res.locals.currentUser)
    console.log("messageToDelete", messageToDelete)
    if (messageToDelete === null) {
        res.redirect("/catalog")
    } else {
        res.render("message_delete", {
            user: res.locals.currentUser,
            title: "Delete Message",
            message: messageToDelete,
        })
    }

})

exports.message_delete_post = asyncHandler(async (req, res, next) => {
    const messageToDelete = await Message.findById(req.params.id).exec()
    if (messageToDelete === null) {
        res.render("message_delete", {
            user: res.locals.currentUser,
            title: "Delete Message",
            message: messageToDelete,
        })
    } else {
        await Message.findByIdAndDelete(req.params.id);
        res.redirect("/catalog");
    }
})



exports.message_create_get = (req, res, next) => {
    res.render("message_create", {user: res.locals.currentUser, title: "Create Message"})
}

exports.message_create_post = [
    body("title", "Title must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title must contain at least 1 characters")
    .escape(),
  body("text", "Text name must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("text must contain at least 1 characters")
    .escape(),

    asyncHandler(async (req, res, next) => {
        const message = new Message({
            title: req.body.title,
            text: req.body.text,
            messageByUser: res.locals.currentUser._id
        })
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("message_create", {
              title: "Create Message",
              user: res.locals.currentUser,
              errors: errors.array(),
            });
            return;
          } else {
            await message.save()
            res.redirect("/catalog")
          }
    })
]
