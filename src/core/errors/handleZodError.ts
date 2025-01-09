import { ZodError } from 'zod';

export function handleZodError(error: ZodError) {
  const errors = error.errors.map(err => {
    return {
      path: err.path.join('.'),
      message: err.message
    };
  });

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: errors
  };
}
