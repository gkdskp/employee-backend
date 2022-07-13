import { ErrorCodes } from "../util/errorCode";
import HttpException from "./HttpException";

/**
 * This exception can be used in case of unexpected errors.
 */
class InternalServerError extends HttpException {
    constructor() {
        const errorDetail = ErrorCodes.UNEXPECTED_ERROR_OCCURED;
        super(500, errorDetail.MESSAGE, errorDetail.CODE);
    }
}

export default InternalServerError;