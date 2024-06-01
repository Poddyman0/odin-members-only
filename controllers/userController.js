const Message = require("../models/messagesModel")
const User = require("../models/usersModel")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { trusted } = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcryptjs')

//updates like below

// GET request to login a user.
exports.user_login_get = (req, res) => {
    res.render("user_login", {user: res.locals.currentUser});
}

  //for get requests


// POST request to login user.
exports.user_login_post = passport.authenticate("local", {
    successRedirect: "/catalog",
    failureRedirect: "/catalog/user/login",
    failureFlash: true
});

exports.user_logout_post = (req, res) => {
  if (res.locals.currentUser) {
    req.logout((err) => {
      if (err) {
        return next(err); // Passes any errors to the error handler
      }
      res.render("user_logout", { user: null }); // User is now logged out, so pass null
    });
  } else {
    res.render("user_logout", { user: null });
  }
};

/*
[
    // Validate and sanitize the name field.
    body("usernameEmail", "Username email must contain at least 1 characters")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Username email name must contain at least 1 characters")
      .escape(),
    body("password", "Password must contain at least 1 characters")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Password must contain at least 1 characters")
      .escape(),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            failureFlash: true
          });
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      const user = await User.find({usernameEmail: req.body.usernameEmail, password: req.body.password}, "usernameEmail password").exec();
      console.log("user", user)
      // Create a genre object with escaped and trimmed data.
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("user_login", {
            title: "Update User Membership Status",
            user: user,
            errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        const updatedUser = await User.find({usernameEmail: req.body.usernameEmail, password: req.body.password}, "usernameEmail password").exec();
        console.log("updatedUser", updatedUser)
        // New genre saved. Redirect to genre detail page.
          res.redirect(updatedUser.url);
      }
    }),
  ];
*/
/*
// GET request to log out a user.
exports.user_logout_get = asyncHandler(async (req, res, next) => {
    // Get details of genre and all associated books (in parallel)
    const user = await User.findById(req.params.id).exec();
  
    if (!user) {
        // No results.
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
    }
    console.log("category:", category)
    res.render("user_logout", {
        title: "Update User Membership Status",
        user: user,
        requestedUser: req.user
    });
  });

// POST request to log out user.
exports.user_logout_post = [
    // Validate and sanitize the name field.
    body("password", "Membership password must be Password123!")
      .trim()
      .equals("Password123!")
      .withMessage("Membership password must be Password123!")
      .escape(),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/user_logout",
            failureRedirect: "/user_logout"
          });
        req.logout((err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/user_logout");
          });
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      const user = await User.findById(req.params.id).exec();
      // Create a genre object with escaped and trimmed data.
      const updatedMembershipUser = new User({ 
        firstName: user.firstName,
        secondName: user.secondName,
        usernameEmail: user.usernameEmail,
        password: user.password,
        membershipStatus: true,
        adminStatus: user.adminStatus,
        _id: req.params.id,
       });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("user_logout", {
            title: "Update User Membership Status",
            user: user,
            errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
          const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedMembershipUser, {});
          // New genre saved. Redirect to genre detail page.
          res.redirect(updatedUser.url);
      }
    }),
  ];
*/
//update above



// GET request for creating a user. NOTE This must come before route that displays user (uses id).
exports.user_create_get = (req, res, next) => {
    res.render("user_create", { title: "Create User" });
  };

//POST request for creating user.
exports.user_create_post = [
    // Validate and sanitize the name field.
    body("firstName", "First name must contain at least 1 characters")
      .trim()
      .isLength({ min: 1 })
      .withMessage("first name must contain at least 1 characters")
      .escape(),
    body("secondName", "Second name must contain at least 1 characters")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Second name description must contain at least 1 characters")
      .escape(),
    body("usernameEmail", "Username email must be a valid email")
      .trim()
      .isEmail()
      .withMessage("Username email name must be a valid email")
      .escape(),
    body("password", "Password must contain at least 1 characters")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Password must contain at least 1 characters")
      .escape(),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            return value === req.body.password
          })
        .withMessage("Password confirmation must match password")
        .escape(),
    body("adminTrue")
          .custom((value, { req }) => {
            let adminBoolAndPasswordMatch = true;
            if (value === "on" && req.body.adminPassword !== "Password123!") {
                adminBoolAndPasswordMatch = false;
            }
            return adminBoolAndPasswordMatch
          })
          .withMessage("If become admin is selected then admin password must be Password123!")
          .escape(),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
        let adminBool = false;
        if (req.body.adminTrue === "on" && req.body.adminPassword === "Password123!") {
            adminBool = true
        } else {
            adminBool = false
        }

      // Create a genre object with escaped and trimmed data.

  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("user_create", {
          title: "Create User",
          user: user,
          errors: errors.array(),
        });
        return;
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err)
            } else if (!err) {
                const user = new User({ 
                    firstName: req.body.firstName,
                    secondName: req.body.secondName,
                    usernameEmail: req.body.usernameEmail,
                    name: req.body.name,
                    password: hashedPassword,
                    membershipStatus: false,
                    adminStatus: adminBool,
                   });
                  await user.save();
                  res.redirect("/catalog/user/login");
            }

            // otherwise, store hashedPassword in DB
          });
        }
    }),
  ];
  

// GET request to update user membership.
exports.user_update_membership_get = asyncHandler(async (req, res, next) => {
    // Get details of genre and all associated books (in parallel)
    console.log("reslocalscurrentUser:", res.locals.currentUser)
    //const user = await User.findById(res.locals.currentUser._id).exec();
    let errors = []
    if (!res.locals.currentUser) {
      errors.push({msg: "You must login to upgrade membership status."})
    } else if (res.locals.currentUser) {
      errors = []
    }
    

    res.render("user_update_membership", {
        title: "Update User Membership Status",
        user: res.locals.currentUser,
        errors: errors,
    });
  });

// POST request to update user membership.
exports.user_update_membership_post = [
    // Validate and sanitize the name field.
    body("password", "Membership password must be Password123!")
      .trim()
      .equals("Password123!")
      .withMessage("Membership password must be Password123!")
      .escape(),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      const user = await User.findById(res.locals.currentUser._id).exec();
      // Create a genre object with escaped and trimmed data.
      const updatedMembershipUser = new User({ 
        firstName: user.firstName,
        secondName: user.secondName,
        usernameEmail: user.usernameEmail,
        password: user.password,
        membershipStatus: true,
        adminStatus: user.adminStatus,
        _id: user._id,
       });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("user_update_membership", {
            title: "Update User Membership Status",
            user: user,
            errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
          const updatedUser = await User.findByIdAndUpdate(res.locals.currentUser._id, updatedMembershipUser, {});
          // New genre saved. Redirect to genre detail page.
          res.redirect("/catalog/user/member")
          /*res.render("user_update_membership", {
            title: "Update User Membership Status",
            user: user,
            errors: errors.array(),
            });

        */
      }
    }),
  ];
