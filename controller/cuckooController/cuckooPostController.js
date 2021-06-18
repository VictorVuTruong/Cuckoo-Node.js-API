const { request } = require("express");
const { response } = require("../../app");

// Import the post model
const cuckooPostModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostModel`);

// Import the user model
const User = require(`${__dirname}/../../model/userModel/userModel`);

// Import the cuckoo follow model
const cuckooFollowModel = require(`${__dirname}/../../model/cuckooModel/cuckooFollowModel`);

// Import the cuckoo post comment model
const cuckooPostCommentModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostCommentModel`);

// Import the cuckoo post like model
const cuckooPostLikeModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostLikeModel`);

// Import the cuckoo post photo model
const cuckooPostPhotoModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostPhotoModel`);

//---------------------- Controllers required to delete a post ----------------------
// Import the post comment controller
const cuckooPostCommentController = require(`${__dirname}/cuckooPostCommentController`);

// Import the post like controller
const cuckooPostLikeController = require(`${__dirname}/cuckooPostLikeController`);

// Import the notification controller
const cuckooNotificationController = require(`${__dirname}/cuckooNotificationController`);

// Import the post photo controller
const cuckooPostPhotoController = require(`${__dirname}/cuckooPostPhotoController`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Import the Firebase Admin SDK
const admin = require("firebase-admin");

// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// Storage object
let storage = new Storage({
  keyFilename: `${__dirname}/../../HBTGram-229b40c05d35.json`,
});

// The function to get all cuckoo posts
exports.getAllCuckooPosts = factory.getAllDocuments(cuckooPostModel);

// The function to get posts for the user
exports.getAllCuckooPostsForUser = catchAsync(
  async (request, response, next) => {
    /*
    In this sequence, we will do these things to get posts for the user
    1. Reference the database to get list of users followed by the specified user
    2. Get posts created by those users
    */

    // Array of posts for the user
    var arrayOfPostsForUser = [];

    // Array of user ids of users followed by the specified user
    var userIdsOfUserFollowedBySpecifiedUser = [];
    userIdsOfUserFollowedBySpecifiedUser.push("60c949986aec7d0017b9bf62")

    // Get user id of the user to get posts for
    const userId = request.query.userId;

    // Get current location in list of the user
    const currentLocationInList = request.query.currentLocationInList;

    // If new current location in list is 0, don't do anything and get out of the function
    if (currentLocationInList == 0) {
      response.status(200).json({
        status: "Done",
        data: [],
        newCurrentLocationInList: 0,
      });

      // Get out of the function
      return;
    }

    /************************ GET LIST OF USER IDS OF USER FOLLOWED BY SPECIFIED USER *********************/
    // Reference the database to get list of users followed by the specified user
    const listOfUsersFollowedBySpecifiedUser = await cuckooFollowModel.find({
      follower: userId,
    });

    // Loop through that list of follow objects to extract the ids
    listOfUsersFollowedBySpecifiedUser.forEach((follow) => {
      userIdsOfUserFollowedBySpecifiedUser.push(follow.following);
    });
    /************************ GET LIST OF USER IDS OF USER FOLLOWED BY SPECIFIED USER *********************/

    /************************ GET LIST OF POSTS CREATED BY USERS FOLLOWED BY THE SPECIFIED USER *********************/
    // Reference the database to get list of posts created by the users followed by the specified user
    // Order in collection has to be less than current location in list of the specified user
    const arrayOfPostsCreatedByFollowingUser = await cuckooPostModel
      .find({
        writer: {
          $in: userIdsOfUserFollowedBySpecifiedUser,
        },
        orderInCollection: {
          $lt: currentLocationInList,
        },
      })
      .sort({ $natural: -1 })
      .limit(5);

    // Append it to array of posts for the user
    arrayOfPostsForUser = arrayOfPostsForUser.concat(
      arrayOfPostsCreatedByFollowingUser
    );
    /************************ GET LIST OF POSTS CREATED BY USERS FOLLOWED BY THE SPECIFIED USER *********************/

    // If there is no posts in the array, return 0 as new current location in list and an empty array
    if (arrayOfPostsCreatedByFollowingUser.length == 0) {
      response.status(200).json({
        status: "Done",
        data: [],
        newCurrentLocationInList: 0,
      });

      // Get out of the function
      return;
    }

    // Get order in collection of last post in the array of posts for user and let it be next location in list
    // for the next load
    const newCurrentLocationInList =
      arrayOfPostsForUser[arrayOfPostsForUser.length - 1].orderInCollection;

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: arrayOfPostsForUser,
      newCurrentLocationInList: newCurrentLocationInList,
    });
  }
);

