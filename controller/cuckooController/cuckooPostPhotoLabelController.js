// Import the cuckooPostPhotoLabelModel
const cuckooPostPhotoLabelModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostPhotoLabelModel`);

// Import the cuckooPostPhotoLabelVisitModel
const cuckooPostPhotoLabelVisitModel = require(`${__dirname}/../../model/cuckooModel/cuckooPostPhotoLabelVisitModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all post photo label
exports.getAllPostPhotoLabel = factory.getAllDocuments(
  cuckooPostPhotoLabelModel
);

// The function to create new post photo label
exports.createNewPostPhotoLabel = factory.createDocument(
  cuckooPostPhotoLabelModel
);

// The function to update user photo label visit
exports.updatePhotoLabelVisit = catchAsync(async (request, response, next) => {
  // Get user id of the user who come to visit a photo label
  const visitorUserId = request.query.visitorUserId;

  // Get photo label visited by the user
  const visitedPhotoLabel = request.query.visitedPhotoLabel;

  // Reference the database to get check and see if there is a post photo label visit object
  // betweent the user and the photo label or not
  const photoLabelVisitObjectBetween2Users = await cuckooPostPhotoLabelVisitModel.findOne(
    {
      user: visitorUserId,
      visitedLabel: visitedPhotoLabel,
    }
  );

  // If the photo label visit object between user and photo is null, create one
  if (photoLabelVisitObjectBetween2Users == null) {
    // Create the photo label visit object between user and the photo
    // Number of visit will be 1 initially
    await cuckooPostPhotoLabelVisitModel.create({
      user: visitorUserId,
      visitedLabel: visitedPhotoLabel,
      numOfVisits: 1,
    });
  } // If the post photo label visit object between the user and photo is already existed
  // just update it (increase num of visits by 1)
  else {
    // Get current number of visits
    const currentNumOfVisits = photoLabelVisitObjectBetween2Users.numOfVisits;

    // Update the post photo label visit object between user and photo
    await cuckooPostPhotoLabelVisitModel.findByIdAndUpdate(
      photoLabelVisitObjectBetween2Users._id,
      {
        user: visitorUserId,
        visitedLabel: visitedPhotoLabel,
        numOfVisits: currentNumOfVisits + 1,
      }
    );
  }

  // Return response to the client
  response.status(200).json({
    status: "Done",
    data: "Num of photo label visits updated",
  });
});

// The function to delete all photo label of the specified photo id
exports.deleteAllPhotoLabelOfPhoto = catchAsync(async (photoId) => {
  // Delete all photo labels of the photo
  await cuckooPostPhotoLabelModel.deleteMany({
    imageID: photoId,
  });
});
