const { request, response } = require("express");

// Import the hbt gram post photo model
const hbtGramPostPhotoModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostPhotoModel`);

// Import the hbt gram post model
const hbtGramPostModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all hbt gram post photo
exports.getAllHBTGramPostPhotos = factory.getAllDocuments(
  hbtGramPostPhotoModel
);

// The function to create new hbt gram post photo
exports.createNewHBTGramPostPhoto = factory.createDocument(
  hbtGramPostPhotoModel
);

// The function to delete a hbt gram post photo
exports.deleteHBTGramPostPhoto = factory.deleteOne(hbtGramPostPhotoModel);

// The function to get all photos posted by the specified user
exports.getAllPhotosOfUser = catchAsync(async (request, response, next) => {
  // Array of post id created by the specified user
  var arrayOfPostId = []
  
  // Array of photo object promise created by the specified user
  var arrayOfPhotoObjectPromise = []

  // Array of photo created by the specified user
  var arrayOfPhotoObject = []

  // Get id of the user
  const userId = request.query.userId;
  
  // Reference the database to get all posts created by the specified user
  const postCreatedByUser = await hbtGramPostModel.find({writer: userId})

  // Loop through the array of post objects created by the specified user and get ids from that
  postCreatedByUser.forEach(postObject => {
    // Add that post id to the array
    arrayOfPostId.push(postObject._id)
  });
  
  // Loop through the obtained array of post id and get photo URLs of those posts
  arrayOfPostId.forEach(async (postId) => {
    // For each of every post id, reference the database to get first image URL of that post
    // Query will return a promise, since this is an async function
    // Hence, we will recceive a promise each time we get data. We then add promise to the array and await it outside of the loop
    arrayOfPhotoObjectPromise.push(hbtGramPostPhotoModel.findOne({postId: postId}))
  })

  // Get the array of hbt gram post photo objects from the array of promise by awaiting them
  arrayOfPhotoObject = await Promise.all(arrayOfPhotoObjectPromise)

  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: arrayOfPhotoObject
  })
})