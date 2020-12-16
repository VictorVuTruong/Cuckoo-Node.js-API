const { request, response } = require("express");
const { use } = require("../../routes/hbtGramRoute/hbtGramPostRoutes");

// Import the hbt gram post model
const hbtGramPostModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostModel`);

// Import the hbt gram follow model
const hbtGramFollowModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramFollowModel`);

// Import the HBTGram post comment model
const hbtGramPostCommentModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostCommentModel`);

// Import the HBTGram post like model
const hbtGramPostLikeModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostLikeModel`);

// Import the HBTGram post photo model
const hbtGramPostPhotoModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostPhotoModel`);

// Import the HBTGram user interaction model
const hbtGramUserInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserInteractionModel`);

// Import the HBTGram user like interaction model
const hbtGramUserLikeInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserLikeInteractionModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all hbt gram posts
exports.getAllHBTGramPosts = factory.getAllDocuments(hbtGramPostModel);

// The function to get all hbt gram posts for the user
exports.getAllHBTGramPostsForUser = catchAsync(async (request, response, next) => {
  // Get current location in list of the user
  var currentLocationInList = request.query.currentLocationInList
  
  // Reference the database to get post object of the oldest post in the collection
  const latestPostObjet = await hbtGramPostModel.find().limit(1).sort({$natural: 1})

  // Get order in collection of the oldest post in the collection
  const orderInCollectionOfOldestPost = latestPostObjet.orderInCollection

  // Get user id of the user to get posts for
  const userId = request.query.userId

  // Array of posts for the user (will be added when post for user is found)
  const arrayOfPostsForUser = []
  
  // Move the window until we get some posts
  // Or until we reach end of the collection
  while (arrayOfPostsForUser.length == 0) {
    // If we are already at the end of the list, return response to the client to let the client know that end of collection has been reached
    if (orderInCollectionOfOldestPost == currentLocationInList) {
      response.status(200).json({
        status: "End of collection reached",
        results: 0,
        data: {
          documents: arrayOfPostsForUser
        }
      })

      // Get out of the function
      return
    }
    
    // Reference the database to get HBT Gram posts from the specified location in list of the user (probably has been updated a bit at this point)
    const allPosts = await hbtGramPostModel.find({
      orderInCollection: {
        $lt: currentLocationInList
      }
    }).sort({
      orderInCollection: -1
    }).limit(5)

    // For each of posts in the array, check to see if the specified user follow writer of the post or not
    for (i = 0; i < allPosts.length; i++) {
      // Get user id of the post writer
      const postWriterUserId = allPosts[i].writer

      // Reference the database to check and see if the specified user follows the post writer or not
      const followObject = await hbtGramFollowModel.findOne({
        follower: userId,
        following: postWriterUserId
      })

      // If the followObject between the 2 users is not null, add the post object to the array of posts for user
      if (followObject != null) {
        arrayOfPostsForUser.push(allPosts[i])
      }
    }

    // Update the currentLocationInList to be the order in collection of the last post in this window
    currentLocationInList = allPosts[allPosts.length]
  }

  // Return response to the client app
  response.status(200).json({
    status: "Done",
    results: arrayOfPostsForUser.length,
    data: {
      documents: arrayOfPostsForUser
    }
  })
})

