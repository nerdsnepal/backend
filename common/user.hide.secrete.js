
exports.removeAttribute = (values = [], keys = []) => {
    // Check if the users array is empty
    if (values.length === 0) {
      return values;
    }
    // Check if the keys array is empty
    if (values.length === 0) {
      return values;
    }
    // Iterate over the users array
    values.forEach((value) => {
      // Iterate over the keys array
      keys.forEach((key) => {
        // Delete the key from the user object
        value[key] = undefined
      });
    });
    // Return the updated users array
    return values;
  };