/*
const { request, response } = require("express");
const { use } = require("../../routes/hbtGramRoute/hbtGramPostPhotoRoutes");
*/

// Import the hbt gram post model
const hbtGramPostModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostModel`);

// Import the hbtGramPostPhotoLabelModel
const hbtGramPostPhotoLabelModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostPhotoLabelModel`);

// Import the hbtGramPostPhotoLabelVisitModel
const hbtGramPostPhotoLabelVisitModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostPhotoLabelVisitModel`);

// Import the HBTGram post photo model
const hbtGramPostPhotoModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Import the hbtGramPostPhotoLabelController
const hbtGramPostPhotoLabelController = require(`${__dirname}/hbtGramPostPhotoLabelController`)

// The function to get all hbt gram post photo
exports.getAllHBTGramPostPhotos = factory.getAllDocuments(
  hbtGramPostPhotoModel
);

// The function to create new hbt gram post photo
exports.createNewHBTGramPostPhoto = factory.createDocument(
  hbtGramPostPhotoModel
);

// The function to get all photos posted by the specified user
exports.getAllPhotosOfUser = catchAsync(async (request, response, next) => {
  // Array of post id created by the specified user
  var arrayOfPostId = [];

  // Array of photo object promise created by the specified user
  var arrayOfPhotoObjectPromise = [];

  // Array of photo created by the specified user
  var arrayOfPhotoObject = [];

  // Get id of the user
  const userId = request.query.userId;

  // Reference the database to get all posts created by the specified user
  const postCreatedByUser = await hbtGramPostModel.find({ writer: userId });

  // Loop through the array of post objects created by the specified user and get ids from that
  postCreatedByUser.forEach((postObject) => {
    // Add that post id to the array
    arrayOfPostId.push(postObject._id);
  });

  // Loop through the obtained array of post id and get photo URLs of those posts
  arrayOfPostId.forEach(async (postId) => {
    // For each of every post id, reference the database to get first image URL of that post
    // Query will return a promise, since this is an async function
    // Hence, we will recceive a promise each time we get data. We then add promise to the array and await it outside of the loop
    arrayOfPhotoObjectPromise.push(
      hbtGramPostPhotoModel.findOne({ postId: postId })
    );
  });

  // Get the array of hbt gram post photo objects from the array of promise by awaiting them
  arrayOfPhotoObject = await Promise.all(arrayOfPhotoObjectPromise);

  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: arrayOfPhotoObject,
  });
});

// The function to get post photos for user (based on which kinds of photo user show the most)
exports.getPostPhotosForUser = catchAsync(async (request, response, next) => {
  // Get user id of the user to show post photos for
  const userId = request.query.userId;

  // Get current location in list of the user
  const currentLocationInList = request.query.currentLocationInList;

  // List of photo labels for user
  const arrayOfPhotoLabelsForUser = [];

  // List of photo IDs of photos for the user
  const arrayOfPhotoIDs = [];

  // Reference the database to get list of photo labels visited by the user
  // Sort them in order of number of visit
  const listOfPhotoLabelVisit = await hbtGramPostPhotoLabelVisitModel
    .find({
      user: userId,
    })
    .sort({ numOfVisits: -1 });

  // Loop through that list of photo label visit and extract the photo label
  listOfPhotoLabelVisit.forEach((photoLabelVisit) => {
    arrayOfPhotoLabelsForUser.push(photoLabelVisit.visitedLabel);
  });

  // Reference the database to get list of photo label objects for the user based on array of photo labels for user
  // Array of photo label objects for the user
  const arrayOfPhotoLabelObjectsForUser = await hbtGramPostPhotoLabelModel
    .find({
      imageLabel: {
        $in: arrayOfPhotoLabelsForUser,
      },
      orderInCollection: {
        $lt: currentLocationInList,
      },
    })
    .sort({ $natural: -1 })
    .limit(5);

  // Loop through that list of photo label objects for user and extract the photo IDs
  arrayOfPhotoLabelObjectsForUser.forEach((photoLabelObject) => {
    arrayOfPhotoIDs.push(photoLabelObject.imageID);
  });

  // Reference the database to get list of photo URLs for photos that should be shown to user
  // based on list of photo IDs we got earlier (arrayOfPhotoIDs)
  const arrayOfPhotoObjectForUser = await hbtGramPostPhotoModel.find({
    _id: {
      $in: arrayOfPhotoIDs,
    },
  });

  // Return list of photo objects for user to the client
  response.status(200).json({
    status: "Done",
    data: arrayOfPhotoObjectForUser,
  });
});

//***************************** PHOTO RECOMMEND ***************************** */
// The function to get order in collection of latest photo label in the database
exports.getLatestPhotoLabelOrderInCollection = catchAsync(
  async (request, response, next) => {
    // Reference the database to get latest photo label in the collection
    const latestPhotoLabelInCollection = await hbtGramPostPhotoLabelModel
      .find()
      .sort({ $natural: -1 })
      .limit(1);

    response.status(200).json({
      status: "Done",
      data: latestPhotoLabelInCollection[0].orderInCollection,
    });
  }
);

// The function to create a new hbt gram photo label visit object or just to update the existing one
exports.createOrUpdateHBTGramPhotoLabelVisit = catchAsync(
  async (request, response, next) => {
    // Get user id
    const userId = request.query.userId;

    // Get photo label
    const photoLabel = request.query.photoLabel;

    // Reference the database to check if there is an existing photo label visit object between
    // the user and the photo label or not
    const photoLabelVisitObject = await hbtGramPostPhotoLabelVisitModel.findOne(
      {
        user: userId,
        visitedLabel: photoLabel,
      }
    );

    // If the photo label visit object between the user and the photo label is null
    // it means that it's not yet existed. Create one
    if (photoLabelVisitObject == null) {
      // Create the new photo label visit object between the user and the photo label
      // Num of visit will be 1 initially
      await hbtGramPostPhotoLabelVisitModel.create({
        user: userId,
        visitedLabel: photoLabel,
        numOfVisits: 1,
      });
    } // Otherwise, just update it
    else {
      // Get current number of visits
      const currentNumOfVisits = photoLabelVisitObject.numOfVisits;

      // Update num of visits (add 1)
      await hbtGramPostPhotoLabelVisitModel.findByIdAndUpdate(
        photoLabelVisitObject._id,
        {
          numOfVisits: currentNumOfVisits + 1,
        }
      );
    }

    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: "Post photo label visit object has been updated",
    });
  }
);

// The function to get photos for the user based on user search trend
exports.getPhotosForUser = catchAsync(async (request, response, next) => {
  // Get the user id
  const userId = request.query.userId;

  // Get current location in list for the user
  const currentLocationInList = request.query.currentLocationInList;

  console.log(userId)
  console.log(currentLocationInList)

  // Array of photos to be shown to the user
  var arrayOfPhotos = [];

  // Array of order in collection of last photos of every categories
  var arrayOfLastPhotoOrderInCollectionOfCategories = [];

  /* 
  We will divide this into 2 categories
  1. Top labels (1/4 of the labels visited by the user)
  2. Rest of the labels (3/4 remainng)
  */

  //******************* GET NUM OF LABELS VISITED BY USERS ******************* */
  // Reference the database to get all labels visited by the users
  const labelsVisitedByUser = await hbtGramPostPhotoLabelVisitModel.find({
    user: userId,
  });

  // Get number of labels visited by user
  const numOfLabelsVisited = labelsVisitedByUser.length;
  //******************* END GET NUM OF LABELS VISITED BY USERS ******************* */

  //******************* GET PHOTOS ASSOCIATED WITH TOP LABELS ******************* */
  // Array of top photo labels of the user
  var arrayOfTopPhotosLabel = [];

  // Array of photo ids to associated with photos to be shown to the user as top photos
  var arrayOfPhotoIds = [];

  // Get number of labels to be shown as top labels (1/4 of the total length)
  const numOfLabelsAsTopLabel = Math.floor(numOfLabelsVisited / 4);

  // Reference the database to get top labels visited by the user
  // Also have them ordered in descending order of visit frequency
  const topLabelsForUser = await hbtGramPostPhotoLabelVisitModel
    .find({
      user: userId,
    })
    .sort({ numOfVisits: -1 })
    .limit(numOfLabelsAsTopLabel);

  // Loop through that list of labels for user to get list of photo labels
  topLabelsForUser.forEach((label) => {
    arrayOfTopPhotosLabel.push(label.visitedLabel);
  });

  // Reference the database to get list of photos associated with top labels for the user (just image id at this point)
  const listOfTopPhotos = await hbtGramPostPhotoLabelModel
    .find({
      imageLabel: {
        $in: arrayOfTopPhotosLabel,
      },
      orderInCollection: {
        $lt: currentLocationInList,
      },
    })
    .limit(5);

  // Loop through that list of top photos to extract their ids
  listOfTopPhotos.forEach((photo) => {
    arrayOfPhotoIds.push(photo.imageID);
  });

  // Get num of visits of the last image label in the array of top label images
  // so that when we start loading remaining labels, we will know where to start from
  const numOfVisitsOfLastImageLabelInListOfTopLabel =
    topLabelsForUser[topLabelsForUser.length - 1].numOfVisits;

  // Reference the database to get list of photos associated with top labels to be shown to the user
  // Just take 5 images each time (load more in the future)
  const listOfTopLabelPhotos = await hbtGramPostPhotoModel
    .find({
      _id: {
        $in: arrayOfPhotoIds,
      },
    })
    .sort({ $natural: -1 });

  // Add list of top label photos to the array of photos to be shown to the user
  arrayOfPhotos = arrayOfPhotos.concat(listOfTopLabelPhotos);

  // Add last photo order in collection of this category to the array
  // In some cases, there will be no photos in the array of photos of top labels
  // if that happenn, add 0 to the array of last photo order in collection
  if (listOfTopPhotos[listOfTopPhotos.length - 1] != undefined) {
    arrayOfLastPhotoOrderInCollectionOfCategories.push(
      listOfTopPhotos[listOfTopPhotos.length - 1].orderInCollection
    );
  } else {
    arrayOfLastPhotoOrderInCollectionOfCategories.push(0);
  }
  //******************* END GET PHOTOS ASSOCIATED WITH TOP LABELS ******************* */

  //******************* GET PHOTOS ASSOCIATED WITH REST OF THE LABELS ******************* */
  // Array of photo ids of photos associated with rest of labels to be shown to the user
  var arrayOfPhotoLabelForTheRest = [];

  // Array of photo ids to show to the user as rest of the photos
  var arrayOfPhotoIdRestOfThePhotos = [];

  // Reference the database to load rest of the labels visited by the user (also ordered in descending order of visit frequency)
  // Frequency of visits here should be less than or equal to the one of top labels
  const restOfLabelsForUser = await hbtGramPostPhotoLabelVisitModel
    .find({
      user: userId,
      numOfVisits: {
        $lt: numOfVisitsOfLastImageLabelInListOfTopLabel,
      },
    })
    .sort({ numOfVisits: -1 });

  // Loop through list of rest of the labels to get list of photo labels
  restOfLabelsForUser.forEach((label) => {
    arrayOfPhotoLabelForTheRest.push(label.visitedLabel);
  });

  // Reference the database to get list of photos associated with rest of the labels (just image id at this point)
  // Just take 5 images each time (load more in the future)
  const listOfRestOfThePhotos = await hbtGramPostPhotoLabelModel
    .find({
      imageLabel: {
        $in: arrayOfPhotoLabelForTheRest,
      },
      orderInCollection: {
        $lt: currentLocationInList,
      },
    })
    .limit(5);

  // Loop through that list of photos associated with rest of the label for user to get list of photo ids
  listOfRestOfThePhotos.forEach((label) => {
    arrayOfPhotoIdRestOfThePhotos.push(label.imageID);
  });

  // Exclude pictures that are already shown in previous category
  arrayOfPhotoIdRestOfThePhotos = arrayOfPhotoIdRestOfThePhotos.filter(
    (x) => !arrayOfPhotoIds.includes(x)
  );

  // Reference the database to get list of photos associated with rest of the labels to be shown to the user
  const listOfRestOfTheLabelPhotos = await hbtGramPostPhotoModel
    .find({
      _id: {
        $in: arrayOfPhotoIdRestOfThePhotos,
      },
    })
    .sort({ $natural: -1 });

  // Add list of photos associated with rest of the labels to the array of photos to be shown to the user
  arrayOfPhotos = arrayOfPhotos.concat(listOfRestOfTheLabelPhotos);

  // Add last photo order in collection of this category to the array
  // In some cases, there will be no photos in the array of photos of rest of the labels
  // if that happenn, add 0 to the array of last photo order in collection
  if (listOfRestOfThePhotos[listOfRestOfThePhotos.length - 1] != undefined) {
    arrayOfLastPhotoOrderInCollectionOfCategories.push(
      listOfRestOfThePhotos[listOfRestOfThePhotos.length - 1].orderInCollection
    );
  } else {
    arrayOfLastPhotoOrderInCollectionOfCategories.push(0);
  }
  //******************* END GET PHOTOS ASSOCIATED WITH REST OF THE LABELS ******************* */

  // Compare order in collection of last posts in those 2 categogies
  // Whichever smallest will be considered as user's new current location in list
  // If there is no element in the array of collection, let new current location in list be 0
  let newCurrentLocationInList = 0;

  if (arrayOfLastPhotoOrderInCollectionOfCategories.length != 0) {
    newCurrentLocationInList = Math.min(
      ...arrayOfLastPhotoOrderInCollectionOfCategories
    );
  }

  //************************* GO BACK AND GET REMAINING PHOTOS ************************** */
  /*
  When getting order in collection of last posts in those 3 categories
  we may end up ignoring some other posts in between
  Hence, go back and get them
  */

  // Array of photo ids associated with more photos to be shown to the user as top photos
  var arrayOfMorePhotoIds = [];

  // Array of photo ids associated with more photos to be shown to the user as rest of the labels photo
  var arrayOfMorePhotoIdsRestOfTheLabel = [];

  // Get more photos from top labels
  // Only load if last post order in collection of this category is not 0
  if (arrayOfLastPhotoOrderInCollectionOfCategories[0] != 0) {
    // Reference the database to get list of more photos associated with top labels for the user (just image id at this point)
    const listOfTopPhotosMore = await hbtGramPostPhotoLabelModel.find({
      imageLabel: {
        $in: arrayOfTopPhotosLabel,
      },
      orderInCollection: {
        $lt: arrayOfLastPhotoOrderInCollectionOfCategories[0],
        $gt: newCurrentLocationInList,
      },
    });

    // Loop through that list of top photos to extract their ids
    listOfTopPhotosMore.forEach((photo) => {
      arrayOfMorePhotoIds.push(photo.imageID);
    });

    // Find photos based on list of ids
    const listOfTopLabelPhotosMore = await hbtGramPostPhotoModel
      .find({
        _id: {
          $in: arrayOfMorePhotoIds,
        },
      })
      .sort({ $natural: -1 });

    // Add them to array of photos for user
    arrayOfPhotos = arrayOfPhotos.concat(listOfTopLabelPhotosMore);
  }

  // Get more photo from rest of the labels
  // Only load if last post order in collection of this category is not 0
  if (arrayOfLastPhotoOrderInCollectionOfCategories != 0) {
    // Reference the database to load rest of the labels visited by the user
    const listOfRestOfThePhotosMore = await hbtGramPostPhotoLabelModel.find({
      imageLabel: {
        $in: arrayOfPhotoLabelForTheRest,
      },
      orderInCollection: {
        $lt: arrayOfLastPhotoOrderInCollectionOfCategories[1],
        $gt: newCurrentLocationInList,
      },
    });

    // Loop through that list of top photos to extract their ids
    listOfRestOfThePhotosMore.forEach((photo) => {
      arrayOfMorePhotoIdsRestOfTheLabel.push(photo.imageID);
    });

    // Exclude pictures that are already shown in previous category
    arrayOfMorePhotoIdsRestOfTheLabel = arrayOfMorePhotoIdsRestOfTheLabel.filter(
      (x) => !arrayOfMorePhotoIds.includes(x)
    );

    // Reference the database to get list of photos associated with rest of the labels to be shown to the user
    const listOfRestOfTheLabelPhotosMore = await hbtGramPostPhotoModel
      .find({
        _id: {
          $in: arrayOfMorePhotoIdsRestOfTheLabel,
        },
      })
      .sort({ $natural: -1 });

    // Add them to array of photos for user
    arrayOfPhotos = arrayOfPhotos.concat(listOfRestOfTheLabelPhotosMore);
  }
  //************************* END GO BACK AND GET REMAINING PHOTOS ************************** */

  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: arrayOfPhotos,
    newCurrentLocationInList: newCurrentLocationInList,
  });
});
//***************************** END PHOTO RECOMMEND ***************************** */

// The function to delete a post photo based on id
exports.deleteHBTGramPostPhoto = async (postId) => {
  // Array of photo ids of photos belong to the specified post id
  var arrayOfPhotoIds = []

  // Array of photo URLs of photos belong to the specified post id
  var arrayOfPhotoURLs = []
  
  // Reference the database to get all photos belong to the specified post id
  const photosOfPost = await hbtGramPostPhotoModel.find({
    postId: postId
  })

  // Loop through the obtained list of photos belong to the specified post id to get their id
  // also to get their URLs
  photosOfPost.forEach(photo => {
    arrayOfPhotoIds.push(photo._id)
    arrayOfPhotoURLs.push(photo.imageURL)
  })

  // Loop through that list of photo ids and delete all photo labels associated with them
  for (i = 0; i < arrayOfPhotoIds.length; i++) {
    // Call the function to delete photo labels of the specified photo id
    await hbtGramPostPhotoLabelController.deleteAllPhotoLabelOfPhoto(arrayOfPhotoIds[i])
  }

  // Return the array of image URLs of post photos to be deleted
  return arrayOfPhotoURLs
}