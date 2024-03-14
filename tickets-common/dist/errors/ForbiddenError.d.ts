import { CustomError } from "./CustomError";
export declare class ForbiddenError extends CustomError {
    statusCode: number;
    constructor();
    serializeError(): {
        message: string;
        field?: string | undefined;
    }[];
}
