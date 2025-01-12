import { z } from 'zod';
import {
  PAYMENT_METHOD,
  TRANSACTION_CATEGORY,
  TRANSACTION_TYPE,
} from './transaction.constants';

const createTransactionValidationSchema = z.object({
  body: z.object({
    amount: z.number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    }),
    transactionType: z.enum([...TRANSACTION_TYPE] as [string, ...string[]], {
      required_error: 'Transaction type is required',
    }),
    transactionCategory: z.enum([...TRANSACTION_CATEGORY] as [string, ...string[]], {
      required_error: 'Transaction category is required',
    }),
    description: z.string().optional(),
    paymentMethod: z.enum([...PAYMENT_METHOD] as [string, ...string[]], {
      required_error: 'Payment method is required',
    }),
    transactionSource: z.string().optional(),
  }),
});

const updateTransactionValidationSchema = z.object({
  body: z.object({
    amount: z
      .number({
        invalid_type_error: 'Amount must be a number',
      })
      .optional(),
    transactionType: z
      .enum([...TRANSACTION_TYPE] as [string, ...string[]])
      .optional(),
    transactionCategory: z
      .enum([...TRANSACTION_CATEGORY] as [string, ...string[]])
      .optional(),
    description: z.string().optional(),
    paymentMethod: z.enum([...PAYMENT_METHOD] as [string, ...string[]]).optional(),
    transactionSource: z.string().optional(),
  }),
});

export const TransactionValidationSchemas = {
  createTransactionValidationSchema,
  updateTransactionValidationSchema,
};