// The function to get cuckoo posts within a radius
exports.getCuckooPostWithinARadius = catchAsync(
  async (request, response, next) => {
    // Array of users within a radius
    const arrayOfUsersWithinARadius = [];

    // Get current location in list of the user
    const currentLocationInList = request.query.currentLocationInList;

    // Get location of the user
    const userLocation = request.query.location;

    // Get radius
    const radius = request.query.radius;

    // Call the function to get list of users within a radius
    const listOfUsersWithinARadius = await getUsersWithin(
      userLocation,
      radius,
      "km",
      0
    );

    // Loop through that list of users within a radius to extract the their user id
    listOfUsersWithinARadius.forEach((user) => {
      // Add user id to the array of users within a radius
      arrayOfUsersWithinARadius.push(user._id);
    });

    // Reference the database to get list of posts created by users who is within a specified radius
    // Array of posts within a radius
    // order in collection should be less then current location in list of the user
    const arrayOfPostsWithinARadius = await cuckooPostModel
      .find({
        writer: {
          $in: arrayOfUsersWithinARadius,
        },
        orderInCollection: {
          $lt: currentLocationInList,
        },
      })
      .sort({ $natural: -1 });

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: arrayOfPostsWithinARadius,
      newCurrentLocationInList:
        arrayOfPostsWithinARadius[arrayOfPostsWithinARadius.length - 1]
          .orderInCollection,
    });
  }
);

// The function to get order in collection of the latest post in the collection
exports.getLatestPostOrderInCollection = catchAsync(
  async (request, response, next) => {
    // Reference the database to get post object of the latest post in the post collection
    const latestPostObjet = await cuckooPostModel
      .find()
      .limit(1)
      .sort({ $natural: -1 });

    if (latestPostObjet[0] == undefined) {
      // Return response to the client app
      response.status(200).json({
        status: "Done",
        data: 0,
      });
    } else {
      // Return response to the client app
      response.status(200).json({
        status: "Done",
        data: latestPostObjet[0].orderInCollection,
      });
    }
  }
);

// The function to check if current location of the user is at the end of the collection or not
exports.checkEndOfCollectionStatus = catchAsync(
  async (request, response, next) => {
    // Get current location in list of the user
    const currentLocationInList = request.query.currentLocationInList;

    // Reference the database to get post object of the oldest post in the collection
    const latestPostObjet = await cuckooPostModel
      .find()
      .limit(1)
      .sort({ $natural: 1 });

    // Check to see if order in collection of the oldest post is the same with the current location of the user or not
    if (latestPostObjet.orderInCollection == currentLocationInList) {
      // If it is, return response to the client and let the client knows that user is at the end of the collection
      response.status(200).json({
        status: "Done",
        data: "At end of the collection",
      });
    } // Otherwise, return response to the client and let the client knows that this has not been the end
    else {
      response.status(200).json({
        status: "Done",
        data: "Not at the end yet",
      });
    }
  }
);

