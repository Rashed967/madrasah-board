import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IoAddCircle, IoTrash, IoChevronDown } from 'react-icons/io5'
import { memo, useState, useCallback } from 'react'
import { Textarea } from '@headlessui/react'

const TRANSACTION_CATEGORIES = [
  { value: 'registrationFee', label: 'রেজিস্ট্রেশন ফি' },
  { value: 'examFee', label: 'পরীক্ষার ফি' },
  { value: 'ilhakFee', label: 'ইলহাক ফি' },
  { value: 'inspectionFee', label: 'পরিদর্শন ফি' },
  { value: 'couponFee', label: 'কুপন ফি' },
  { value: 'annualFee', label: 'বার্ষিক ফি' },
  { value: 'donation', label: 'অনুদান' },
  { value: 'other', label: 'অন্যান্য' }
]

const PAYMENT_METHODS = [
  { value: 'cash', label: 'নগদ' },
  { value: 'cheque', label: 'চেক' },
  { value: 'mobile_banking', label: 'মোবাইল ব্যাংকিং' },
  { value: 'bank_transfer', label: 'ব্যাংক ট্রান্সফার' }
]

interface PaymentDetail {
  amount: number
  paymentMethod: string
  referenceNumber?: string
  paymentDate?: string
}

interface TransactionFormProps {
  transactionDetails: {
    totalAmount: number
    paidAmount?: number
    transactionCategory: string
    description?: string
    paymentDetails: PaymentDetail[]
  }
  onTransactionChange: (field: string, value: any) => void
  paymentError?: string
}

