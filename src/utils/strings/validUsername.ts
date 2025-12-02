import { OperationResult } from "@/types/returnTypes/OperationResult";

const validateUsername = (username: string): OperationResult => {
    // Check length
    if (username.length < 6 || username.length > 16) {
        return {
            status: false,
            message: "Username must be between 6 and 16 characters long.",
        };
    }

    // Check start character
    if (!/^[a-z]/.test(username)) {
        return {
            status: false,
            message: "Username must start with a lowercase English letter.",
        };
    }

    // Check allowed characters
    if (!/^[a-z0-9_]+$/.test(username)) {
        return {
            status: false,
            message: "Username can only contain lowercase letters, numbers, and underscores.",
        };
    }

    return {
        status: true,
        message: "Valid username",
    };
}

export default validateUsername;