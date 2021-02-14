const { request } = require("express");
const { response } = require("../../app");

// Import the cuckoo post comment model
const cuckooPostCommentModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostCommentModel`);

// Import the cuckoo post comment photo controller
const cuckooPostCommentPhotoController = require(`${__dirname}/cuckooPostCommentPhotoController`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all comments
exports.getAllPostComments = factory.getAllDocuments(cuckooPostCommentModel);

// The function to create new post comment
exports.createNewPostComment = factory.createDocument(cuckooPostCommentModel);

// The function to delete a post comment
exports.deletePostComment = factory.deleteOne(cuckooPostCommentModel);

// The function to delete comments associated with the specified post
exports.deleteCommentsOfPost = async (postId) => {
  // Reference the database to get comments belong to the specified post id
  const commentsOfPost = await cuckooPostCommentModel.find({
    postId: postId,
  });

  // Array of post comment photos to be deleted
  var arrayOfPostCommentPhotosToBeDeleted = [];

  // Loop through that array of comment ids to start deleting
  // Some comments are photos. So, we will need to check if the comment
  // to be deleted is photo or not
  for (i = 0; i < commentsOfPost.length; i++) {
    // Check to see if the comment is photo or not
    if (commentsOfPost[i].content === "image") {
      // If it is image, delete that image as well as the comment
      // also obtain the array of image URLs to be deleted
      arrayOfPostCommentPhotosToBeDeleted = arrayOfPostCommentPhotosToBeDeleted.concat(
        await cuckooPostCommentPhotoController.deleteCuckooPostCommentPhotoBasedOnCommentId(
          commentsOfPost[i]._id
        )
      );

      // Delete the comment itself after photo of the comment is removed
      await cuckooPostCommentModel.deleteOne({
        _id: commentsOfPost[i]._id,
      });
    } // If the comment does not have any photo, just delete the comment
    else {
      // Delete the the comment
      await cuckooPostCommentModel.deleteOne({
        _id: commentsOfPost[i]._id,
      });
    }
  }

  // Return the array of post comment photos to be deleted
  return arrayOfPostCommentPhotosToBeDeleted;
};

// The function to delete a comment with a specified id
exports.deleteCommentWithId = catchAsync(async (request, response, next) => {
  // Get the comment id
  const commentId = request.query.commentId;

  // Reference the database to get comment object of a comment with specified id
  const commentObjectBasedOnId = await cuckooPostCommentModel.findOne({
    _id: commentId,
  });

  // Check to see if the comment is an image or not
  if (commentObjectBasedOnId.content == "image") {
    // If it is an image, call the function to delete the photo that is associated with the post
    await cuckooPostCommentPhotoController.deleteCuckooPostCommentPhotoBasedOnCommentId(
      commentId
    );
  }

  // Delete the comment object itself
  await cuckooPostCommentModel.deleteOne({
    _id: commentId,
  });

  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: "Comment has been deleted",
  });
});
