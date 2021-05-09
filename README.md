# Cuckoo-Node.js-API

# About Cuckoo
This is the social network that is capable of doing several basic functionalities of existing social networking app such as Instagram, Tinder, Snapchat <br>
This is the server as well as API of the Cuckoo social network, this social network will also support other platforms such as iOS and Web. <br>

# Basic functionalities includes:
1. Posting photos (every posts created must have a photo attached to it. Multiple photos can be chosen for a single post) <br>
2. Commenting, Liking posts (photos can be used as comments)
3. Following and unfollowing other users. Once followed, user will see be able to see posts from that followed user in the feed
4. Messaging (photos can be sent as message)
5. Video and audio calling
6. See locations of following users
7. Update location
8. Explore recommended photos (currently working but need more fixes on the backend)
9. Explore users around current location
10. Explore posts around current location
11. See activity summary (see who interact with you the most, who like your posts the most, who comment your posts the most, who visit your profile the most)

# Technologies used:
1. Hosting service: Heroku
2. Server environment: Node.js JavaScript runtime environment and Express.js web app framework <br>
3. Realtime communication and updates: SocketIO
4. Video and audio calling: Twillio Programmable Video
5. Locations: MongoDB Geospatial
6. Media storage: Google Cloud Storage
7. Image recognitions (used when the app need to predict user's search trend): Firebase Machine Learning
8. Database: MongoDB with Mongoose as a supplement (Mongoose is an a object data modeling for MongoDB and Node.js)
