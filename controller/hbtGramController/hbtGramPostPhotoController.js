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

// The function to get all hbt gram post photo
exports.getAllHBTGramPostPhotos = factory.getAllDocuments(
  hbtGramPostPhotoModel
);

// The function to create new hbt gram post photo
exports.createNewHBTGramPostPhoto = factory.createDocument(
  hbtGramPostPhotoModel
);

// The function to delete a hbt gram post photo
exports.deleteHBTGramPostPhoto = factory.deleteOne(hbtGramPostPhotoModel);

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
// The function to create a new hbt gram photo label visit object or just to update the existing one
exports.createOrUpdateHBTGramPhotoLabelVisit = catchAsync(async (request, response, next) => {
  // Get user id
  const userId = request.query.userId

  // Get photo label
  const photoLabel = request.query.photoLabel

  // Reference the database to check if there is an existing photo label visit object between
  // the user and the photo label or not
  const photoLabelVisitObject = await hbtGramPostPhotoLabelVisitModel.findOne({
      user: userId,
      visitedLabel: photoLabel
  })

  // If the photo label visit object between the user and the photo label is null
  // it means that it's not yet existed. Create one
  if (photoLabelVisitObject == null) {
      // Create the new photo label visit object between the user and the photo label
      // Num of visit will be 1 initially
      await hbtGramPostPhotoLabelVisitModel.create({
          user: userId,
          visitedLabel: photoLabel,
          numOfVisits: 1
      })
  } // Otherwise, just update it
  else {
      // Get current number of visits
      const currentNumOfVisits = photoLabelVisitObject.numOfVisits

      // Update num of visits (add 1)
      await hbtGramPostPhotoLabelVisitModel.findByIdAndUpdate(
          photoLabelVisitObject._id,
          {
              numOfVisits: currentNumOfVisits + 1
          }
      )
  }

  // Return response to the client
  response.status(200).json({
      status: "Done",
      data: "Post photo label visit object has been updated"
  })
})

// The function to get photos for the user based on user search trend
exports.getPhotosForUser = catchAsync(async (request, response, next) => {
  // Get the user id
  const userId = request.query.userId

  // Array of photos to be shown to the user
  var arrayOfPhotos = []

  /* 
  We will divide this into 2 categories
  1. Top labels (1/4 of the labels visited by the user)
  2. Rest of the labels (3/4 remainng)
  */

  //******************* GET NUM OF LABELS VISITED BY USERS ******************* */
  // Reference the database to get all labels visited by the users
  const labelsVisitedByUser = await hbtGramPostPhotoLabelVisitModel.find({
      user: userId
  })

  // Get number of labels visited by user
  const numOfLabelsVisited = labelsVisitedByUser.length
  //******************* END GET NUM OF LABELS VISITED BY USERS ******************* */

  //******************* GET PHOTOS ASSOCIATED WITH TOP LABELS ******************* */
  // Array of top photo labels of the user
  var arrayOfTopPhotosLabel = []
  
  // Array of photo ids to associated with photos to be shown to the user as top photos
  var arrayOfPhotoIds = []
  
  // Get number of labels to be shown as top labels (1/4 of the total length)
  const numOfLabelsAsTopLabel = Math.floor(numOfLabelsVisited / 4)

  console.log(numOfLabelsAsTopLabel)

  // Reference the database to get top labels visited by the user
  // Also have them ordered in descending order of visit frequency
  const topLabelsForUser = await hbtGramPostPhotoLabelVisitModel.find({
    user: userId
  })
  .sort({numOfVisits: -1})
  .limit(2)

  // Loop through that list of labels for user to get list of photo labels
  topLabelsForUser.forEach(label => {
    arrayOfTopPhotosLabel.push(label.visitedLabel)
  })

  // Reference the database to get list of photos associated with top labels for the user (just image id at this point)
  const listOfTopPhotos = await hbtGramPostPhotoLabelModel.find({
    imageLabel: {
      $in: arrayOfTopPhotosLabel
    }
  })

  // Loop through that list of top photos to extract their ids
  listOfTopPhotos.forEach(photo => {
    arrayOfPhotoIds.push(photo.imageID)
  })

  // Get num of visits of the last image label in the array of top label images
  // so that when we start loading remaining labels, we will know where to start from
  const numOfVisitsOfLastImageLabelInListOfTopLabel = topLabelsForUser[topLabelsForUser.length - 1].numOfVisits

  // Reference the database to get list of photos associated with top labels to be shown to the user
  // Just take 5 images each time (load more in the future)
  const listOfTopLabelPhotos = await hbtGramPostPhotoModel.find({
      _id: {
          $in: arrayOfPhotoIds
      }
  }).limit(5)

  // Add list of top label photos to the array of photos to be shown to the user
  arrayOfPhotos = arrayOfPhotos.concat(listOfTopLabelPhotos)
  //******************* END GET PHOTOS ASSOCIATED WITH TOP LABELS ******************* */

  //******************* GET PHOTOS ASSOCIATED WITH REST OF THE LABELS ******************* */
  // Array of photo ids of photos associated with rest of labels to be shown to the user
  var arrayOfPhotoLabelForTheRest = []

  // Array of photo ids to show to the user as rest of the photos
  var arrayOfPhotoIdRestOfThePhotos = []
  
  // Reference the database to load rest of the labels visited by the user (also ordered in descending order of visit frequency)
  // Frequency of visits here should be less than or equal to the one of top labels
  const restOfLabelsForUser = await hbtGramPostPhotoLabelVisitModel.find({
      user: userId,
      numOfVisits: {
        $lte: numOfVisitsOfLastImageLabelInListOfTopLabel
      }
  })
  .sort({numOfVisits: -1})

  // Loop through list of rest of the labels to get list of photo labels
  restOfLabelsForUser.forEach(label => {
    arrayOfPhotoLabelForTheRest.push(label.visitedLabel)
  })

  // Reference the database to get list of photos associated with rest of the labels (just image id at this point)
  const listOfRestOfThePhotos = await hbtGramPostPhotoLabelModel.find({
    imageLabel: {
      $in: arrayOfPhotoLabelForTheRest
    }
  })

  // Loop through that list of photos associated with rest of the label for user to get list of photo ids
  listOfRestOfThePhotos.forEach(label => {
    arrayOfPhotoIdRestOfThePhotos.push(label.imageID)
  })

  // Reference the database to get list of photos associated with rest of the labels to be shown to the user
  // Just take 5 images each time (load more in the future)
  const listOfRestOfTheLabelPhotos = await hbtGramPostPhotoModel.find({
      _id: {
          $in: arrayOfPhotoIdRestOfThePhotos
      }
  }).limit(5)

  // Add list of photos associated with rest of the labels to the array of photos to be shown to the user
  arrayOfPhotos = arrayOfPhotos.concat(listOfRestOfTheLabelPhotos)
  //******************* END GET PHOTOS ASSOCIATED WITH REST OF THE LABELS ******************* */

  // Return response to the client
  response.status(200).json({
      status: "Done",
      data: arrayOfPhotos
  })
})
//***************************** END PHOTO RECOMMEND ***************************** */