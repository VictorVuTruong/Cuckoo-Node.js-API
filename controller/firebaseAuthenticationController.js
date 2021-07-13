// Import this one in order to catch error in any async functions
const catchAsync = require(`${__dirname}/../utils/catchAsync`);

// Import the AppError
const AppError = require(`${__dirname}/../utils/appError`);

const { request, response } = require("express");
// Firebase admin SDK
var admin = require("firebase-admin");

// Import the user model
const User = require(`${__dirname}/../model/userModel/userModel`);

// The function to create an account
exports.signUp = catchAsync(async (request, response, next) => {
  // Check and see if password and password confirm match or not
  if (request.body.password != request.body.passwordConfirm) {
    // Return an error and let user know that password confirm was not correct
    response.status(400).json({
      status: "Sign up unsuccessful",
      data: "Password does not match",
    });

    return;
  }

  // Create a user on Firebase Auth
  admin
    .auth()
    .createUser({
      email: request.body.email,
      emailVerified: true,
      password: request.body.password,
      displayName: request.body.fullName,
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false,
    })
    .then((userRecord) => {
      // Get UID of the newly created user
      // This will be used to link Firebase Authentication with MongoDB
      // Create new user in MongoDB
      User.create({
        firebaseUID: userRecord.uid,
        fullName: request.body.fullName,
        email: request.body.email,
        password: request.body.password,
        avatarURL:
          "https://firebasestorage.googleapis.com/v0/b/hbtgram.appspot.com/o/avatar%2Fprofileicon.png?alt=media&token=2bd8b8c7-5f15-422f-8dc8-6b9e7ab2e2c4",
        coverURL:
          "https://firebasestorage.googleapis.com/v0/b/hbtgram.appspot.com/o/cover%2FalbumCover.jpg?alt=media&token=cdf77771-686e-4c20-9f5f-d01a365352bc",
      })
        .then((user) => {
          // Return response to the client and let client know that sign up is done
          response.status(200).json({
            status: "Done",
            data: user,
          });

          console.log("Done");
        })
        .catch((error) => {
          console.log(`Inner error ${error}`);
        });
    })
    .catch((error) => {
      // Check the error message
      if (
        error.errorInfo.message ==
        "The email address is already in use by another account."
      ) {
        // Return response to the client app
        response.status(401).json({
          status: "Sign up unsuccessful",
          data: "Email already used",
        });
      }
    });
});

// The function to protect routes from unauthenticated users
exports.protect = catchAsync(async (request, response, next) => {
  // Get id token from the user
  // Id token can come either from request cookies or request query. Hence, we will need to check both of them
  // to see where does it come from
  let idToken;
  if (request.cookies.idToken != undefined) {
    idToken = request.cookies.idToken;
  } else {
    idToken = request.headers.idtoken;
  }

  // If user is not logged in the systen, return the error
  if (idToken == undefined) {
    response.status(401).json({
      status: "Not authorized",
      data: "Please log in the system",
    });

    return;
  }

  // Authenticate the user based on retrieved token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // Get UID of the authenticated user
      const uid = decodedToken.uid;

      // Go to the next middleware
      next();
    })
    .catch((error) => {
      // Return response to the client and let the client know that authentication
      // is unsucessful
      return next(new AppError("Not authorized"), 401);
    });
});

// The function to check if user's token is valid or not
exports.checkToken = catchAsync(async (request, response, next) => {
  // Get token from the user
  const idToken = request.cookies.idToken;

  // Authenticate user's token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(() => {
      // If everything is good, return the good respond to the client app
      response.status(200).json({
        status: "valid",
        messagae: "Valid token",
      });
    })
    .catch((error) => {
      console.log(error);

      // If the user is not logged in the system, return an error
      return next(new AppError("You are not logged in the system", 401));
    });
});

// The function to get user info based on token id
exports.getUserInfoBasedOnTokenId = catchAsync(
  async (request, response, next) => {
    // Get user Firebase UID. It can come either from cookie or request query
    let firebaseUID;
    if (request.cookies.firebaseUID != undefined) {
      firebaseUID = request.cookies.firebaseUID;
    } else {
      firebaseUID = request.query.firebaseUID;
    }

    // Reference the database to get user with the specified Firebase UID
    const userInfo = await User.findOne({
      firebaseUID: firebaseUID,
    });

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: userInfo,
    });
  }
);
