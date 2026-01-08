/**
 * validation.js
 *
 * Utility functions for validating API parameters and user input.
 * Provides reusable validation helpers to ensure data integrity and consistency.
 *
 * Key Features:
 * - Enum validation with clear error messages
 * - Support for null/undefined values
 * - Reusable across the application
 * - Consistent error formatting
 */

/**
 * Validates that a value is one of the allowed enum values
 *
 * This helper ensures that parameters match expected values from a predefined set.
 * It supports optional parameters (undefined) and null values, only throwing errors
 * when a value is provided but doesn't match the allowed values.
 *
 * @param {*} value - The value to validate
 * @param {Array} validValues - Array of valid values
 * @param {string} paramName - Name of the parameter for error messages
 * @throws {Error} If value is defined, not null, and not in validValues
 *
 * @example
 * // Valid cases - no error thrown
 * validateEnum(undefined, ['0', '1'], 'mode');  // Parameter not provided
 * validateEnum(null, ['0', '1'], 'mode');       // Explicitly null
 * validateEnum('0', ['0', '1'], 'mode');        // Valid value
 *
 * @example
 * // Invalid case - throws error
 * validateEnum('2', ['0', '1'], 'mode');
 * // Throws: Error: mode must be one of: "0", "1", or null
 */
export const validateEnum = (value, validValues, paramName) => {
  // Allow undefined (parameter not provided) and null (explicitly set to null)
  if (value === undefined || value === null) {
    return;
  }

  // Check if value is in the list of valid values
  if (!validValues.includes(value)) {
    // Format valid values for error message
    const formattedValues = validValues.map(v => `"${v}"`).join(', ');
    throw new Error(
      `${paramName} must be one of: ${formattedValues}, or null`,
    );
  }
};

/**
 * Validates that a required parameter is provided
 *
 * Ensures that mandatory parameters are not missing, null, or empty strings.
 * Useful for validating required API parameters like API keys.
 *
 * @param {*} value - The value to validate
 * @param {string} paramName - Name of the parameter for error messages
 * @throws {Error} If value is undefined, null, or empty string
 *
 * @example
 * validateRequired('abc123', 'apiKey');  // Valid - no error
 *
 * @example
 * validateRequired('', 'apiKey');        // Throws error
 * validateRequired(null, 'apiKey');      // Throws error
 * validateRequired(undefined, 'apiKey'); // Throws error
 */
export const validateRequired = (value, paramName) => {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${paramName} is required`);
  }
};

/**
 * Validates that a value is a string
 *
 * Type-checks parameters to ensure they are strings.
 * Allows null and undefined for optional parameters.
 *
 * @param {*} value - The value to validate
 * @param {string} paramName - Name of the parameter for error messages
 * @throws {Error} If value is defined, not null, and not a string
 *
 * @example
 * validateString('hello', 'name');     // Valid - no error
 * validateString(null, 'name');        // Valid - null allowed
 * validateString(undefined, 'name');   // Valid - undefined allowed
 * validateString(123, 'name');         // Throws error
 */
export const validateString = (value, paramName) => {
  if (value !== undefined && value !== null && typeof value !== 'string') {
    throw new Error(`${paramName} must be a string`);
  }
};

/**
 * Validates that a value is a boolean
 *
 * Type-checks parameters to ensure they are booleans.
 * Allows null and undefined for optional parameters.
 *
 * @param {*} value - The value to validate
 * @param {string} paramName - Name of the parameter for error messages
 * @throws {Error} If value is defined, not null, and not a boolean
 *
 * @example
 * validateBoolean(true, 'isDevelopment');    // Valid - no error
 * validateBoolean(null, 'isDevelopment');    // Valid - null allowed
 * validateBoolean('true', 'isDevelopment');  // Throws error
 */
export const validateBoolean = (value, paramName) => {
  if (value !== undefined && value !== null && typeof value !== 'boolean') {
    throw new Error(`${paramName} must be a boolean`);
  }
};

/**
 * Validates that a value is an object (but not an array)
 *
 * Type-checks parameters to ensure they are plain objects.
 * Allows null and undefined for optional parameters.
 * Rejects arrays (which are technically objects in JavaScript).
 *
 * @param {*} value - The value to validate
 * @param {string} paramName - Name of the parameter for error messages
 * @throws {Error} If value is defined, not null, and not an object
 *
 * @example
 * validateObject({key: 'value'}, 'payload');  // Valid - no error
 * validateObject(null, 'payload');            // Valid - null allowed
 * validateObject([1, 2, 3], 'payload');       // Throws error (array)
 * validateObject('string', 'payload');        // Throws error
 */
export const validateObject = (value, paramName) => {
  if (
    value !== undefined &&
    value !== null &&
    (typeof value !== 'object' || Array.isArray(value))
  ) {
    throw new Error(`${paramName} must be an object`);
  }
};

/**
 * Validates that a value is within a numeric range
 *
 * Ensures numeric parameters fall within acceptable bounds.
 * Useful for validating counts, indices, percentages, etc.
 *
 * @param {number} value - The value to validate
 * @param {number} min - Minimum allowed value (inclusive)
 * @param {number} max - Maximum allowed value (inclusive)
 * @param {string} paramName - Name of the parameter for error messages
 * @throws {Error} If value is not a number or outside the range
 *
 * @example
 * validateRange(5, 0, 10, 'count');     // Valid - no error
 * validateRange(0, 0, 10, 'count');     // Valid - min boundary
 * validateRange(10, 0, 10, 'count');    // Valid - max boundary
 * validateRange(11, 0, 10, 'count');    // Throws error
 * validateRange(-1, 0, 10, 'count');    // Throws error
 */
export const validateRange = (value, min, max, paramName) => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${paramName} must be a number`);
  }

  if (value < min || value > max) {
    throw new Error(`${paramName} must be between ${min} and ${max}`);
  }
};

