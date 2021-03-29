const { request, response } = require("express");

// Import the cuckooNotificationSocketModel
const cuckooNotificationSocketModel = require(`${__dirname}/../../model/notificationSocketModel/notificationSocketModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// Import the catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

// The function to get all notication sockets
exports.getAllNotificationSocket = factory.getAllDocuments(cuckooNotificationSocketModel);

// The functionn to create new notification socket
exports.createNewNotificationSocket = factory.createDocument(cuckooNotificationSocketModel);

// The function to delete a notification socket
exports.deleteNotificationSocket = catchAsync(async (request, response, next) => {
    // Get user id of the user to remove socket
    const userId = request.query.userId

    // Get socket id of the socket to remove socket
    const socketId = request.query.socketId

    // Delete the found socket
    await cuckooNotificationSocketModel.deleteOne({
        user: userId,
        socketId: socketId
    })

    // Return response to the client app
    response.status(204).json({
        status: "Done",
    });
})