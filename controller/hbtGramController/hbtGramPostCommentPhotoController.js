// Import the hbt gram post comment photo model
const hbtGramPostCommentPhotoModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostCommentPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all hbt gram post comment photo
exports.getAllHBTGramPostCommentPhotos = factory.getAllDocuments(
  hbtGramPostCommentPhotoModel
);

// The function to create new hbt gram post comment photo
exports.createNewHBTGramPostCommentPhotos = factory.createDocument(
  hbtGramPostCommentPhotoModel
);

// The function to delete a hbt gram post comment photo
exports.deleteHBTGramPostCommentPhotos = factory.deleteOne(
  hbtGramPostCommentPhotoModel
);

// The function to delete a hbt gram post comment photo with the specified
// comment id
exports.deleteHBTGramPostCommentPhotoBasedOnCommentId = async (commentId) => {
  // Array of photo URLs of photos to be deleted
  var arrayOfPhotoURLsToBeDeleted = []

  // Reference the database to get photos to be deleted
  const photosToDeleted = await hbtGramPostCommentPhotoModel.find({
    commentId: commentId
  })

  // Loop through that list of photos objects to get their URLs
  photosToDeleted.forEach(photoObject => {
    // Get the photo URL
    arrayOfPhotoURLsToBeDeleted.push(photoObject.imageURL)
  });
  
  // Delete photos of comment with specified id
  await hbtGramPostCommentPhotoModel.deleteOne({
    commentId: commentId
  })

  // Return array of photo URLs that should be deleted from the storage
  return arrayOfPhotoURLsToBeDeleted
}