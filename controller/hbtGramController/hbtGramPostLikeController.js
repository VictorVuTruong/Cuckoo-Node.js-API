const { response } = require("express");
const { request } = require("../../app");

// Import the hbt gram post like model
const hbtGramPostLikeModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostLikeModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import this one in order to catch error in any async functions
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all hbt gram post likes
exports.getAllHBTGramPostLikes = factory.getAllDocuments(hbtGramPostLikeModel);

// The function to create new hbt gram post like
exports.createNewHBTGramPostLike = factory.createDocument(hbtGramPostLikeModel);

// The function to delete a hbt gram post like
exports.deleteHBTGramPostLike = factory.deleteOne(hbtGramPostLikeModel);

// The function to create new HBTGram post like and also check if post is already liked
// by the specified user or not
exports.checkLikeStatusAndCreateNewHBTGramPostLike = catchAsync(
  async (request, response, next) => {
    // Get user id of the user who liked the post
    const likerUserId = request.query.whoLike;

    // Get post id of the post that the liker like
    const postId = request.query.postId;

    // Reference the database to see if specified user has liked the post or not
    const likeObject = await hbtGramPostLikeModel.findOne({
      whoLike: likerUserId,
      postId: postId,
    });

    // If the like object is null, it means that the specified user has not liked the post
    // if that happens, create new like for the post liked by the specifed user
    if (likeObject == null) {
      // Create the new like
      hbtGramPostLikeModel.create({
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
      await hbtGramPostLikeModel.deleteOne({
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
  const likeObject = await hbtGramPostLikeModel.findOne({
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
