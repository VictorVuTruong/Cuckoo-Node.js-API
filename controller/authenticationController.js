// Import the user model
const User = require(`${__dirname}/../model/userModel/userModel`);

// Import the allowed user model
const AllowedUser = require(`${__dirname}/../model/userModel/allowedUserModel`);

// Import the JWT package
const jwt = require("jsonwebtoken");

// Import this one in order to catch error in any async functions
const catchAsync = require(`${__dirname}/../utils/catchAsync`);

// Import the AppError
const AppError = require(`${__dirname}/../utils/appError`);

// Import this one to validate web tokens
const { promisify } = require("util");

// Import this one to encrypt password in the database
const crypto = require("crypto");
const { request } = require("http");

// Function which will be used to create token for the user
const signToken = (userID) => {
  // Sign and return the token
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// The function which will be used to create and send token to the user
const createAndSendToken = (user, statusCode, request, respond) => {
  // Call the function to sign the token
  const token = signToken(user._id);

  // Send a cookie to the client which will also include the jwt (token)
  respond.cookie("jwt", token, {
    // Convert the cookie duration to milisecond
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // Set this to true so that the cookie can't be modified in anyway by the browser
    httpsOnly: true,
    // Test if the connection is secure or not. Only send the cookie when the connection is secure
    secure: request.secure || request.headers["x-forwarded-proto"] === "https",
  });

  // Set this here so that user's password is not included in the respond
  user.password = undefined;

  // Return the respond to the client
  respond.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

// The function which will be used to sign up the user
exports.signUp = catchAsync(async (request, respond, next) => {
  // Get the sign up token
  // It can be either from the params or the query
  var signUpToken = "";
  if (request.params.token != null) {
    signUpToken = request.params.token;
  } else {
    signUpToken = request.query.signUpToken;
  }

  // Get user based on the token
  // Hash the token and compare it with the one in the database
  const hashedToken = crypto
    .createHash("sha256")
    .update(signUpToken)
    .digest("hex");

  // Get the user based on the token
  const user = await AllowedUser.findOne({
    signUpToken: hashedToken,
    signUpTokenExpires: { $gt: Date.now() },
  });

  // If their is no user with the specified token, the token may has expired or the user hasn't requested
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  // If the user has already created a new account, don't let the user do that again
  if (user.registered == "yes") {
    return next(new AppError("You have already created the account", 400));
  }

  // If the token is valid, let the user create new account
  // Only the specified fields here are put into the database
  const newUser = await User.create(request.body);

  //const url = `${request.protocol}://${request.get("host")}/me`;
  //console.log(url);
  //await new Email(newUser, url).sendWelcome();

  // Call the function to call sign and send token to the user after sign up
  createAndSendToken(newUser, 201, request, respond);

  // Update the registered field in the database to be "yes" so that the user won't be able to register again
  user.registered = "yes";

  // Delete the signUpToken and the signUpTokenExpires property in the database. Since the
  // token is already used at this point
  user.signUpToken = undefined;
  user.signUpTokenExpires = undefined;

  // Update the document by saving sosme changes
  await user.save();
});

// The function to sign the user out of the system by sending a cookie without a token and override the current cookie
exports.logout = catchAsync(async (request, respond) => {
  respond.cookie("jwt", "loggedout", {
    // The cookie which just expire in 10 minutes
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  // Send the respond back
  respond.status(200).json({
    status: "success",
  });
});

// The function to create new token so that user can use it to create new account
exports.getSignUpToken = catchAsync(async (request, respond, next) => {
  console.log(request.body);

  // Get user id from the request body
  const userId = request.body.userId;

  // Check if userId is provided or not
  if (!userId) {
    // Return from here so that the login procedure can't get any further
    return next(new AppError("Please provide user id", 400));
  }

  // Reference the database to check if the user id belong to any allowed users or not
  const allowedUser = await AllowedUser.findOne({ studentId: userId });

  // Check to see if the user does exist or not
  if (!allowedUser) {
    // If the user does not exist, return an error
    return next(new AppError("The user id belong to nobody", 400));
  }

  // If everything is OK (the user id belongs to one of the allowed users)
  // we will generate the random sign up token
  const signUpToken = allowedUser.createSignUpToken();

  // Save that generated random sign up token to the database
  await allowedUser.save({ validateBeforeSave: false });

  // Return the token to the client app
  respond.cookie("sign_up_jwt", signUpToken, {
    // Convert the cookie duration to milisecond
    expires: new Date(Date.now() + 10 * 60 * 1000),
    // Set this to true so that the cookie can't be modified in anyway by the browser
    httpOnly: true,
    // Test if the connection is secure or not. Only send the cookie when the connection is secure
    secure: request.secure || request.headers["x-forwarded-proto"] === "https",
  });

  // Send the respond
  respond.status(200).json({
    status: "success",
    message: "Token is already in your cookie",
    token: signUpToken,
  });
});

// The function to log user in the system by sending token to the client's app
exports.login = catchAsync(async (request, respond, next) => {
  // Get email and password from the request body
  const { email, password } = request.body;

  // Check if email and password exist. If the email and password does not exist (user doesn't provide)
  // throw an error message
  if (!email || !password) {
    // Return from here so that the login procedure can't get any further
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if the user exist and the password is correct
  // Find the user based on email
  const user = await User.findOne({ email }).select("+password");

  // Check if the user exist or not. If it does, check if the password is match or not
  if (!user || !(await user.validatePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password entered", 401));
  }

  // If everything is ok and send the JWT to the client
  // Call the function to call sign and send token to the user after logging in
  createAndSendToken(user, 200, request, respond);
});

// The function to protect routes from unauthenticated users
exports.protect = catchAsync(async (request, respond, next) => {
  // Get the token if it does exist
  // Get the authorization information of the user from the header
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    // Get the token from the request header
    token = request.headers.authorization.split(" ")[1];
  } // If there is no token in the headers.authorization, get it from the cookie
  else if (request.cookies.jwt) {
    // Get token from the cookie
    token = request.cookies.jwt;
  }

  // Check if the token exists
  if (!token) {
    // If the user is not logged in the system, it also means that the user
    return next(new AppError("You are not logged in the system", 401));
  }

  // Validate the token
  // This step is to verify if the token has been modified or expired
  // Also decode the token to get info about the user who own the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user still exist
  const currentUser = await User.findById(decoded.userID);
  if (!currentUser) {
    return next(
      // If the token belongs to the user who no longer exist, return an error to the client's app
      new AppError("The token belong to the user who is no longer exist", 401)
    );
  }

  // Check if user changed password after the token was provided
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User has recently changed the password. Please login again"
      ),
      400
    );
  }

  // Grant access to the user to see protected route
  // This line of code here is VERY important because it will set the authorized user to the request.user
  // without this, the user will have no access to any protected routes even though already logged in
  request.user = currentUser;

  // Grant access to the user by setting the respond.locals.user to the currently logged in user
  // The pug template will have access to all respond.locals which will then allow it to get access to the information
  // of the currently logged in user
  respond.locals.user = currentUser;
  next();
});

// The function to get info of the user based on token sent to server by client app
exports.getUserInfoBasedOnToken = catchAsync(async (request, respond, next) => {
  // Get the token if it does exist
  // Get the authorization information of the user from the header
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    // Get the token from the request header
    token = request.headers.authorization.split(" ")[1];
  } // If there is no token in the headers.authorization, get it from the cookie
  else if (request.cookies.jwt) {
    // Get token from the cookie
    token = request.cookies.jwt;
  }

  // Decode the token to get user id of the user included in the token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Find user by id included in the token
  const foundUser = await User.findById(decodedToken.userID);

  //console.log(foundUser)
  console.log(token);

  // Return the respond
  respond.status(200).json({
    status: "Done",
    data: foundUser,
  });
});

// This function is used to check if token of the user still valid or not (login token)
exports.checkToken = catchAsync(async (request, respond, next) => {
  // Get the token if it does exist
  // Get the authorization information of the user from the header
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    // Get the token from the request header
    token = request.headers.authorization.split(" ")[1];
  } // If there is no token in the headers.authorization, get it from the cookie
  else if (request.cookies.jwt) {
    // Get token from the cookie
    token = request.cookies.jwt;
  }

  console.log("Here is token info");
  console.log(token);

  // Check if the token exists
  if (!token) {
    // If the user is not logged in the system, it also means that the user
    return next(new AppError("You are not logged in the system", 401));
  }

  // Validate the token
  // This step is to verify if the token has been modified or expired
  // Also decode the token to get info about the user who own the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user still exist
  const currentUser = await User.findById(decoded.userID);
  if (!currentUser) {
    return next(
      // If the token belongs to the user who no longer exist, return an error to the client's app
      new AppError("The token belong to the user who is no longer exist", 401)
    );
  }

  console.log(token);

  // If everything is good, return the good respond to the client app
  respond.status(200).json({
    status: "valid",
    messagae: "Valid token",
  });
});

