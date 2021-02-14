// Import the cuckoo follow model
const cuckooFollowModel = require(`${__dirname}/../../model/cuckooModel/cuckooFollowModel`);

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// Lambda expression to count array occurence
const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

// The function to get list of users that is recommended to the specified user
exports.getRecommendedUsers = catchAsync(async (request, response, next) => {
  // Get user id of the user to get recommendation
  const userId = request.query.userId;

  // Array of user ids that are followed by the specified user
  var arrayOfUsersFollowedBySpecifiedUser = [];

  // Array of total following (array of users that followed by users that are followed
  // by the specified user)
  var arrayOfTotalFollowing = [];

  // Array of users may be recommended (no duplication version of the array of total following)
  var arrayOfUsersMayBeRecommended = [];

  // Array of number of mutual followers (number of occurence of user that may be recommended in the
  // array of total following. This is parallel with the array of users may be recommended)
  var arrayOfNumberOfMutualFollowers = [];

  // Reference the database to get list of user objects followedby the specified user
  const usersFollowedBySpecifiedUser = await cuckooFollowModel.find({
    follower: userId,
  });

  // Loop through that list of user objects to get their ids
  usersFollowedBySpecifiedUser.forEach((user) => {
    arrayOfUsersFollowedBySpecifiedUser.push(user.following);
  });

  // For each user in list of users followed by the specified user, get list of users that
  // they are following and add them to the array of total following
  for (i = 0; i < arrayOfUsersFollowedBySpecifiedUser.length; i++) {
    // Reference the database to get list of users that this user is following
    const listOfUsers = await cuckooFollowModel.find({
      follower: arrayOfUsersFollowedBySpecifiedUser[i],
    });

    // Loop through that list of users and get their ids
    listOfUsers.forEach((follow) => {
      arrayOfTotalFollowing.push(follow.following);
    });
  }

  // For each of every user in the array of total following, check to see if it's already in the
  // array of users may be recommended or not (since array of users may be recommended has no duplication)
  // Also, this list must not include users that have already been followed by the specified user
  // and the specified user itself
  arrayOfTotalFollowing.forEach((userIdInner) => {
    // If the array of users maybe recommended already have it, don't add it
    if (
      !arrayOfUsersMayBeRecommended.includes(userIdInner) &&
      userIdInner != userId &&
      !arrayOfUsersFollowedBySpecifiedUser.includes(userIdInner)
    ) {
      // Add user of to the array of users may be recommended
      arrayOfUsersMayBeRecommended.push(userIdInner);
    }
  });

  // Loop through the list of users that may be recommend to get their number of mutual followers
  arrayOfUsersMayBeRecommended.forEach((user) => {
    arrayOfNumberOfMutualFollowers.push(
      countOccurrences(arrayOfTotalFollowing, user)
    );
  });

  // Return response to the client
  response.status(200).json({
    status: "Done",
    arrayOfRecommendedUsers: arrayOfUsersMayBeRecommended,
    arrayOfNumberOfMutualFollowers: arrayOfNumberOfMutualFollowers,
  });
});
