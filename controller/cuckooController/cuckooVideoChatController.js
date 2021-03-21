const { request, response } = require("express");

// Import twillio SDK
const twillio = require('twilio');

// Import video grant class
const { VideoGrant } = require("twilio/lib/jwt/AccessToken");

// Import access token class
const AccessToken = require("twilio/lib/jwt/AccessToken");

// Import catchAsync
const catchAsync = require(`${__dirname}/../../utils/catchAsync`);

//Secret 4UTfKT7Atbxxx1qrhd1rPQtUZ4IXhkv8
//SID SK1ed0c52df9e56d67d5be51885a7e0769

// The function to grant access for user with specified user id to get into the video chat room
exports.grantVideoChatAccess = catchAsync(async (request, response, next) => {
    // Get user id of the user requesting for token
    const userId = request.query.userId

    // Get room id of room that user want to join
    const roomId = request.query.roomId

    // Get account SID
    const accountSID = process.env.TWILIO_ACCOUNT_SID

    // Get API key SID
    const apiKeySID = process.env.TWILIO_API_KEY_SID

    // Get API key secret
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET

    // Create access token
    const accessToken = new AccessToken(
        accountSID,
        apiKeySID,
        apiKeySecret
    )

    // Set identity for the token (user id of the user requesting for token)
    accessToken.identity = userId

    // Grant access to the token
    const grant = new VideoGrant()
    //grant.room = roomId
    accessToken.addGrant(grant)

    // Serialize token as a JWT
    const jwt = accessToken.toJwt()
    
    // Return response to the client requesting for access token
    response.status(200).json({
        accessToken: jwt
    })
})

// The function to create a room
exports.createRoom = catchAsync(async (request, response, next) => {
    // Get name of the chat room to create
    const chatRoomName = request.query.chatRoomName
    
    // Get account SID
    const accountSID = process.env.TWILIO_ACCOUNT_SID

    // Get account auth token
    const accountAuthToken = process.env.TWILIO_AUTH_TOKEN

    // Create client object
    const client = require('twilio')(accountSID, accountAuthToken)

    // Create room
    client.video.rooms
        .create({
            type: 'go',
            uniqueName: chatRoomName
        })
        .then(room => {
            console.log("Done")
            
            response.status(201).json({
                status: "Success. Room created",
                name: chatRoomName,
                roomSID: room.sid
            })
        }).catch(error => {
            console.log(error)
        })
})