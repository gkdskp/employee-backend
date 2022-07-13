import { CustomError, ErrorCodes } from "../util/errorCode";
import HttpException from "./HttpException";

/**
 * This exception can be used in case an entity with the given identifiers already exists.
 */
class EntityAlreadyExists extends HttpException {
    constructor(errorDetail: CustomError) {
        super(409, errorDetail.MESSAGE, errorDetail.CODE);
    }
}

export default EntityAlreadyExists;