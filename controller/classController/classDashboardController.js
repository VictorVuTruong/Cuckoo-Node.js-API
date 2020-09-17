// Immport the class dashboard model
const ClassDashboard = require(`${__dirname}/../../model/classModel/classDashboardModel`);

// Import the handler factory
const factory = require(`${__dirname}/../handlerFactory`);

// The function for getting all dashboard items
exports.getAllClassDashboardItems = factory.getAllDocuments(ClassDashboard);

// The function to create new class dashboard item
exports.createNewClassDashboardItem = factory.createDocument(ClassDashboard);

// The function for deleting a class dashboard item
exports.deleteClassDashboardItem = factory.deleteOne(ClassDashboard);
