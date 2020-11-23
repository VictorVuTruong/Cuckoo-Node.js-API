// Import catchAsync
const catchAsync = require(`${__dirname}/../utils/catchAsync`);

// Import the AppError
const AppError = require(`${__dirname}/../utils/appError`);

// Import the API features
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);

// This is used for deleting one document with specified id
exports.deleteOne = (Model) =>
  catchAsync(async (request, respond, next) => {
    // Delete the document with specified id
    const document = await Model.findByIdAndDelete(request.query.id);

    // Handle the 404 error
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    // Return the respond
    respond.status(204).json({
      status: "success",
      data: null,
    });
  });

// This is used for updating one document with specified id
// Updated info is found inside the request body
exports.updateOne = (Model) =>
  catchAsync(async (request, respond, next) => {
    const document = await Model.findByIdAndUpdate(
      request.query.id,
      request.body,
      {
        // This option is to return the modified document rather than the original
        new: true,
        runValidators: true,
      }
    );

    // Handle the 404 error
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    // Return the respond
    respond.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });

// The function to get all documents. It can be queried as well
exports.getAllDocuments = (Model) =>
  catchAsync(async (request, respond, next) => {
    // Check for errors
    try {
      // Execute the query
      const features = new APIFeatures(Model.find(), request.query)
        .filter()
        .sorting()
        .limiting()
        .paginating();

      const documents = await features.query;

      // Send response
      respond.status(200).json({
        status: "success",
        results: documents.length,
        data: {
          documents, // Don't have to specify the field name because the field name is the same as data name
        },
      });
    } catch (error) {
      respond.status(500).json({
        status: "failed",
        message: "Error occurred while trying to get all documents",
      });
    }
  });

// The function to get all documents. It can be queried with or condition
exports.getAllDocumentsOrQuery = (Model) =>
  catchAsync(async (request, respond, next) => {
    // Check for errors
    try {
      // Execute the query
      const features = new APIFeatures(
        Model.find(),
        request.query
      ).filterOrCondition();

      const documents = await features.query;

      // Send response
      respond.status(200).json({
        status: "success",
        results: documents.length,
        data: {
          documents, // Don't have to specify the field name because the field name is the same as data name
        },
      });
    } catch (error) {
      respond.status(500).json({
        status: "failed",
        message:
          "Error occurred while trying to get all documents with or query",
        error: error,
      });
    }
  });

// The function to get one document based on document id
exports.getOneDocument = (Model, populateOption) =>
  catchAsync(async (request, respond, next) => {
    let query = Model.findById(request.params.id);
    // Do some populating according to the populateOption if any
    if (populateOption) {
      query = query.populate(populateOption);
    }

    // The final document to show with the populate according to the populateOption if any
    // At this point, the entire query is ready
    const document = await query;

    // Handle the 404 error if there's no document found
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    // Return the respond
    respond.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });

// The function to create new document based on info from request body
exports.createDocument = (Model) =>
  catchAsync(async (request, respond, next) => {
    const newDocument = await Model.create(request.body);

    respond.status(201).json({
      status: "success",
      data: {
        tour: newDocument,
      },
    });
  });