// The function to update interaction frequency of the user
exports.updateUserInteractionFrequency = catchAsync(async (request, response, next) => {
  // Lambda expression to count array occurence
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  
  // Array of user interaction (duplication allowed)
  const arrayOfUserInteraction = []

  // Array of user interact with (no duplication allowed)
  const arrayOfUserInteractWith = []
  
  // Get user id of the user
  const userId = request.query.userId

  // Reference the database to get list of likes by the user
  const listOfLikesOfUser = await hbtGramPostLikeModel.find({
    whoLike: userId
  })

  // Reference the database to get list of comments by the user
  const listOfCommentsOfUser = await hbtGramPostCommentModel.find({
    writer: userId
  })

  // For each of every like object in the array of likes, reference the database to get
  // user id of the user who created the post that has the like
  for (i = 0; i < listOfLikesOfUser.length; i++) {
    // Reference the database to get post detail of the post with specified post id
    const postObject = await hbtGramPostModel.findOne({
      _id: listOfLikesOfUser[i].postId
    })

    // Add the user id of the post writer to the array of user interaction (duplication is still allowed at this point)
    // May not want user to interact with themselves
    if (postObject.writer != userId) {
      // If current user is writer of the post, don't add it the array of user interaction
      arrayOfUserInteraction.push(postObject.writer)
    }
  }

  // For each of every comment object in the array of comments, reference the database to get
  // user id of the user who created the post that has the comment
  for (i = 0; i < listOfCommentsOfUser.length; i++) {
    // Reference the database to get post detail of the post with specified post id
    const postObject = await hbtGramPostModel.findOne({
      _id: listOfCommentsOfUser[i].postId
    })

    // Add the user id of the post writer to the array of user interaction (duplication is still allowed at this point)
    // May not want user to interact with themselves
    if (postObject.writer != userId) {
      // If current user is writer of the post, don't add it the array of user interaction
      arrayOfUserInteraction.push(postObject.writer)
    }
  }

  // For each of every users in the array of user interact with
  // Check to see if user is already in the array of user interact with or not
  // and add it to the array
  // (no duplication is allowed at this point)
  arrayOfUserInteraction.forEach(userId => {
    // If the array has already has the user id, don't add it
    if (!arrayOfUserInteractWith.includes(userId)) {
      // Add user id to the array of user interact with
      arrayOfUserInteractWith.push(userId)
    }
  })

  for (i = 0; i < arrayOfUserInteractWith.length; i++) {
    // Before creating new user interaction object in the database
    // we will need to check and see if is there any already existed between the specified user at beginning
    // and user at this iteration of the loop or not
    // Reference the database to get it
    const userInteractionObjectBetweenUsers = await hbtGramUserInteractionModel.findOne({
      user: userId,
      interactWith: arrayOfUserInteractWith[i]
    })

    // If the user interaction object between 2 users is null, create the user interaction object between the 2 users
    if (userInteractionObjectBetweenUsers == null) {
      // Create the user interaction object
      await hbtGramUserInteractionModel.create({
        user: userId,
        interactWith: arrayOfUserInteractWith[i],
        interactionFrequency: countOccurrences(arrayOfUserInteraction, arrayOfUserInteractWith[i])
      })
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
          interactionFrequency: countOccurrences(arrayOfUserInteraction, arrayOfUserInteractWith[i])
        }
      )
    }
  }
  
  // Return response to the client app
  response.status(200).json({
    status: "Done, user interaction frequency updated"
  })
})

// The function to get user interaction frequency
exports.getUserInteractionFrequency = catchAsync(async (request, response, next) => {
  // Get user id of the user to get interaction frequency of
  const userId = request.query.userId

  // Reference the database to get user interaction objects of the specified user
  // Also sort them in ascending order so that other function will know to which user
  // the specified user interact the most
  const userInteractionObjectsOfUser = await hbtGramUserInteractionModel.find({
    user: userId
  }).sort({interactionFrequency: -1})

  // Return response to the client
  // This will have list of user interaction objects of the specified user
  // sorted in descening order of interaction
  response.status(200).json({
    status: "Done",
    data: userInteractionObjectsOfUser
  })
})

// The function to get interaction status for the user
exports.getInteractionStatusForUser = catchAsync(async (request, response, next) => {
  // Get user id of the user to get interaction status of
  const userId = request.query.userId

  // Reference the database to get interaction object in which the specified user
  // is interacted with
  const userInteractionObjectsForUser = await hbtGramUserInteractionModel.find({
    interactWith: userId
  }).sort({interactionFrequency: -1})

  // Return response to the client
  // This will have list of user interaction objects for the specified user
  // sorted
  response.status(200).json({
    status: "Done",
    data: userInteractionObjectsForUser
  })
})

