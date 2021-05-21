// Import the cuckoo post model
const cuckooPostModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostModel`);

// Import the cuckooPostPhotoLabelModel
const cuckooPostPhotoLabelModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostPhotoLabelModel`);

// Import the cuckooPostPhotoLabelVisitModel
const cuckooPostPhotoLabelVisitModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostPhotoLabelVisitModel`);

// Import the Cuckoo post photo model
const cuckooPostPhotoModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostPhotoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Import the cuckooPostPhotoLabelController
const cuckooPostPhotoLabelController = require(`${__dirname}/cuckooPostPhotoLabelController`);

// The function to get all post photo
exports.getAllPostPhotos = factory.getAllDocuments(cuckooPostPhotoModel);

// The function to create new post photo
exports.createNewPostPhoto = factory.createDocument(cuckooPostPhotoModel);

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
  const postCreatedByUser = await cuckooPostModel.find({ writer: userId });

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
      cuckooPostPhotoModel.findOne({ postId: postId })
    );
  });

  // Get the array of post photo objects from the array of promise by awaiting them
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
  const listOfPhotoLabelVisit = await cuckooPostPhotoLabelVisitModel
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
  const arrayOfPhotoLabelObjectsForUser = await cuckooPostPhotoLabelModel
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
  const arrayOfPhotoObjectForUser = await cuckooPostPhotoModel.find({
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
    const latestPhotoLabelInCollection = await cuckooPostPhotoLabelModel
      .find()
      .sort({ $natural: -1 })
      .limit(1);

    response.status(200).json({
      status: "Done",
      data: latestPhotoLabelInCollection[0].orderInCollection,
    });
  }
);

// The function to create a new photo label visit object or just to update the existing one
exports.createOrUpdatePhotoLabelVisit = catchAsync(
  async (request, response, next) => {
    // Get user id
    const userId = request.query.userId;

    // Get photo label
    const photoLabel = request.query.photoLabel;

    // Reference the database to check if there is an existing photo label visit object between
    // the user and the photo label or not
    const photoLabelVisitObject = await cuckooPostPhotoLabelVisitModel.findOne({
      user: userId,
      visitedLabel: photoLabel,
    });

    // If the photo label visit object between the user and the photo label is null
    // it means that it's not yet existed. Create one
    if (photoLabelVisitObject == null) {
      // Create the new photo label visit object between the user and the photo label
      // Num of visit will be 1 initially
      await cuckooPostPhotoLabelVisitModel.create({
        user: userId,
        visitedLabel: photoLabel,
        numOfVisits: 1,
      });
    } // Otherwise, just update it
    else {
      // Get current number of visits
      const currentNumOfVisits = photoLabelVisitObject.numOfVisits;

      // Update num of visits (add 1)
      await cuckooPostPhotoLabelVisitModel.findByIdAndUpdate(
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

  // Array of photos to be shown to the user
  var arrayOfPhotos = [];

  //******************* GET PHOTOS ASSOCIATED WITH TOP LABELS ******************* */
  // Array of top photo labels of the user
  var arrayOfTopPhotosLabel = [];

  // Array of photo ids to associated with photos to be shown to the user as top photos
  var arrayOfPhotoIds = [];

  // Reference the database to get top labels visited by the user
  // Also have them ordered in descending order of visit frequency
  const topLabelsForUser = await cuckooPostPhotoLabelVisitModel
    .find({
      user: userId
    })
    //sort({ numOfVisits: -1 })

  // Loop through that list of labels for user to get list of photo labels
  topLabelsForUser.forEach((label) => {
    arrayOfTopPhotosLabel.push(label.visitedLabel);
  });

  // Location for next load. Since we will load just one label each time
  // We need to keep track of location for next load
  var locationForNextLoad = currentLocationInList;

  // We will need 5 photo ids and each photo may have several labels
  // Hence, we will need to loop until we have 5 different image ids
  while (arrayOfPhotoIds.length < 5) {    
    // Reference the database to get the photo label
    const photoLabel = await cuckooPostPhotoLabelModel.find({
      imageLabel: {
        $in: arrayOfTopPhotosLabel,
      },
      orderInCollection: {
        $lt: locationForNextLoad,
      }
    })
    .sort({ orderInCollection: -1 })
    .limit(1)

    // If there is no more image labels, get out of the loop
    if (photoLabel.length == 0) {
      break
    }

    // Check image id of this label to see if this image is already in list or not
    // If it is not included, add this photo id to the array of photo ids for user
    if (!arrayOfPhotoIds.includes(photoLabel[0].imageID)) {
      arrayOfPhotoIds.push(photoLabel[0].imageID)
    }

    // Update location for next load
    locationForNextLoad = (photoLabel[0].orderInCollection)
  }

  // Reference the database to get list of photos associated with top labels to be shown to the user
  // Just take 5 images each time (load more in the future)
  // They should also be sorted in descending order
  const listOfTopLabelPhotos = await cuckooPostPhotoModel
    .find({
      _id: {
        $in: arrayOfPhotoIds,
      },
    })
    .sort({ $natural: -1 });

  // Add list of top label photos to the array of photos to be shown to the user
  arrayOfPhotos = arrayOfPhotos.concat(listOfTopLabelPhotos);
  //******************* END GET PHOTOS ASSOCIATED WITH TOP LABELS ******************* */

  if (arrayOfPhotos.length < 5) {
    // Return response to the client and let the client know that there is no more picture
    response.status(200).json({
      status: "Done",
      data: arrayOfPhotos,
      newCurrentLocationInList: 0
    })
  } else {
    // Return response to the client
    response.status(200).json({
      status: "Done",
      data: arrayOfPhotos,
      newCurrentLocationInList: locationForNextLoad,
    });
  }
});
//***************************** END PHOTO RECOMMEND ***************************** */

// The function to delete a post photo based on id
exports.deletePostPhoto = async (postId) => {
  // Array of photo ids of photos belong to the specified post id
  var arrayOfPhotoIds = [];

  // Array of photo URLs of photos belong to the specified post id
  var arrayOfPhotoURLs = [];

  // Reference the database to get all photos belong to the specified post id
  const photosOfPost = await cuckooPostPhotoModel.find({
    postId: postId,
  });

  // Loop through the obtained list of photos belong to the specified post id to get their id
  // also to get their URLs
  photosOfPost.forEach((photo) => {
    arrayOfPhotoIds.push(photo._id);
    arrayOfPhotoURLs.push(photo.imageURL);
  });

  // Loop through that list of photo ids and delete all photo labels associated with them
  for (i = 0; i < arrayOfPhotoIds.length; i++) {
    // Call the function to delete photo labels of the specified photo id
    await cuckooPostPhotoLabelController.deleteAllPhotoLabelOfPhoto(
      arrayOfPhotoIds[i]
    );
  }

  // Delete all photos that are associated with the specified post id
  await cuckooPostPhotoModel.deleteMany({
    postId: postId
  })

  // Return the array of image URLs of post photos to be deleted
  return arrayOfPhotoURLs;
};
