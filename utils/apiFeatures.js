class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // The filting feature
  // Write the query string like this: field="value"
  filter() {
    // Build the query
    // Use destructuring to take every fields out of the request.query into an object
    const queryObject = { ...this.queryString };

    // Array of all fields that should be excluded from the query
    const excludedFields = ["page", "sort", "limit", "fields"];

    // Remove all fields in the excludedFields out of the queryObject
    excludedFields.forEach((element) => delete queryObject[element]);

    // Some advanced filtering
    // Get the query and convert that query to a string in order to replace something as needed
    let queryString = JSON.stringify(queryObject);

    // Use regular expression to replace anywhere in the string that contain filter variable such as (gte, gt, lte, lt)
    // with the one with the $ sign in the fron
    queryString = queryString.replace(
      /\b{gte|gt|lte|lt}\b/g,
      (match) => `$${match}`
    );

    console.log(JSON.parse(queryString));

    // Create the query object based on the modified query string
    this.query.find(JSON.parse(queryString));

    // Return the query object
    return this;
  }

  // The filtering feature but for or condition
  filterOrCondition() {
    // Build the query
    // Use destructuring to take every fields out of the request.query into an object
    const queryObject = { ...this.queryString };

    // Array of all fields that should be excluded from the query
    const excludedFields = ["page", "sort", "limit", "fields"];

    // Remove all fields in the excludedFields out of the queryObject
    excludedFields.forEach((element) => delete queryObject[element]);

    // Build the or query
    var orQuery = `{"$or":[`;
    Object.keys(queryObject).forEach((key) => {
      orQuery = orQuery.concat("{");
      orQuery = orQuery.concat(`"`);
      orQuery = orQuery.concat(key);
      orQuery = orQuery.concat(`"`);
      orQuery = orQuery.concat(":");
      orQuery = orQuery.concat(`"`);
      orQuery = orQuery.concat(queryObject[key]);
      orQuery = orQuery.concat(`"`);
      orQuery = orQuery.concat("},");
    });
    orQuery = orQuery.substring(0, orQuery.length - 1);
    orQuery = orQuery.concat("]}");

    console.log(JSON.parse(orQuery));

    // Create the query object based on the modified query string
    this.query.find(JSON.parse(orQuery));

    // Return the query object
    return this;
  }

  // The sorting feaeture
  // Write the query like this: field[operator(gte/gt/lt/lte)]=value
  sorting() {
    // Sorting
    if (this.queryString.sort) {
      // This one is to combine multiple sorting condition
      const sortBy = this.queryString.sort.split(",").join("");

      // Replace the query with multiple sorting condition
      this.query = this.query.sort(sortBy);
    } else {
      // If the user doesn't specify any sorting condition, just sort based on date created
      this.query = this.query.sort("-createdAt");
    }

    // Return the query object
    return this;
  }

  // The limiting feature
  // Write the query like this: limit=value
  limiting() {
    // Limiting fields
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // Exclude the __v field
      this.query = this.query.select("-__v");
    }

    // Return the query object
    return this;
  }

  // Paginating feature
  // Write the query like this: page=value&limit=value
  paginating() {
    // Pagination
    // Will get the limit of 100 resutls per page by default
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // Create the query based on the specified category
    this.query = this.query.skip(skip).limit(limit);

    // Return the query
    return this;
  }
}

// Export the modules so that it can be used by other controllers
module.exports = APIFeatures;
