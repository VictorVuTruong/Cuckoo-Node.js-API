const { response } = require("express");
const { request } = require("../../app");

// Import the cuckoo post like model
const cuckooPostLikeModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostLikeModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import this one in order to catch error in any async functions
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all cuckoo post likes
exports.getAllCuckooPostLikes = factory.getAllDocuments(cuckooPostLikeModel);

// The function to create new cuckoo post like
exports.createNewCuckooPostLike = factory.createDocument(cuckooPostLikeModel);

// The function to delete a cuckoo post like
exports.deleteCuckooPostLike = factory.deleteOne(cuckooPostLikeModel);

// The function to create new Cuckoo post like and also check if post is already liked
// by the specified user or not
exports.checkLikeStatusAndCreateNewCuckooPostLike = catchAsync(
  async (request, response, next) => {
    // Get user id of the user who liked the post
    const likerUserId = request.query.whoLike;

    // Get post id of the post that the liker like
    const postId = request.query.postId;

    // Reference the database to see if specified user has liked the post or not
    const likeObject = await cuckooPostLikeModel.findOne({
      whoLike: likerUserId,
      postId: postId,
    });

    // If the like object is null, it means that the specified user has not liked the post
    // if that happens, create new like for the post liked by the specifed user
    if (likeObject == null) {
      // Create the new like
      cuckooPostLikeModel.create({
        whoLike: likerUserId,
        postId: postId,
      });

      // Return response to the user
      response.status(200).json({
        status: "Done. New like added",
        data: `New like added. User: ${likerUserId}, PostID: ${postId}`,
      });
    } // Otherwise, delete a like for the user
    else {
      // Execute the command to remove a like
      await cuckooPostLikeModel.deleteOne({
        whoLike: likerUserId,
        postId: postId,
      });

      // Return response to the user
      response.status(200).json({
        status: "Done. Like deleted",
        data: `Like deleted. User: ${likerUserId}, PostID: ${postId}`,
      });
    }
  }
);

// The function to check like status of the user with the specified post id
exports.checkLikeStatus = catchAsync(async (request, response, next) => {
  // Get user id of the user to check like status
  const userId = request.query.whoLike;

  // Get post id of the post to check like status
  const postId = request.query.postId;

  // Reference the database to see if specified user has liked the post or not
  const likeObject = await cuckooPostLikeModel.findOne({
    whoLike: userId,
    postId: postId,
  });

  // If the like object is null, it means that the specified user has not liked the post
  if (likeObject == null) {
    // Return response to the client and let the client know that the user has not liked the post
    response.status(200).json({
      status: "Done. User has not liked post",
      data: `User has not liked post. User: ${userId}, PostID: ${postId}`,
    });
  } // Otherwise, return response to the client app and let the client know that the user has liked post
  else {
    // Return response to the client
    response.status(200).json({
      status: "Done. User has liked post",
      data: `User has like post. User: ${userId}, PostID: ${postId}`,
    });
  }
});

// The function to delete likes of the specified post id
exports.deleteLikesOfPost = catchAsync(async (postId) => {
  // Delete all likes of the specified post id
  await cuckooPostLikeModel.deleteMany({
    postId: postId,
  });
});
