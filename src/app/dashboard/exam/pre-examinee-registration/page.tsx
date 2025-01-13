// pre examinee registration page

"use client"

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDialog } from "@/components/ui/status-dialog";
import { IoAddCircle } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@headlessui/react";
import marhalaNames from "@/data/marhala.names";
import { useCallback, useEffect, useState } from "react";
import { examServices } from "@/services/examService";
import { madrasahServices } from "@/services/madrasahService";
import debounce from 'lodash/debounce';
import { PreExamineeRegistrationValidation } from "@/features/preExamineeRegistration/validation";
import globalValidateRequest from "@/middleware/globalValidateRequest";
import { preExamineeRegistrationServices } from "@/services/preExamineeRegistrationService";

// Temporary static data
const STATIC_EXAMS = [
  { id: 1, name: "দাখিল" },
  { id: 2, name: "আলিম" },
];

// const STATIC_MARHALAS = [
//   { id: 1, name: "১ম বর্ষ" },
//   { id: 2, name: "২য় বর্ষ" },
//   { id: 3, name: "৩য় বর্ষ" },
// ];

const STATIC_MADRASAHS = [
  { id: 1, code: "M001", name: "দারুল উলূম মাদরাসা", type: "boys" },
  { id: 2, code: "M002", name: "জামিয়া ইসলামিয়া", type: "girls" },
];

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

const initialFormState = {

    exam: '',
    madrasah: '',
    examineesPerMahala: marhalaNames.map(marhalaName => ({
      marhalaName,
      totalExamineesSlots: 0,
      startingRegistrationNumber: 0,
      endingRegistrationNumber: 0,
      totalFeesAmount: 0
    })),
    totalFeesAmount: 0,
  transactionDetails: {
    amount: 0,
    transactionType: '',
    transactionCategory: '',
    description: '',
    paymentMethod: ''
  }
};



