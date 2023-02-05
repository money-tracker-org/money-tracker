import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationError } from "class-validator/types/validation/ValidationError";

export class ValidationException extends Error {
    readonly errors?: ValidationError[]
    constructor(message?: string, errors?: ValidationError[]) {
        super(message)
        this.errors = errors
    }
}

export async function objectToClass<T extends object>(cls: ClassConstructor<T>, obj: object): Promise<T> {
    const classObject: T = plainToClass(cls, obj)
    console.log(`Validating object: ${JSON.stringify(obj)}`)
    const errors = await validate(classObject, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        validationError: {
            target: false,
        }
    })
    if (errors.length > 0) {
        throw new ValidationException("Bad request: " + JSON.stringify(errors), errors)
    }
    return classObject
}

