// Immport the class course info model
const ClassCourseInfoItem = require(`${__dirname}/../../model/classModel/classCourseInfoModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all class course info items
exports.getAllClassCourseInfoItems = factory.getAllDocuments(
  ClassCourseInfoItem
);

// The function to create new class course info item
exports.createNewClassCourseInfoItem = factory.createDocument(
  ClassCourseInfoItem
);

// The function for deleting a class course info item
exports.deleteClassCourseInfoItem = factory.deleteOne(ClassCourseInfoItem);
