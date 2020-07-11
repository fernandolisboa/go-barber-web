import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErros(
  validationError: ValidationError,
): Errors {
  const errors: Errors = {};

  validationError.inner.forEach(innerError => {
    errors[innerError.path] = innerError.message;
  });

  return errors;
}
