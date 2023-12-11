module.exports = {
  getSuccessMessage: (operation) => ({ message: `Operation ${operation} completed successfully` }),
  getErrorMessage: (operation) => ({ message: `An error occurred during ${operation}` }),
  getNotFoundMessage: (resource) => ({ message: `${resource} not found` }),
  getDuplicateFieldMessage: (resource, keyPattern) => {
    const [key] = Object.keys(keyPattern);
    return { message: `${resource} with same ${key} already exists` }
  }
};