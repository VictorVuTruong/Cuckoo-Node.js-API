// Import the hbt gram post model
const hbtGramPostModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostModel`);

// Import the user model
const User = require(`${__dirname}/../../model/userModel/userModel`);

// Import the hbt gram follow model
const hbtGramFollowModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramFollowModel`);

// Import the hbt gram user interaction model
const hbtGramUserInteractionModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramUserInteractionModel`);

// Import the HBTGram post comment model
const hbtGramPostCommentModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostCommentModel`);

// Import the HBTGram post like model
const hbtGramPostLikeModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostLikeModel`);

// Import the HBTGram post photo model
const hbtGramPostPhotoModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all hbt gram posts
exports.getAllHBTGramPosts = factory.getAllDocuments(hbtGramPostModel);

// The function to get all hbt gram posts for the user
exports.getAllHBTGramPostsForUser = catchAsync(
  async (request, response, next) => {
    /*
    In this sequence, we will show posts based on 3 categories
    1. Posts by top 5 users
    2. Posts by rest of the followings
    3. Posts by users nearby
    */

    // Array of order in collection of posts in each of the above categories
    var arrayOfPostOrderInCollection = [];

    // Get current location in list of the user
    const currentLocationInList = request.query.currentLocationInList;

    // Get location of the user
    const userLocation = request.query.location;

    // Get radius
    const radius = request.query.radius;

    // Get user id of the user to get posts for
    const userId = request.query.userId;

    // Array of users within a radius (will need to be modified because we will need
    // to exclude users whose posts have been shown)
    let arrayOfUsersWithinARadius = [];

    // Array of users interact with the specified user
    const arrayOfUsersInteractWith = [];

    // Array of users whose posts already been shown
    let arrayOfUsersShown = [];

    //************************* SHOW POSTS BY THE TOP 5 USERS FIRST ************************** */
    // Reference the database to get list of uses to whom the user interact with the most (sorted in order)
    // We will just consider the top 5 users in the list (maybe 10 or 100 in the future when we have a lot of posts)
    const listOfUsersInteractWith = await hbtGramUserInteractionModel
      .find({
        user: userId,
      })
      .sort({ interactionFrequency: -1 })
      .limit(5);

    // Loop through that array of users interact with to extract user id of those users
    listOfUsersInteractWith.forEach((user) => {
      // Get user id of the user interact with the specified user
      arrayOfUsersInteractWith.push(user.interactWith);

      // Push user id to the array of users whose post already been shown
      arrayOfUsersShown.push(user.interactWith);
    });

    // Reference the database to get list of posts created by users to whom specified user interact with the most
    // Array of posts for the user (will be added when post for user is found)
    // order in collection should be less then current location in list of the user
    let arrayOfPostsForUser = await hbtGramPostModel
      .find({
        writer: {
          $in: arrayOfUsersInteractWith,
        },
        orderInCollection: {
          $lt: currentLocationInList,
        },
      })
      .sort({ $natural: -1 })
      .limit(5);

    // Loop through the array of posts by top 5 users, get their order in collection and add them
    // to the array of order in collection
    arrayOfPostsForUser.forEach((post) => {
      // Add order in collection of the post to the array
      arrayOfPostOrderInCollection.push(post.orderInCollection);
    });
    //************************* END SHOW POSTS BY THE TOP 5 USERS ************************** */

    //************************* SHOW POSTS BY THE REST OF FOLLOWINGS ************************** */
    // Array of user id by rest of the followings
    let arrayOfUserIdOfRestOfFollowings = [];

    // Reference the database to get list of users to whom specified user is following
    const listOfFollowings = await hbtGramFollowModel.find({
      follower: userId,
    });

    // Loop through the array of rest of followings to extract their user id
    listOfFollowings.forEach((following) => {
      arrayOfUserIdOfRestOfFollowings.push(following.following);
    });

    // Exclude top 5 users from the list of followings
    // We have list of user id of rest of followings
    arrayOfUserIdOfRestOfFollowings = arrayOfUserIdOfRestOfFollowings.filter(
      (x) => !arrayOfUsersInteractWith.includes(x)
    );

    // Push user id to the array of users whose post already been shown
    arrayOfUsersShown = arrayOfUsersShown.concat(
      arrayOfUserIdOfRestOfFollowings
    );

    // Reference the database again to get posts by rest of the followings
    const arrayOfPostsByRestOfTheFollowings = await hbtGramPostModel
      .find({
        writer: {
          $in: arrayOfUserIdOfRestOfFollowings,
        },
        orderInCollection: {
          $lt: currentLocationInList,
        },
      })
      .sort({ $natural: -1 });

    // Concat array of posts by rest of followings with posts for the user
    arrayOfPostsForUser = arrayOfPostsForUser.concat(
      arrayOfPostsByRestOfTheFollowings
    );

    // Loop through list of posts by rest of the followings, get their order in collection
    // and add them to the array of order in collection
    arrayOfPostsByRestOfTheFollowings.forEach((post) => {
      // Add order in collection of post to the array
      arrayOfPostOrderInCollection.push(post.orderInCollection);
    });
    //************************* END SHOW POSTS BY THE REST OF FOLLOWINGS ************************** */

    //************************* SHOW POSTS BY USERS WITHIN A RADIUS ************************** */
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
      arrayOfUsersWithinARadius.push(`${user._id}`);
    });

    // Exclude all previous users from the array of users within a radius
    // We have list of user id of users within a radius without duplicating posts
    arrayOfUsersWithinARadius = arrayOfUsersWithinARadius.filter(
      (x) => !arrayOfUsersShown.includes(x)
    );

    // Reference the database to get list of posts created by users who is within a specified radius
    // Array of posts within a radius
    // order in collection should be less then current location in list of the user
    const arrayOfPostsWithinARadius = await hbtGramPostModel
      .find({
        writer: {
          $in: arrayOfUsersWithinARadius,
        },
        orderInCollection: {
          $lt: currentLocationInList,
        },
      })
      .sort({ $natural: -1 })
      .limit(5);

    // Concat posts within a radius with array of posts for the user
    arrayOfPostsForUser = arrayOfPostsForUser.concat(arrayOfPostsWithinARadius);

    // Loop through the array of posts by users nearby, get their order in collection
    // and add them to the array of order in collection
    arrayOfPostsWithinARadius.forEach((post) => {
      // Add order in collectio of post to the array
      arrayOfPostOrderInCollection.push(post.orderInCollection);
    });
    //************************* END SHOW POSTS BY USERS WITHIN A RADIUS ************************** */

    // Compare order in collection of last posts in those 3 categogies
    // Whichever smallest will be considered as user's new current location in list
    // If there is no element in the array of collection, let new current location in list be 0
    let newCurrentLocationInList = 0;

    if (arrayOfPostOrderInCollection.length != 0) {
      newCurrentLocationInList = Math.min(...arrayOfPostOrderInCollection);
    }

    // Return response to the client app
    response.status(200).json({
      status: "Done",
      results: arrayOfPostsForUser.length,
      data: {
        documents: arrayOfPostsForUser,
        newCurrentLocationInList: newCurrentLocationInList,
      },
    });
  }
);

// The function to get hbt gram posts within a radius
exports.getHBTGramPostWithinARadius = catchAsync(
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
    const arrayOfPostsWithinARadius = await hbtGramPostModel
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
    });
  }
);

// The function to get order in collection of the latest post in the collection
exports.getLatestPostOrderInCollection = catchAsync(
  async (request, response, next) => {
    // Reference the database to get post object of the latest post in the post collection
    const latestPostObjet = await hbtGramPostModel
      .find()
      .limit(1)
      .sort({ $natural: -1 });

    // Return response to the client app
    response.status(200).json({
      status: "Done",
      data: latestPostObjet[0].orderInCollection,
    });
  }
);

// The function to check if current location of the user is at the end of the collection or not
exports.checkEndOfCollectionStatus = catchAsync(
  async (request, response, next) => {
    // Get current location in list of the user
    const currentLocationInList = request.query.currentLocationInList;

    // Reference the database to get post object of the oldest post in the collection
    const latestPostObjet = await hbtGramPostModel
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

/** ***************************** END ADDITIONAL FUNCTIONS ******************** */

// The function to create new hbt gram post
exports.createNewHBTGramPost = factory.createDocument(hbtGramPostModel);

// The function to delete a hbt gram post
exports.deleteHBTGramPost = factory.deleteOne(hbtGramPostModel);
