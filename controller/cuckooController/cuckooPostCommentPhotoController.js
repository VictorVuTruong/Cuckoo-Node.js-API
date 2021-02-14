// Import the cuckoo post comment photo model
const cuckooPostCommentPhotoModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostCommentPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all cuckoo post comment photo
exports.getAllCuckooPostCommentPhotos = factory.getAllDocuments(
  cuckooPostCommentPhotoModel
);

// The function to create new cuckoo post comment photos
exports.createNewCuckooPostCommentPhotos = factory.createDocument(
  cuckooPostCommentPhotoModel
);

// The function to delete a cuckoo post comment photo
exports.deleteCuckooPostCommentPhotos = factory.deleteOne(
  cuckooPostCommentPhotoModel
);

// The function to delete a cuckoo post comment photo with the specified
// comment id
exports.deleteCuckooPostCommentPhotoBasedOnCommentId = async (commentId) => {
  // Array of photo URLs of photos to be deleted
  var arrayOfPhotoURLsToBeDeleted = [];

  // Reference the database to get photos to be deleted
  const photosToDeleted = await cuckooPostCommentPhotoModel.find({
    commentId: commentId,
  });

  // Loop through that list of photos objects to get their URLs
  photosToDeleted.forEach((photoObject) => {
    // Get the photo URL
    arrayOfPhotoURLsToBeDeleted.push(photoObject.imageURL);
  });

  // Delete photos of comment with specified id
  await cuckooPostCommentPhotoModel.deleteOne({
    commentId: commentId,
  });

  // Return array of photo URLs that should be deleted from the storage
  return arrayOfPhotoURLsToBeDeleted;
};
