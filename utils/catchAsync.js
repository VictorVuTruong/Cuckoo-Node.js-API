// This is used to catch errors from async functions
module.exports = (fn) => {
  return (request, respond, next) => {
    // If there's error occur when creating new tour, the catch will send the error to the error handling middleware
    fn(request, respond, next).catch(next);
  };
};
