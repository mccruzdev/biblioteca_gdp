import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const encoder = new TextEncoder();
          if (encoder.encode(value).length > 72) {
            return false;
          }

          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,70}$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return (
            'La contraseña debe tener entre 8 y 70 caracteres, ' +
            'no exceder los 72 bytes, y contener al menos una letra mayúscula, ' +
            'una letra minúscula, un número y un símbolo.'
          );
        },
      },
    });
  };
}