// The function to get post detail
// This will include post info, URLs of images, number of likes and comments and array of comments
exports.getCuckooPostDetail = catchAsync(async (request, response, next) => {
  // Reference the database to get info of the post
  const postInfo = await cuckooPostModel.findOne({
    _id: request.query.postId,
  });

  // Reference the database to get number of comments of the post
  const arrayOfComments = await cuckooPostCommentModel.find({
    postId: request.query.postId,
  });
  const numOfComments = arrayOfComments.length;

  // Reference the database to get number of likes of the post
  const arrayOfLikes = await cuckooPostLikeModel.find({
    postId: request.query.postId,
  });
  const numOfLikes = arrayOfLikes.length;

  // Reference the database to get array of images of the post
  const arrayOfImages = await cuckooPostPhotoModel.find({
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

// The function to create new cuckoo post
exports.createNewCuckooPost = factory.createDocument(cuckooPostModel);

// The function to delete a cuckoo post
exports.deleteCuckooPost = catchAsync(async (request, response, next) => {
  // Get post id of the post to be deleted
  const postId = request.query.postId;

  // The variable to keep track of if all images rated to post have been removed or not
  var allImagesRemoved = true;

  // Call the function to delete comments of the specified post id
  // Also obtain array of image URLs of photos to be deleted for the comments
  const arrayOfPostCommentPhotosToBeDeleted = await cuckooPostCommentController.deleteCommentsOfPost(
    postId
  );

  // Call the function to delete photos belong to the post that is going to be deleted
  // Also obtain array of image URLs of photos to be deleted for the post
  const arrayofPostPhotosToBeDeleted = await cuckooPostPhotoController.deletePostPhoto(
    postId
  );

  // Call the function to delete likes of the specified post id
  await cuckooPostLikeController.deleteLikesOfPost(postId);

  // Call the function to delete notifications of the specified post id
  await cuckooNotificationController.deleteNotificationOfPost(postId);

  // Delete the post itself
  await cuckooPostModel.deleteOne({
    _id: postId,
  });

  // Loop through the list of post photos to start deleting them
  arrayofPostPhotosToBeDeleted.forEach((imageURL) => {
    // Call the function to start deleting
    // and check to see if image is deleted successfully or not
    if (deletePhotoBasedOnURL(imageURL, "HBTGramPostPhotos") == 1) {
      // Set the variable which keep track of if all images were removed or not to false
      allImagesRemoved = false;
    }
  });

  // Loop through the list of comment photos to start deleting them
  arrayOfPostCommentPhotosToBeDeleted.forEach((imageURL) => {
    // Call the function to start deleting
    // and check to see if image is deleted successfully or not
    if (deletePhotoBasedOnURL(imageURL, "hbtGramPostCommentPhotos") == 1) {
      // Set the variable which keep track of if all images were removed or not to false
      allImagesRemoved = false;
    }
  });

  // Based on the allImagesRemoved variable to return the right thing
  if (allImagesRemoved) {
    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: "Post has been deleted",
      arrayOfPostCommentPhotosToBeDeleted: arrayOfPostCommentPhotosToBeDeleted,
      arrayofPostPhotosToBeDeleted: arrayofPostPhotosToBeDeleted,
    });
  } else {
    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: "Post has been deleted. But some images are not",
      arrayOfPostCommentPhotosToBeDeleted: arrayOfPostCommentPhotosToBeDeleted,
      arrayofPostPhotosToBeDeleted: arrayofPostPhotosToBeDeleted,
    });
  }
});

// The function to edit post
exports.editPost = catchAsync(async (request, response, next) => {
  // Get post id of post to be modified
  const postId = request.query.postId

  // Update post in the database (info of the updated post should be in request body)
  await cuckooPostModel.findByIdAndUpdate(postId, request.body)

  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: "Post has been updated"
  })
})

//************************************************** */
/*
ADDITIONAL FUNCTIONS
1. The function to get list of users within a radius
*/

// The function to get list of users within a radius
async function getUsersWithin(location, radius, unit, limit) {
  // Get the lattitude and longitude from the location parameter
  const [lattitude, longitude] = location.split(",");

  // The radius should be converted to radian in this case. We get it by dividing the distance by the radius of the earth
  var radiusInRadian = 0;
  if (unit === "mi") {
    radiusInRadian = radius / 3963.2;
  } else {
    radiusInRadian = radius / 6378.1;
  }

  // List of users within a radius, will be based on limit param passed to this function
  let listOfUsersWithinRadius = null;

  // Reference the database to get list of users within a radius
  // Also limit number of results based on parameter passes to the function
  // If it is blank, don't do anything
  if (limit != 0) {
    listOfUsersWithinRadius = await User.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, lattitude], radiusInRadian] },
      },
    }).limit(limit);
  } else {
    listOfUsersWithinRadius = await User.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, lattitude], radiusInRadian] },
      },
    });
  }

  // Return list of users within a radius
  return listOfUsersWithinRadius;
}

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
/** ***************************** END ADDITIONAL FUNCTIONS ******************** */