import { HttpStatus, UnprocessableEntityException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export const validationExceptionFactory = (errors: ValidationError[]) => {
    const fieldErrors: Record<string, string[]> = {}
    errors.forEach((error: ValidationError) => {
        fieldErrors[error.property] = Object.values(error.constraints)
    })

    const response = {
        error: {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Validation failed',
            fieldErrors: fieldErrors
        },
    }

    return new UnprocessableEntityException(response)
}