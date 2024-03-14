import { CustomError } from "./CustomError";
export declare class NotFoundError extends CustomError {
    statusCode: number;
    constructor();
    serializeError(): {
        message: string;
        field?: string | undefined;
    }[];
}
