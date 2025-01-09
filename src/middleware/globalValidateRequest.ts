import { AnyZodObject } from "zod";

const globalValidateRequest =  (zodSchema: AnyZodObject, data: any) : Record<string, string> => {
    const result = zodSchema.safeParse(data);
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      return errors;
    }
    
    return {};
  };

  export default globalValidateRequest