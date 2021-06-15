// Import the cuckoo post comment photo model
const cuckooPostCommentPhotoModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostCommentPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// Storage object
let storage = new Storage({
  keyFilename: `${__dirname}/../../HBTGram-229b40c05d35.json`,
});

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

  // Loop through the array of comment photos to be deleted to delete them in the storage
  arrayOfPhotoURLsToBeDeleted.forEach(photoURL => {
    // Call the function to delete the photo
    deletePhotoBasedOnURL(photoURL, "hbtGramPostCommentPhotos")
  })
};

// The function to delete a photo based on its URL
function deletePhotoBasedOnURL(imageURL, parentFolder) {
  // Index of the start point of the image name
  var startOfName = imageURL.indexOf("%2F") + 3;

  // Index of the end point of the image name
  var endOfName = imageURL.indexOf("?");

  // Image name
  let imageName = imageURL.substring(startOfName, endOfName);

  // Storage bucket
  var bucket = storage.bucket("hbtgram.appspot.com");

  // Start deleting the found image
  bucket.deleteFiles(
    {
      prefix: `${parentFolder}/${imageName}`,
    },
    function (error) {
      if (!error) {
        // If there is no error, return 0
        return 0;
      } else {
        // If there is an error, return 1
      }
    }
  );
}