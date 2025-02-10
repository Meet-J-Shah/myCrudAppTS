/**
 * Success response handler class
 */
export class SuccessResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(success: boolean, message: string, code: number, data?: any) {
    return {
      success: success,
      message: message,
      code: code,
      data: data,
    };
  }
}