// This function is to handle actions when user forgot the password
exports.forgotPassword = catchAsync(async (request, respond, next) => {
  // Get user based on posted email from the request body
  const user = await User.findOne({ email: request.body.email });

  // Check if the user does exist or not. Sometimes the user even type in the wrong email address
  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }

  // Generate a random token which the user can use to reset the password
  const resetToken = user.createPasswordResetToken();

  // Save that random token to the database
  await user.save({ validateBeforeSave: false });

  // Send the reset password email to user
  try {
    // Send it to the user as an email
    // The URL which the user can follow to reset the password
    const resetURL = `${request.protocol}://${request.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    // Send the email to the user
    //console.log(user.email);

    // Send the better reset password email to the user based on the email that was provided
    await new Email(user, resetURL).sendPasswordReset();

    // Send the respond
    respond.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    // Modify the database with the token and token expires which have been resetted due to error
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending email to reset the password, please try again later",
        500
      )
    );
  }
});

// The function to reset password for the user
exports.resetPassword = catchAsync(async (request, respond, next) => {
  // Get user based on the token
  // Hash the token and compare it with the one in the database
  const hashedToken = crypto
    .createHash("sha256")
    .update(request.params.token)
    .digest("hex");

  // Get the user based on the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // If the token hasn't expired, there is a user who own that token, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // Set the password if the token is OK
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;

  // Delete the passwordResetToken and the passwordResetTokenExpires property in the database. Since the
  // token is already used at this point
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  // Save the document
  await user.save();

  // Update changedPasswordAt property for the user which indicate that the user has changed the password
  // Log the user in, send JWT
  // Call the function to call sign and send token to the user after sign up
  createAndSendToken(user, 200, request, respond);
});

// The function to perform password update operation
exports.updatePassword = catchAsync(async (request, respond, next) => {
  // Get user from the collection
  const user = await User.findById(request.user.id).select("+password");

  // Check if the posted password is correct
  if (
    !(await user.validatePassword(request.body.passwordCurrent, user.password))
  ) {
    return next(
      new AppError("The password you entered for validation is not right", 401)
    );
  }

  // If the password is correct, update the password
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;

  // Save the user information
  await user.save();

  // Log the user in with the new JWT based the password of the user
  // Call the function to call sign and send token to the user after sign up
  createAndSendToken(user, 200, request, respond);
});
