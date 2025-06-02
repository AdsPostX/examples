// logger.js
const Logger = {
  log: (...args) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // Optionally log errors in production too
    console.error(...args);
  },
};

export default Logger;
