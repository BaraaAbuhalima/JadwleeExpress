class httpError {
  constructor(title, statusCode, customStatusCode, details, type, instance) {
    this.customStatusCode = customStatusCode;
    this.type = type;
    this.title = title;
    this.statusCode = statusCode;
    this.details = details;
    this.instance = instance;
  }
}

export default httpError;
