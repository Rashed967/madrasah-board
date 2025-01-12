import { Types } from "mongoose";

type TTransactionCetegory = 'registrationFee' | 'examFee' | 'ilhakFee' | 'inspectionFee' | 'couponFee' | 'annualFee' | 'donation' | 'other';

type TTransactionType = 'income' | 'expense';


type TPaymentMethod = 'cash' | 'cheque' | 'mobile_banking' | 'bank_transfer';

interface ITransaction {
    _id?: string;
    amount: number;
    transactionType: TTransactionType;
    transactionCategory: TTransactionCetegory;
    description?: string;
    paymentMethod: TPaymentMethod;
    transactionSource?: Types.ObjectId;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export default ITransaction;