const TransactionForm = memo(
  ({
    transactionDetails,
    onTransactionChange,
    paymentError
  }: TransactionFormProps) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
    const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false)
    const [isTransactionInfoOpen, setIsTransactionInfoOpen] = useState(false)

    const handlePaymentDetailChange = (
      index: number,
      field: string,
      value: any
    ) => {
      const newPaymentDetails = [...transactionDetails.paymentDetails]
      newPaymentDetails[index] = {
        ...newPaymentDetails[index],
        [field]: value
      }
      onTransactionChange('paymentDetails', newPaymentDetails)

      // Calculate and update paid amount
      const totalPaid = newPaymentDetails.reduce(
        (sum, detail) => sum + (Number(detail.amount) || 0),
        0
      )
      onTransactionChange('paidAmount', totalPaid)
    }

    const addPaymentMethod = () => {
      onTransactionChange('paymentDetails', [
        ...transactionDetails.paymentDetails,
        { amount: 0, paymentMethod: '', referenceNumber: '', paymentDate: '' }
      ])
    }

    const removePaymentMethod = (index: number) => {
      const newPaymentDetails = transactionDetails.paymentDetails.filter(
        (_, i) => i !== index
      )
      onTransactionChange('paymentDetails', newPaymentDetails)

      // Recalculate paid amount
      const totalPaid = newPaymentDetails.reduce(
        (sum, detail) => sum + (Number(detail.amount) || 0),
        0
      )
      onTransactionChange('paidAmount', totalPaid)
    }

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault()

        // Check if payment amount is valid
        if ((transactionDetails.paidAmount || 0) > transactionDetails.totalAmount) {
          onTransactionChange('error', 'পরিশোধিত টাকার পরিমাণ মোট টাকার চেয়ে বেশি হতে পারবে না')
          return
        }

        // Rest of the submit logic...
      },
      [transactionDetails, onTransactionChange]
    )

    return (
      <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsTransactionInfoOpen(!isTransactionInfoOpen)}
          className="w-full flex items-center justify-between py-2 text-gray-600 hover:bg-gray-50 bg-white border"
        >
          <span className="font-medium">লেনদেন সংক্রান্ত তথ্য</span>
          <IoChevronDown className={`transform transition-transform ${isTransactionInfoOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isTransactionInfoOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* <div className="mb-4">
              <Label>লেনদেনের ক্যাটাগরি</Label>
              <Select
                value={transactionDetails.transactionCategory}
                onValueChange={(value) =>
                  onTransactionChange('transactionCategory', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            <div>
              <Label>মোট টাকা</Label>
              <Input
                type="number"
                value={transactionDetails.totalAmount || 0}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>পরিশোধিত টাকা</Label>
              <Input
                type="number"
                value={transactionDetails.paidAmount || 0}
                disabled
                className={`bg-gray-50 ${(transactionDetails.paidAmount || 0) > transactionDetails.totalAmount ? 'border-red-500' : ''}`}
              />
              {((transactionDetails.paidAmount || 0) > transactionDetails.totalAmount) && (
                <p className="text-red-500 text-sm mt-1">পরিশোধিত টাকার পরিমাণ মোট টাকার চেয়ে বেশি হতে পারবে না</p>
              )}
              {paymentError && (
                <p className="text-red-500 text-sm mt-1">{paymentError}</p>
              )}
            </div>
            <div>
              <Label>বাকি টাকা</Label>
              <Input
                type="number"
                value={transactionDetails.totalAmount - (transactionDetails.paidAmount || 0)}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsPaymentDetailsOpen(!isPaymentDetailsOpen)}
            className="w-full flex items-center justify-between py-2 text-gray-600 hover:bg-gray-50 bg-white border"
          >
            <span>পেমেন্ট বিবরণ</span>
            <IoChevronDown className={`transform transition-transform ${isPaymentDetailsOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isPaymentDetailsOpen && (
            <>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPaymentMethod}
                  className="w-full text-[#52B788] hover:text-[#52B788] border border-[#52B788]/60"
                >
                  <IoAddCircle className="mr-2" />
                  নতুন পেমেন্ট যোগ করুন
                </Button>
              </div>

              {transactionDetails.paymentDetails.map((payment, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-white"
                >
                  <div>
                    <Label>পেমেন্ট পদ্ধতি</Label>
                    <Select
                      value={payment.paymentMethod}
                      onValueChange={(value) =>
                        handlePaymentDetailChange(index, 'paymentMethod', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="পেমেন্ট পদ্ধতি" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>টাকার পরিমাণ</Label>
                    <Input
                      type="number"
                      value={payment.amount || ''}
                      onChange={(e) =>
                        handlePaymentDetailChange(
                          index,
                          'amount',
                          e.target.value === '' ? 0 : Number(e.target.value)
                        )
                      }
                      placeholder="টাকার পরিমাণ"
                    />
                  </div>

                  <div>
                    <Label>পেমেন্টের তারিখ</Label>
                    <Input
                      type="date"
                      value={payment.paymentDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        handlePaymentDetailChange(
                          index,
                          'paymentDate',
                          e.target.value
                        )
                      }
                      placeholder="পেমেন্টের তারিখ"
                    />
                  </div>

                  <div className="relative">
                    <Label>রেফারেন্স নম্বর</Label>
                    <Input
                      type="text"
                      value={payment.referenceNumber}
                      onChange={(e) =>
                        handlePaymentDetailChange(
                          index,
                          'referenceNumber',
                          e.target.value
                        )
                      }
                      placeholder="রেফারেন্স নম্বর (ঐচ্ছিক)"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePaymentMethod(index)}
                        className="absolute -right-2 -top-2 text-red-500 hover:text-red-600"
                      >
                        <IoTrash />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full flex items-center justify-between py-2 text-gray-600 hover:bg-gray-50 bg-white border"
        >
          <span>বিবরণ</span>
          <IoChevronDown className={`transform transition-transform ${isDescriptionOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {isDescriptionOpen && (
          <div className="mt-2">
            <Textarea
              value={transactionDetails.description || ''}
              onChange={(e) => onTransactionChange('description', e.target.value)}
              placeholder="বিবরণ লিখুন (ঐচ্ছিক)"
              className="h-20 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#52B788]/50"
            />
          </div>
        )}
      </div>
    )
  }
)

TransactionForm.displayName = 'TransactionForm'

export default TransactionForm
