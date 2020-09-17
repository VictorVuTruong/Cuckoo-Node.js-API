// Import the user model
const User = require(`${__dirname}/../../model/userModel/userModel`);

// Import the app error which will be used to handle errors
const AppError = require(`${__dirname}/../../utils/appError`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import this one in order to catch error in any async functions
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// This middleware is used to get all users
exports.getAllUsers = factory.getAllDocuments(User);

// This middleware is used for making the request.params.id equals to the id of the currently logged in user
exports.getCurrentUserId = (request, respond, next) => {
  request.params.id = request.user.id;
  next();
};

// This middleware is used to get information of the currently logged in user
exports.getMe = factory.getOneDocument(User);

// This is the middleware which will make sure that the user is not using this route to change the password
exports.validateRoute = (request, respond, next) => {
  if (request.body.password || request.body.passwordConfirm) {
    return next(new AppError("This route is not for password update", 400));
  }

  // Call the next middleware
  next();
};

// This is used for updating information of the currently logged in user
exports.updateMe = catchAsync(async (request, respond, next) => {
  // 1) Create error if user POSTs password data
  if (request.body.password || request.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates", 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObject(request.body, "name", "email");

  // If there is a file in the request, also add the photo property to the filteredBody object which is
  // going to upload data to the database
  if (request.file) {
    filteredBody.photo = request.file.filename;
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  // Return the respond to the client
  respond.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
