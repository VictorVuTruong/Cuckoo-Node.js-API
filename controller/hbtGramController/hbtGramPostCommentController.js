const { request } = require("express");
const { response } = require("../../app");

// Import the hbt gram post comment model
const hbtGramPostCommentModel = require(`${__dirname}/../../model/hbtGramModel/hbtGramPostCommentModel`);

// Import the hbt gram post comment photo controller
const hbtGramPostCommentPhotoController = require(`${__dirname}/hbtGramPostCommentPhotoController`)

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all HBT gram post comments
exports.getAllHBTGramPostComments = factory.getAllDocuments(
    hbtGramPostCommentModel
);

// The function to create new HBT gram post comment
exports.createNewHBTGramPostComment = factory.createDocument(
    hbtGramPostCommentModel
);

// The function to delete a HBT gram post comment
exports.deleteHBTGramPostComment = factory.deleteOne(
    hbtGramPostCommentModel
);

// The function to delete comments associated with the specified post
exports.deleteCommentsOfPost = async (postId) => { 
    // Reference the database to get comments belong to the specified post id
    const commentsOfPost = await hbtGramPostCommentModel.find({
        postId: postId
    })

    // Array of post comment photos to be deleted
    var arrayOfPostCommentPhotosToBeDeleted = []

    // Loop through that array of comment ids to start deleting
    // Some comments are photos. So, we will need to check if the comment
    // to be deleted is photo or not
    for (i = 0; i < commentsOfPost.length; i++) {
        // Check to see if the comment is photo or not
        if (commentsOfPost[i].content === "image") {
            // If it is image, delete that image as well as the comment
            // also obtain the array of image URLs to be deleted
            arrayOfPostCommentPhotosToBeDeleted = arrayOfPostCommentPhotosToBeDeleted.concat(await hbtGramPostCommentPhotoController.deleteHBTGramPostCommentPhotoBasedOnCommentId(commentsOfPost[i]._id))

            // Delete the comment itself after photo of the comment is removed
            await hbtGramPostCommentModel.deleteOne({
                _id: commentsOfPost[i]._id
            })
        } // If the comment does not have any photo, just delete the comment
        else {
            // Delete the the comment
            await hbtGramPostCommentModel.deleteOne({
                _id: commentsOfPost[i]._id
            })
        }
    }

    // Return the array of post comment photos to be deleted
    return arrayOfPostCommentPhotosToBeDeleted
}

// The function to delete a comment with a specified id
exports.deleteCommentWithId = catchAsync(async (request, response, next) => {
    // Get the comment id
    const commentId = request.query.commentId

    // Reference the database to get comment object of a comment with specified id
    const commentObjectBasedOnId = await hbtGramPostCommentModel.findOne({
        _id: commentId
    })

    // Check to see if the comment is an image or not
    if (commentObjectBasedOnId.content == "image") {
        // If it is an image, call the function to delete the photo that is associated with the post
        await hbtGramPostCommentPhotoController.deleteHBTGramPostCommentPhotoBasedOnCommentId(commentId)
    }

    // Delete the comment object itself
    await hbtGramPostCommentModel.deleteOne({
        _id: commentId
    })

    // Return response to the client
    response.status(200).json({
        status: "Done",
        data: "Comment has been deleted"
    })
})