export default function PreExamineeRegistrationPage() {

  // states 
  const [formData, setFormData] = useState(initialFormState);
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  
  
  
  // Additional states for storing complete details
  const [selectedMadrasahDetails, setSelectedMadrasahDetails] = useState<any>(null);
  const [selectedExamDetails, setSelectedExamDetails] = useState<any>(null);
  const [latestRegistrationNumber, setLatestRegistrationNumber] = useState(0);

  // fetch all exams from database
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await examServices.getAllExamForPreRegistration();
        setExams(response.data);
      } catch (error) {
        console.error("পরীক্ষা ডাটা লোড করতে সমস্যা হয়েছে");
      }
    };
    fetchExams();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 2) return;
      setIsSearching(true);
      try {
        const response = await madrasahServices.getAllMadrasahsForPreRegistration(1, 40);
        const filteredResults = response.data.filter(madrasah => 
          madrasah.madrasahNames.bengaliName.toLowerCase().includes(term.toLowerCase()) ||
          madrasah.madrasahNames.englishName.toLowerCase().includes(term.toLowerCase()) ||
          madrasah.code.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredResults);
        setShowDropdown(true);
      } catch (error) {
        console.error("মাদ্রাসা খুঁজতে সমস্যা হয়েছে");
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 2) {
      debouncedSearch(value);
    } else {
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  // Handle madrasah selection
  const handleMadrasahSelect = async (madrasah: any) => {
    // Update form data with just the ID
    setFormData(prev => ({ ...prev, madrasah: madrasah._id }));
    
    // Store complete madrasah details separately
    setSelectedMadrasahDetails({
      _id: madrasah._id,
      code: madrasah.code,
      madrasahNames: madrasah.madrasahNames,
      madrasahType: madrasah.madrasah_information.madrasahType
    });
    setSearchTerm(`${madrasah.madrasahNames.bengaliName} - ${madrasah.code}`);
    setShowDropdown(false);
  };

  // handle exam change
  const handleExamChange = (value: string) => {
    // Update form data with just the ID
    setFormData(prev => ({
      ...prev,
      exam: value
    }));

    // Store complete exam details separately
    const examDetails = exams.find(exam => exam._id === value);
    if (examDetails) {
      setSelectedExamDetails(examDetails);
    }
  };

  // Calculate total amount and registration numbers for a marhala
  const handleExamineeCountChange = (marhalaName: string, count: number) => {
    if (!selectedExamDetails) return;

    // First update the count for the current marhala
    const updatedExamineesPerMahala = formData.examineesPerMahala.map(marhala => {
      if (marhala.marhalaName === marhalaName) {
        return {
          ...marhala,
          totalExamineesSlots: count,
          totalFeesAmount: count * (selectedExamDetails.preRegistrationFee || 0)
        };
      }
      return marhala;
    });

    // Now recalculate all registration numbers sequentially
    let currentStartNumber = selectedExamDetails.currentRegistrationNumber === 0 
      ? selectedExamDetails.registrationStartNumber 
      : selectedExamDetails.currentRegistrationNumber + 1;

    const finalUpdatedExamineesPerMahala = updatedExamineesPerMahala.map(marhala => {
      if (marhala.totalExamineesSlots > 0) {
        const startingNumber = currentStartNumber;
        const endingNumber = startingNumber + marhala.totalExamineesSlots - 1;
        currentStartNumber = endingNumber + 1; // Next marhala starts from previous ending + 1
        
        return {
          ...marhala,
          startingRegistrationNumber: startingNumber,
          endingRegistrationNumber: endingNumber
        };
      }
      return {
        ...marhala,
        startingRegistrationNumber: 0,
        endingRegistrationNumber: 0
      };
    });

    // Calculate total fees for all marhalas
    const totalFees = finalUpdatedExamineesPerMahala.reduce(
      (sum, marhala) => sum + marhala.totalFeesAmount,
      0
    );

    setFormData(prev => ({
      ...prev,
      examineesPerMahala: finalUpdatedExamineesPerMahala,
      totalFeesAmount: totalFees
    }));

    // Update latest registration number
    const lastMarhalaWithCount = finalUpdatedExamineesPerMahala
      .filter(m => m.totalExamineesSlots > 0)
      .pop();
    
    setLatestRegistrationNumber(
      lastMarhalaWithCount ? lastMarhalaWithCount.endingRegistrationNumber + 1 : 0
    );
  };

  // Update total fees and transaction amount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      transactionDetails: {
        ...prev.transactionDetails,
        amount: prev.totalFeesAmount
      }
    }));
  }, [formData.totalFeesAmount]);

  // Handle transaction details change
  const handleTransactionChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      transactionDetails: {
        ...prev.transactionDetails,
        [field]: value
      }
    }));
  };


  // handle submit from 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement | HTMLAnchorElement | HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();

    const modifiedFromData = {
      preExaminneRegistrationDetails : {
        exam: formData.exam,
        madrasah: formData.madrasah,
        examineesPerMahala: formData.examineesPerMahala,
        totalFeesAmount: formData.totalFeesAmount
      },
      transactionDetails : formData.transactionDetails,
    };
    
    const validationErrors = globalValidateRequest(
      PreExamineeRegistrationValidation.createPreExamineeRegistrationValidationSchema,
      modifiedFromData
    );

    if (Object.keys(validationErrors).length > 0) {
      // make validationErrors an array, and store just eror messages
      const errormessages = Object.values(validationErrors);
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ব্যার্থ!',
        message: errormessages.flat().join(', ')
      });
      return;
    }

    try{
      const response = await preExamineeRegistrationServices.create(modifiedFromData);
      console.log(response);
      if (response.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: response.message || 'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করা হয়েছে'
        });
        return;
      }

    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ব্যার্থ!',
        message: error?.response?.data?.message || 'পরীক্ষার্থী প্রি-নিবন্ধন তৈরি করতে সমস্যা হয়েছে',
      });
      return;
    }
  }


  return (
    <div className="container max-w-4xl mx-auto mt-8 px-4">

       <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">পরীক্ষার্থী প্রি-নিবন্ধন</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Exam add madrasah Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Exam Selection */}
              <div className="">
                <Label>পরীক্ষা নির্বাচন করুন</Label>
                <Select onValueChange={handleExamChange} value={formData.exam}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map(exam => (
                      <SelectItem key={exam._id} value={exam._id}>
                        {exam.examName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* show error when found validation error */}
              </div>

              {/* Madrasah Search */}
              <div className="col-span-2 relative">
                <Label>মাদ্রাসা অনুসন্ধান</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="মাদ্রাসার নাম অথবা কোড"
                    className="flex-1 text-xs"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-1/3 mt-1 bg-white border rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {searchResults.map((madrasah: any) => (
                        <li
                          key={madrasah._id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleMadrasahSelect(madrasah)}
                        >
                          <div>{madrasah.name}</div>
                          <div className="text-xs text-gray-500"> {madrasah.madrasahNames.bengaliName}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Marhala-wise Registration */}
            <div>
              <style jsx global>{`
                /* Hide number input spinners */
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type="number"] {
                  -moz-appearance: textfield;
                }
              `}</style>
              <h3 className="font-medium mb-3">মারহালা-ভিত্তিক নিবন্ধন সংখ্যা</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-sm border-b">
                      <th className="py-2 px-3 text-left font-medium">মারহালা</th>
                      <th className="py-2 px-3 text-center font-medium">পরীক্ষার্থী সংখ্যা</th>
                      <th className="py-2 px-3 text-center font-medium">রেজিস্ট্রেশন নম্বর</th>
                      <th className="py-2 px-3 text-right font-medium">মোট টাকা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formData.examineesPerMahala.map(marhala => (
                      <tr key={marhala.marhalaName} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm">{marhala.marhalaName}</td>
                        <td className="py-2 px-3">
                          <Input 
                            type="number" 
                            placeholder="0"
                            value={marhala.totalExamineesSlots || ''}
                            onChange={(e) => handleExamineeCountChange(marhala.marhalaName, parseInt(e.target.value) || 0)}
                            className="!h-7 text-center text-sm w-24 mx-auto"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-center space-x-1 text-xs">
                            <Input 
                              type="number"
                              value={marhala.startingRegistrationNumber || ''}
                              readOnly
                              className="!h-7 !w-20 !px-1 text-center bg-gray-50"
                            />
                            <span className="text-gray-400">-</span>
                            <Input 
                              type="number"
                              value={marhala.endingRegistrationNumber || ''}
                              readOnly
                              className="!h-7 !w-20 !px-1 text-center bg-gray-50"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right text-sm text-gray-600">
                          {marhala.totalFeesAmount.toLocaleString()}/-
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t">
                    <tr>
                      <td className="py-2 px-3 text-sm font-medium">মোট</td>
                      <td className="py-2 px-3 text-center text-sm">
                        {formData.examineesPerMahala.reduce((sum, marhala) => sum + (marhala.totalExamineesSlots || 0), 0)} জন
                      </td>
                      <td className="py-2 px-3 text-center text-sm"></td>
                      <td className="py-2 px-3 text-right text-sm font-medium">
                        {formData.totalFeesAmount.toLocaleString()}/-
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Transaction Section */}
            <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium">লেনদেন সংক্রান্ত তথ্য</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Transaction Type */}
                <div>
                  <Label>লেনদেনের ধরন</Label>
                  <Select 
                    value={formData.transactionDetails.transactionType}
                    onValueChange={(value) => handleTransactionChange('transactionType', value)}
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
                    value={formData.transactionDetails.transactionCategory}
                    onValueChange={(value) => handleTransactionChange('transactionCategory', value)}
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
                    value={formData.transactionDetails.paymentMethod}
                    onValueChange={(value) => handleTransactionChange('paymentMethod', value)}
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
                    value={formData.transactionDetails.amount}
                    onChange={(e) => handleTransactionChange('amount', Number(e.target.value))}
                    className="text-left"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Textarea 
                  placeholder="লেনদেন সম্পর্কে বিস্তারিত লিখুন..."
                  value={formData.transactionDetails.description}
                  onChange={(e) => handleTransactionChange('description', e.target.value)}
                  className="text-sm w-full h-20 border-2 border-gray-300 rounded-md p-2 hover:border-gray-600 focus:border-gray-700 focus:outline-none focus:ring-gray-700"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
              >
                <IoAddCircle className="mr-2" />
                নিবন্ধন করুন
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
