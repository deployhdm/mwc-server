
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAfterDateBegin(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isAfterDateBegin',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const dateBegin = (args.object as any).dateBegin;
                    return dateBegin < value;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be after dateBegin`;
                },
            },
        });
    };
}