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

    // Get device model of the device to remove socket
    const deviceModel = request.query.deviceModel

    // Get socket id of the socket to remove socket
    const socketId = request.query.socketId

    // Delete the found socket
    await cuckooNotificationSocketModel.deleteOne({
        user: userId,
        socketId: socketId,
        deviceModel: deviceModel
    })

    // Return response to the client app
    response.status(204).json({
        status: "Done",
    });
})

// The function to check and create new notification socket
// in some cases, the user upload notification socket id that is already exist
// if that is the case, don't do anything
exports.checkAndCreateNotificationSocket = catchAsync(async (request, response, next) => {
    // User id of the user to create new notification socket
    const userId = request.query.userId

    // Socket id of the socket to create
    const socketId = request.query.socketId

    // Reference the database to check and see if user id with that specified socket id is exist or not
    const notificationSocketObject = await cuckooNotificationSocketModel.findOne({
        user: userId,
        socketId: socketId
    })
    
    // If the notification socket object is null, it means that the socket id has not been registered
    // if that is the case, create it
    if (notificationSocketObject == null) {
        await cuckooNotificationSocketModel.create({
            user: userId,
            socketId: socketId
        })

        // Return response to the client app
        response.status(200).json({
            status: "Done",
            data: "Socket has been created"
        })
    } else {
        // Return response to the client app and let the app knows that there is no need to create new socket
        response.status(200).json({
            status: "Done",
            data: "There is no need to create new socket for that socket id"
        })
    }
})

// The function to update notification socket in case it is changed for user
exports.updateNotificationSocket = catchAsync(async (request, response, next) => {
    // Get user id of user that needs to update notification socket
    const userId = request.body.userId

    // Get device model that needs to update notification socket
    const deviceModel = request.body.deviceModel
    
    // Get new socket id of the user
    const newSocketId = request.body.socketId

    // Reference the database to check and see if specified device model and user here
    // has been registered or not
    const socketObjectOfUser = await cuckooNotificationSocketModel.findOne({
        user: userId,
        deviceModel: deviceModel
    })

    // If the socket object is not null, it means that socket has been registered for that user and device
    // we just need to update it
    if (socketObjectOfUser != null) {
        // Update the socket
        await cuckooNotificationSocketModel.findOneAndUpdate({
            user: userId,
            deviceModel: deviceModel
        }, {
            user: userId,
            deviceModel: deviceModel,
            socketId: newSocketId
        })
    } else {
        // Otherwise, create one
        await cuckooNotificationSocketModel.create({
            user: userId,
            deviceModel: deviceModel,
            socketId: newSocketId
        })
    }

    // Return response to the client
    response.status(200).json({
        status: "Done",
        data: "Notification socket has been updated"
    })
})