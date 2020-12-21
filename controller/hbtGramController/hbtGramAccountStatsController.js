// Import the hbt gram post model
const hbtGramPostModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostModel`);

// Import the HBTGram post comment model
const hbtGramPostCommentModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostCommentModel`);

// Import the HBTGram post like model
const hbtGramPostLikeModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostLikeModel`);

// Import the HBTGram user interaction model
const hbtGramUserInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserInteractionModel`);

// Import the HBTGram user like interaction model
const hbtGramUserLikeInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserLikeInteractionModel`);

// Import the HBTGram user comment interaction model
const hbtGramUserCommentInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserCommentInteractionModel`);

// Import the HBTGram user profile visit model
const hbtGramUserProfileVisitModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserProfileVisitModel`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to update interaction frequency of the user
exports.updateUserInteractionFrequency = catchAsync(
  async (request, response, next) => {
    // Lambda expression to count array occurence
    const countOccurrences = (arr, val) =>
      arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

    // Array of user interaction (duplication allowed)
    const arrayOfUserInteraction = [];

    // Array of user interact with (no duplication allowed)
    const arrayOfUserInteractWith = [];

    // Get user id of the user
    const userId = request.query.userId;

    // Reference the database to get list of likes by the user
    const listOfLikesOfUser = await hbtGramPostLikeModel.find({
      whoLike: userId,
    });

    // Reference the database to get list of comments by the user
    const listOfCommentsOfUser = await hbtGramPostCommentModel.find({
      writer: userId,
    });

    // For each of every like object in the array of likes, reference the database to get
    // user id of the user who created the post that has the like
    for (i = 0; i < listOfLikesOfUser.length; i++) {
      // Reference the database to get post detail of the post with specified post id
      const postObject = await hbtGramPostModel.findOne({
        _id: listOfLikesOfUser[i].postId,
      });

      // Add the user id of the post writer to the array of user interaction (duplication is still allowed at this point)
      // May not want user to interact with themselves
      if (postObject.writer != userId) {
        // If current user is writer of the post, don't add it the array of user interaction
        arrayOfUserInteraction.push(postObject.writer);
      }
    }

    // For each of every comment object in the array of comments, reference the database to get
    // user id of the user who created the post that has the comment
    for (i = 0; i < listOfCommentsOfUser.length; i++) {
      // Reference the database to get post detail of the post with specified post id
      const postObject = await hbtGramPostModel.findOne({
        _id: listOfCommentsOfUser[i].postId,
      });

      // Add the user id of the post writer to the array of user interaction (duplication is still allowed at this point)
      // May not want user to interact with themselves
      if (postObject.writer != userId) {
        // If current user is writer of the post, don't add it the array of user interaction
        arrayOfUserInteraction.push(postObject.writer);
      }
    }

    // For each of every users in the array of user interact with
    // Check to see if user is already in the array of user interact with or not
    // and add it to the array
    // (no duplication is allowed at this point)
    arrayOfUserInteraction.forEach((userId) => {
      // If the array has already has the user id, don't add it
      if (!arrayOfUserInteractWith.includes(userId)) {
        // Add user id to the array of user interact with
        arrayOfUserInteractWith.push(userId);
      }
    });

    for (i = 0; i < arrayOfUserInteractWith.length; i++) {
      // Before creating new user interaction object in the database
      // we will need to check and see if is there any already existed between the specified user at beginning
      // and user at this iteration of the loop or not
      // Reference the database to get it
      const userInteractionObjectBetweenUsers = await hbtGramUserInteractionModel.findOne(
        {
          user: userId,
          interactWith: arrayOfUserInteractWith[i],
        }
      );

      // If the user interaction object between 2 users is null, create the user interaction object between the 2 users
      if (userInteractionObjectBetweenUsers == null) {
        // Create the user interaction object
        await hbtGramUserInteractionModel.create({
          user: userId,
          interactWith: arrayOfUserInteractWith[i],
          interactionFrequency: countOccurrences(
            arrayOfUserInteraction,
            arrayOfUserInteractWith[i]
          ),
        });
      }
      // If it is not null, it means that there exist a user interaction object between the 2 users
      // update it
      else {
        // Update the user interaction object
        await hbtGramUserInteractionModel.findByIdAndUpdate(
          userInteractionObjectBetweenUsers._id,
          {
            user: userId,
            interactWith: arrayOfUserInteractWith[i],
            interactionFrequency: countOccurrences(
              arrayOfUserInteraction,
              arrayOfUserInteractWith[i]
            ),
          }
        );
      }
    }

    // Return response to the client app
    response.status(200).json({
      status: "Done, user interaction frequency updated",
    });
  }
);

// The function to get user interaction frequency
exports.getUserInteractionFrequency = catchAsync(
  async (request, response, next) => {
    // Get user id of the user to get interaction frequency of
    const userId = request.query.userId;

    // Reference the database to get user interaction objects of the specified user
    // Also sort them in ascending order so that other function will know to which user
    // the specified user interact the most
    const userInteractionObjectsOfUser = await hbtGramUserInteractionModel
      .find({
        user: userId,
      })
      .sort({ interactionFrequency: -1 });

    // Return response to the client
    // This will have list of user interaction objects of the specified user
    // sorted in descening order of interaction
    response.status(200).json({
      status: "Done",
      data: userInteractionObjectsOfUser,
    });
  }
);

// The function to get interaction status for the user (user that interact with specified user the most)
exports.getInteractionStatusForUser = catchAsync(
  async (request, response, next) => {
    // Limit number of records to show
    const limit = Number(request.query.limit);

    // Get user id of the user to get interaction status of
    const userId = request.query.userId;

    // Reference the database to get interaction object in which the specified user
    // is interacted with
    let userInteractionObjectsForUser = null;

    // Based on the limit to return right number of records
    if (limit != 0) {
      userInteractionObjectsForUser = await hbtGramUserInteractionModel
        .find({
          interactWith: userId,
        })
        .sort({ interactionFrequency: -1 })
        .limit(limit);
    } else {
      userInteractionObjectsForUser = await hbtGramUserInteractionModel
        .find({
          interactWith: userId,
        })
        .sort({ interactionFrequency: -1 });
    }

    // Return response to the client
    // This will have list of user interaction objects for the specified user
    // sorted
    response.status(200).json({
      status: "Done",
      data: userInteractionObjectsForUser,
    });
  }
);

// The function to update like status for the user (get to know which user like post of user the most)
exports.updateLikeStatusForUser = catchAsync(
  async (request, response, next) => {
    // Lambda expression to count array occurence
    const countOccurrences = (arr, val) =>
      arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

    // Get user id of the user to get like status of
    const userId = request.query.userId;

    // Array of users who like posts of the specified user (duplication allowed here)
    const arrayOfUsersWhoLikePost = [];

    // Array of users who interact with post of the specified user (duplication is not allowed here)
    const arrayOfUsersInteractWithPost = [];

    // Reference the database to get list of posts created by the user
    const listOfPostsByUser = await hbtGramPostModel.find({
      writer: userId,
    });

    // For each of every posts in the list of posts by the user, get list of user who like that post
    // (duplication is still allowed at this point)
    for (i = 0; i < listOfPostsByUser.length; i++) {
      // Reference the database to get list of likes of the post
      const listOfLikesOfPost = await hbtGramPostLikeModel.find({
        postId: listOfPostsByUser[i]._id,
      });

      // Loop through that list of likes and add user id of the user who like the post to the array of user who like post
      listOfLikesOfPost.forEach((likeObject) => {
        arrayOfUsersWhoLikePost.push(likeObject.whoLike);
      });
    }

    // For each of every user in the array of user who like post
    // check to see if the user is already in the array of user interact with
    // post or not and add it to the array of user interact with post
    // (no duplication is allowed here)
    arrayOfUsersWhoLikePost.forEach((userWhoLikePost) => {
      // Check to see if user is already in the array of user interact with post or not
      if (!arrayOfUsersInteractWithPost.includes(userWhoLikePost)) {
        // If not already in the array, add it
        arrayOfUsersInteractWithPost.push(userWhoLikePost);
      }
    });

    // For each of every users in the array of users who interact with post
    // count number of times user like post
    for (i = 0; i < arrayOfUsersInteractWithPost.length; i++) {
      // Reference the database to check and see if there is a user like interaction object between the 2 users or not
      const userLikeInteractionObjectBetween2Users = await hbtGramUserLikeInteractionModel.findOne(
        {
          user: userId,
          likedBy: arrayOfUsersInteractWithPost[i],
        }
      );

      // If there has not exist the user like interaction object between 2 users yet, create a new one
      if (userLikeInteractionObjectBetween2Users == null) {
        await hbtGramUserLikeInteractionModel.create({
          user: userId,
          likedBy: arrayOfUsersInteractWithPost[i],
          numOfLikes: countOccurrences(
            arrayOfUsersWhoLikePost,
            arrayOfUsersInteractWithPost[i]
          ),
        });
      }
      // Otherwise, just update it
      else {
        await hbtGramUserLikeInteractionModel.findByIdAndUpdate(
          userLikeInteractionObjectBetween2Users._id,
          {
            user: userId,
            likedBy: arrayOfUsersInteractWithPost[i],
            numOfLikes: countOccurrences(
              arrayOfUsersWhoLikePost,
              arrayOfUsersInteractWithPost[i]
            ),
          }
        );
      }
    }

    // Return response to the client
    response.status(200).json({
      status: "Done. Like status has been updated",
    });
  }
);

// The function to get like interaction status of the user
exports.getLikeInteractionStatusOfUser = catchAsync(
  async (request, response, next) => {
    // Limit on number of records
    const limit = Number(request.query.limit);

    // Get user id of the user to get like interaction status of
    const userId = request.query.userId;

    // Reference the database to get like interaction of the user
    // and sort it
    let likeInteractionOfUser = null;

    // Based on limit to return right number of record
    if (limit != 0) {
      likeInteractionOfUser = await hbtGramUserLikeInteractionModel
        .find({
          user: userId,
        })
        .sort({ numOfLikes: -1 })
        .limit(limit);
    } else {
      likeInteractionOfUser = await hbtGramUserLikeInteractionModel
        .find({
          user: userId,
        })
        .sort({ numOfLikes: -1 });
    }

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: likeInteractionOfUser,
    });
  }
);

// The function to update comment status of the user (get to know who comment post of user the most)
exports.updateCommentStatusForUser = catchAsync(
  async (request, response, next) => {
    // Lambda expression to count array occurence
    const countOccurrences = (arr, val) =>
      arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

    // Get user id of the user to get comment status of
    const userId = request.query.userId;

    // Array of users who comment posts of the specified user (duplication allowed here)
    const arrayOfUsersWhoCommentPost = [];

    // Array of users who interact with post of the specified user (duplication is not allowed here)
    const arrayOfUsersInteractWithPost = [];

    // Reference the database to get list of posts created by the user
    const listOfPostsByUser = await hbtGramPostModel.find({
      writer: userId,
    });

    // For each of every posts in the list of posts by the user, get list of user who comment that post
    // (duplication is still allowed at this point)
    for (i = 0; i < listOfPostsByUser.length; i++) {
      // Reference the database to get list of comments of the post
      const listOfCommentsOfPost = await hbtGramPostCommentModel.find({
        postId: listOfPostsByUser[i]._id,
      });

      // Loop through that list of likes and add user id of the user who comment the post to the array of user who comment post
      listOfCommentsOfPost.forEach((commentObject) => {
        arrayOfUsersWhoCommentPost.push(commentObject.writer);
      });
    }

    // For each of every user in the array of user who comment post
    // check to see if the user is already in the array of user interact with
    // post or not and add it to the array of user interact with post
    // (no duplication is allowed here)
    arrayOfUsersWhoCommentPost.forEach((userWhoCommentPost) => {
      // Check to see if user is already in the array of user interact with post or not
      if (!arrayOfUsersInteractWithPost.includes(userWhoCommentPost)) {
        // If not already in the array, add it
        arrayOfUsersInteractWithPost.push(userWhoCommentPost);
      }
    });

    // For each of every users in the array of users who interact with post
    // count number of times user comment post
    for (i = 0; i < arrayOfUsersInteractWithPost.length; i++) {
      // Reference the database to check and see if there is a user comment interaction object between the 2 users or not
      const userCommentInteractionObjectBetween2Users = await hbtGramUserCommentInteractionModel.findOne(
        {
          user: userId,
          commentedBy: arrayOfUsersInteractWithPost[i],
        }
      );

      // If there has not exist the user comment interaction object between 2 users yet, create a new one
      if (userCommentInteractionObjectBetween2Users == null) {
        await hbtGramUserCommentInteractionModel.create({
          user: userId,
          commentedBy: arrayOfUsersInteractWithPost[i],
          numOfComments: countOccurrences(
            arrayOfUsersWhoCommentPost,
            arrayOfUsersInteractWithPost[i]
          ),
        });
      }
      // Otherwise, just update it
      else {
        await hbtGramUserCommentInteractionModel.findByIdAndUpdate(
          userCommentInteractionObjectBetween2Users._id,
          {
            user: userId,
            commentedBy: arrayOfUsersInteractWithPost[i],
            numOfComments: countOccurrences(
              arrayOfUsersWhoCommentPost,
              arrayOfUsersInteractWithPost[i]
            ),
          }
        );
      }
    }

    // Return response to the client
    response.status(200).json({
      status: "Done. Comment status has been updated",
    });
  }
);

// The function to get comment interaction status of the user
exports.getCommentInteractionStatusOfUser = catchAsync(
  async (request, response, next) => {
    // Limit on number of records to return
    const limit = Number(request.query.limit);

    // Get user id of the user to get comment interaction status of
    const userId = request.query.userId;

    // Reference the database to get comment interaction of the user
    // and sort it
    let commentInteractionOfUser = null;

    // Based on limit to return right number of records
    if (limit != 0) {
      commentInteractionOfUser = await hbtGramUserCommentInteractionModel
        .find({
          user: userId,
        })
        .sort({ numOfComments: -1 })
        .limit(limit);
    } else {
      commentInteractionOfUser = await hbtGramUserCommentInteractionModel
        .find({
          user: userId,
        })
        .sort({ numOfComments: -1 });
    }

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: commentInteractionOfUser,
    });
  }
);

// The function to update user profile visit
exports.updateUserProfileVisit = catchAsync(async (request, response, next) => {
  // Get user id of the user who come to visit a profile
  const visitorUserId = request.query.visitorUserId;

  // Get user id of the user who get visited
  const visitedUserId = request.query.visitedUserId;

  // Reference the database to check and see if there is a user profile visit object between the 2 users or not
  const userProfileVisitObjectBetween2Users = await hbtGramUserProfileVisitModel.findOne(
    {
      user: visitedUserId,
      visitedBy: visitorUserId,
    }
  );

  // If the user profile visit object between the 2 users is null, create one
  if (userProfileVisitObjectBetween2Users == null) {
    // Create the new user profile visit object between the 2 users
    // Num of visits will be 1 because this will be the first time visitor see profile of visited user
    await hbtGramUserProfileVisitModel.create({
      user: visitedUserId,
      visitedBy: visitorUserId,
      numOfVisits: 1,
    });
  } // If the user profile visit object between the 2 users is already existed
  // just update it (increase num of visit by 1)
  else {
    // Get current number of visits
    const currentNumOfVisits = userProfileVisitObjectBetween2Users.numOfVisits;

    // Increase current number of visit by 1
    const updatedNumOfVisits = currentNumOfVisits + 1;

    // Update the user profile visit object between the 2 users
    await hbtGramUserProfileVisitModel.findByIdAndUpdate(
      userProfileVisitObjectBetween2Users._id,
      {
        user: visitedUserId,
        visitedBy: visitorUserId,
        numOfVisits: updatedNumOfVisits,
      }
    );
  }

  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: "Num of visits updated",
  });
});

// The function to get user profile visit status for the user
exports.getProfileVisitStatusForUser = catchAsync(
  async (request, response, next) => {
    // Limit on number of records to return
    const limit = Number(request.query.limit);

    // Get user id of the user to get profile visit status of
    const userId = request.query.userId;

    // Reference the database to get user profile visit objects in which the specified user get visited
    // sort this by number of times user get visited
    let profileVisitObjectsOfUser = null;

    // Based on limit to return right number of records
    if (limit != 0) {
      profileVisitObjectsOfUser = await hbtGramUserProfileVisitModel
        .find({
          user: userId,
        })
        .sort({ numOfVisits: -1 })
        .limit(limit);
    } else {
      profileVisitObjectsOfUser = await hbtGramUserProfileVisitModel
        .find({
          user: userId,
        })
        .sort({ numOfVisits: -1 });
    }

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: profileVisitObjectsOfUser,
    });
  }
);
