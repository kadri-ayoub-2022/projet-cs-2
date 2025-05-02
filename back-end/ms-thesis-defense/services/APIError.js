class ApiError extends Error {
  /**
   * @param {string} message - Message d'erreur
   * @param {number} statusCode - Code HTTP (ex: 404, 500, etc.)
   */
  constructor(message, statusCode = 500) {
    super(message); // Appelle le constructeur de Error
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // Pour différencier des bugs système

    // Capture la stack trace proprement
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