// The function to update like status for the user (get to know which user like post of user the most)
exports.updateLikeStatusForUser = catchAsync(async (request, response, next) => {
  // Lambda expression to count array occurence
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  
  // Get user id of the user to get like status of
  const userId = request.query.userId

  // Array of users who like posts of the specified user (duplication allowed here)
  const arrayOfUsersWhoLikePost = []

  // Array of users who interact with post of the specified user (duplication is not allowed here)
  const arrayOfUsersInteractWithPost = []

  // Reference the database to get list of posts created by the user
  const listOfPostsByUser = await hbtGramPostModel.find({
    writer: userId
  })

  // For each of every posts in the list of posts by the user, get list of user who like that post
  // (duplication is still allowed at this point)
  for (i = 0; i < listOfPostsByUser.length; i++) {
    // Reference the database to get list of likes of the post
    const listOfLikesOfPost = await hbtGramPostLikeModel.find({
      postId: listOfPostsByUser[i]._id
    })

    // Loop through that list of likes and add user id of the user who like the post to the array of user who like post
    listOfLikesOfPost.forEach(likeObject => {
      arrayOfUsersWhoLikePost.push(likeObject.whoLike)
    })
  }

  // For each of every user in the array of user who like post
  // check to see if the user is already in the array of user interact with
  // post or not and add it to the array of user interact with post
  // (no duplication is allowed here)
  arrayOfUsersWhoLikePost.forEach(userWhoLikePost => {
    // Check to see if user is already in the array of user interact with post or not
    if (!arrayOfUsersInteractWithPost.includes(userWhoLikePost)) {
      // If not already in the array, add it
      arrayOfUsersInteractWithPost.push(userWhoLikePost)
    }
  })

  // For each of every users in the array of users who interact with post
  // count number of times user like post
  for (i = 0; i < arrayOfUsersInteractWithPost.length; i++) {
    // Reference the database to check and see if there is a user like interaction object between the 2 users or not
    const userLikeInteractionObjectBetween2Users = await hbtGramUserLikeInteractionModel.findOne({
      user: userId,
      likedBy: arrayOfUsersInteractWithPost[i]
    })

    console.log(userLikeInteractionObjectBetween2Users)
    
    // If there has not exist the user like interaction object between 2 users yet, create a new one
    if (userLikeInteractionObjectBetween2Users == null) {
      hbtGramUserLikeInteractionModel.create({
        user: userId,
        likedBy: arrayOfUsersInteractWithPost[i],
        numOfLikes: countOccurrences(arrayOfUsersInteractWithPost, arrayOfUsersInteractWithPost[i])
      })
    }
    // Otherwise, just update it
    else {
      hbtGramUserLikeInteractionModel.findByIdAndUpdate(
        userLikeInteractionObjectBetween2Users._id,
        {
          user: userId,
          likedBy: arrayOfUsersInteractWithPost[i],
          numOfLikes: countOccurrences(arrayOfUsersInteractWithPost, arrayOfUsersInteractWithPost[i])
        }
      )
    }
  }
  
  // Return response to the client
  response.status(200).json({
    status: "Done. Like status has been updated"
  })
})

// The function to get like interaction status of the user
exports.getLikeInteractionStatusOfUser = catchAsync(async (request, response, next) => {
  // Get user id of the user to get like interaction status of
  const userId = request.query.userId
  
  // Reference the database to get like interaction of the user
  // and sort it
  const likeInteractionOfUser = await hbtGramUserLikeInteractionModel.find({
    user: userId
  }).sort({numOfLikes: -1})
  
  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: likeInteractionOfUser
  })
})

// The function to get order in collection of the latest post in the collection
exports.getLatestPostOrderInCollection = catchAsync(async (request, response, next) => {
  // Reference the database to get post object of the latest post in the post collection
  const latestPostObjet = await hbtGramPostModel.find().limit(1).sort({$natural: -1})

  // Return response to the client app
  response.status(200).json({
    status: "Done",
    data: latestPostObjet[0]
  })
})

// The function to check if current location of the user is at the end of the collection or not
exports.checkEndOfCollectionStatus = catchAsync(async (request, response, next) => {
  // Get current location in list of the user
  const currentLocationInList = request.query.currentLocationInList

  // Reference the database to get post object of the oldest post in the collection
  const latestPostObjet = await hbtGramPostModel.find().limit(1).sort({$natural: 1})

  // Check to see if order in collection of the oldest post is the same with the current location of the user or not
  if (latestPostObjet.orderInCollection == currentLocationInList) {
    // If it is, return response to the client and let the client knows that user is at the end of the collection
    response.status(200).json({
      status: "Done",
      data: "At end of the collection"
    })
  } // Otherwise, return response to the client and let the client knows that this has not been the end
  else {
    response.status(200).json({
      status: "Done",
      data: "Not at the end yet"
    })
  }
})

// The function to get HBTGram post detail
// This will include post info, URLs of images, number of likes and comments and array of comments
exports.getHBTGramPostDetail = catchAsync(async (request, response, next) => {
  // Reference the database to get info of the post
  const postInfo = await hbtGramPostModel.findOne({
    _id: request.query.postId,
  });

  // Reference the database to get number of comments of the post
  const arrayOfComments = await hbtGramPostCommentModel.find({
    postId: request.query.postId,
  });
  const numOfComments = arrayOfComments.length;

  // Reference the database to get number of likes of the post
  const arrayOfLikes = await hbtGramPostLikeModel.find({
    postId: request.query.postId,
  });
  const numOfLikes = arrayOfLikes.length;

  // Reference the database to get array of images of the post
  const arrayOfImages = await hbtGramPostPhotoModel.find({
    postId: request.query.postId,
  });

  // Return response to the client app
  response.status(200).json({
    postInfo: postInfo,
    arrayOfImages: arrayOfImages,
    numOfComments: numOfComments,
    numOfLikes: numOfLikes,
    arrayOfComments: arrayOfComments,
  });

  // Go to the next middleware
  next();
});

// The function to create new hbt gram post
exports.createNewHBTGramPost = factory.createDocument(hbtGramPostModel);

// The function to delete a hbt gram post
exports.deleteHBTGramPost = factory.deleteOne(hbtGramPostModel);
