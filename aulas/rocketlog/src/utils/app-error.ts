class AppError {
  messsage: string;
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    this.messsage = message;
    this.statusCode = statusCode;
  }
}

export { AppError };
