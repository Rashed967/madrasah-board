import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@headlessui/react";
import { memo } from "react";

const TRANSACTION_CATEGORIES = [
  { value: 'registrationFee', label: 'রেজিস্ট্রেশন ফি' },
  { value: 'examFee', label: 'পরীক্ষার ফি' },
  { value: 'ilhakFee', label: 'ইলহাক ফি' },
  { value: 'inspectionFee', label: 'পরিদর্শন ফি' },
  { value: 'couponFee', label: 'কুপন ফি' },
  { value: 'annualFee', label: 'বার্ষিক ফি' },
  { value: 'donation', label: 'অনুদান' },
  { value: 'other', label: 'অন্যান্য' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'নগদ' },
  { value: 'cheque', label: 'চেক' },
  { value: 'mobile_banking', label: 'মোবাইল ব্যাংকিং' },
  { value: 'bank_transfer', label: 'ব্যাংক ট্রান্সফার' },
];

interface TransactionFormProps {
  transactionDetails: {
    amount: number;
    transactionType: string;
    transactionCategory: string;
    description: string;
    paymentMethod: string;
  };
  onTransactionChange: (field: string, value: string | number) => void;
}

const TransactionForm = memo(({ 
  transactionDetails, 
  onTransactionChange 
}: TransactionFormProps) => {
  return (
    <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
      <h3 className="font-medium">লেনদেন সংক্রান্ত তথ্য</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Transaction Type */}
        <div>
          <Label>লেনদেনের ধরন</Label>
          <Select 
            value={transactionDetails.transactionType}
            onValueChange={(value) => onTransactionChange('transactionType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="লেনদেনের ধরন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">আয়</SelectItem>
              <SelectItem value="expense">ব্যয়</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Category */}
        <div>
          <Label>লেনদেনের ক্যাটাগরি</Label>
          <Select
            value={transactionDetails.transactionCategory}
            onValueChange={(value) => onTransactionChange('transactionCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method */}
        <div>
          <Label>পেমেন্ট পদ্ধতি</Label>
          <Select
            value={transactionDetails.paymentMethod}
            onValueChange={(value) => onTransactionChange('paymentMethod', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="পেমেন্ট পদ্ধতি" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map(method => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div>
          <Label>মোট টাকা</Label>
          <Input 
            type="number"
            value={transactionDetails.amount}
            onChange={(e) => onTransactionChange('amount', Number(e.target.value))}
            className="text-left"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Textarea 
          placeholder="লেনদেন সম্পর্কে বিস্তারিত লিখুন..."
          value={transactionDetails.description}
          onChange={(e) => onTransactionChange('description', e.target.value)}
          className="text-sm w-full h-20 border-2 border-gray-300 rounded-md p-2 hover:border-gray-600 focus:border-gray-700 focus:outline-none focus:ring-gray-700"
        />
      </div>
    </div>
  );
});

TransactionForm.displayName = 'TransactionForm';

export default TransactionForm;
