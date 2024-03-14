import { CustomError } from "./CustomError";
export declare class UnauthorizedError extends CustomError {
    statusCode: number;
    constructor();
    serializeError(): {
        message: string;
        field?: string | undefined;
    }[];
}
