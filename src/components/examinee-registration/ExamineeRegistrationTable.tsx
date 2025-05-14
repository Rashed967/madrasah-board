import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useStatusDialog } from '@/hooks/useStatusDialog';
import { StatusDialog } from '@/components/ui/status-dialog';
import { convertToBengali } from '@/utils/convertToBengali';

interface MadrasahNames {
  bengaliName: string;
  arabicName: string;
  englishName: string;
  _id: string;
  id: string;
}

interface Madrasah {
  _id: string;
  madrasahNames: MadrasahNames;
  code: string;
  id: string;
  madrasah_information?: {
    highestMarhala?: {
      marhalaType?: 'boys' | 'girls';
    };
  };
}

interface Marhala {
  name: {
    bengaliName: string;
    arabicName: string;
  };
  _id: string;
  id: string;
}

interface ExamineePerMahala {
  marhala: Marhala;
  regularExamineesSlots: number;
  irregularExamineesSlots: number;
  remainingRegularExamineesSlots: number;
  remainingIrregularExamineesSlots: number;
  startingRegistrationNumber: number;
  endingRegistrationNumber: number;
  _id: string;
  id: string;
}

interface Transaction {
  _id: string;
  totalAmount: number;
  paidAmount: number;
  transactionType: string;
  transactionCategory: string;
  description: string;
  paymentDetails: Array<{
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    referenceNumber: string;
  }>;
  id: string;
}

interface Exam {
  _id: string;
  examName: string;
  id: string;
}

interface PreExamineeRegistration {
  _id: string;
  madrasah: Madrasah;
  examineesPerMahala: ExamineePerMahala[];
  transaction: Transaction;
  isLateRegistrationFeeTaken: boolean;
  receiptNo: number;
  exam: Exam;
}

interface PreExamineeRegistrationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: PreExamineeRegistration[];
  };
}

interface ExamineeRegistrationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface ExamineeRegistrationTableProps {
  selectedExamId?: string;
  selectedMadrasahId?: string;
}

// Form validation schema
const formSchema = z.object({
  marhala: z.string({
    required_error: "মারহালা নির্বাচন করুন",
  }),
  registrationType: z.enum(["নিয়মিত", "অনিয়মিত"], {
    required_error: "আবেদনের ধরণ নির্বাচন করুন",
    invalid_type_error: "আবেদনের ধরণ নির্বাচন করুন",
  }),
  examineeName: z.object({
    bengaliName: z.string().min(1, { message: "পরীক্ষার্থীর বাংলা নাম আবশ্যক" }),
    arabicName: z.string().optional(),
    englishName: z.string().optional(),
  }),
  fatherName: z.object({
    bengaliName: z.string().min(1, { message: "পিতার বাংলা নাম আবশ্যক" }),
    arabicName: z.string().optional(),
    englishName: z.string().optional(),
  }),
  motherName: z.object({
    bengaliName: z.string().min(1, { message: "মাতার বাংলা নাম আবশ্যক" }),
    arabicName: z.string().optional(),
    englishName: z.string().optional(),
  }),
  birthDate: z.string().min(1, { message: "জন্ম তারিখ আবশ্যক" }),
  nid_or_birth_certificate_number: z.string().min(1, { message: "জন্ম নিবন্ধন/জাতীয় পরিচয়পত্র নম্বর আবশ্যক" }),
  image: z.any().optional(),
});

const ExamineeRegistrationTable = ({ 
  selectedExamId, 
  selectedMadrasahId 
}: ExamineeRegistrationTableProps) => {
  const [registrations, setRegistrations] = useState<PreExamineeRegistration[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMadrasahName, setSelectedMadrasahName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRegistration, setSelectedRegistration] = useState<PreExamineeRegistration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [serverResponse, setServerResponse] = useState<{success: boolean, message: string} | null>(null);
  const [selectedMarhalaId, setSelectedMarhalaId] = useState<string>("");
  const [remainingSlots, setRemainingSlots] = useState<{regular: number, irregular: number}>({regular: 0, irregular: 0});
  const { statusDialog, showSuccessDialog, showErrorDialog, closeDialog } = useStatusDialog();
  const [shouldRefreshData, setShouldRefreshData] = useState<boolean>(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marhala: "",
      examineeName: {
        bengaliName: "",
        arabicName: "",
        englishName: "",
      },
      fatherName: {
        bengaliName: "",
        arabicName: "",
        englishName: "",
      },
      motherName: {
        bengaliName: "",
        arabicName: "",
        englishName: "",
      },
      birthDate: "",
      nid_or_birth_certificate_number: "",
    },
  });

  useEffect(() => {
    // Clear registrations when either selectedExamId or selectedMadrasahId is empty
    if (!selectedExamId || !selectedMadrasahId) {
      setRegistrations([]);
      setError(null);
      setSelectedMadrasahName("");
      return;
    }

    const fetchRegistrations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get<PreExamineeRegistrationResponse>(
          `${process.env.NEXT_PUBLIC_MAIN_URL}/pre-examinee-registrations?select=madrasah,examineesPerMahala,transaction,isLateRegistrationFeeTaken,receiptNo,exam&limit=10&page=1&exam=${selectedExamId}&madrasah=${selectedMadrasahId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
          }
        );

        if (response.data && response.data.success && response.data.data && response.data.data.data) {
          setRegistrations(response.data.data.data);
          if (response.data.data.data.length > 0) {
            setSelectedMadrasahName(response.data.data.data[0].madrasah.madrasahNames.bengaliName);
          }
        } else {
          setError("নিবন্ধনের তথ্য পাওয়া যায়নি");
          setRegistrations([]);
          setSelectedMadrasahName("");
        }
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("নিবন্ধনের তথ্য পাওয়া যায়নি");
        setRegistrations([]);
        setSelectedMadrasahName("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [selectedExamId, selectedMadrasahId, shouldRefreshData]);

  const handleOpenModal = (registration: PreExamineeRegistration, marhalaId: string) => {
    setShouldRefreshData(false);
    setSelectedRegistration(registration);
    setSelectedMarhalaId(marhalaId);
    setIsModalOpen(true);
    form.reset();
    form.setValue("marhala", marhalaId);
    setImageFile(null);
    setImagePreview(null);
    setServerResponse(null);
    
    // Set initial remaining slots
    const marhala = registration.examineesPerMahala.find(epm => epm.marhala._id === marhalaId);
    if (marhala) {
      setRemainingSlots({
        regular: marhala.remainingRegularExamineesSlots,
        irregular: marhala.remainingIrregularExamineesSlots
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
    setSelectedMarhalaId("");
    form.reset();
    setShouldRefreshData(true);
    setImageFile(null);
    setImagePreview(null);
    setServerResponse(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 300KB)
      if (file.size > 300 * 1024) {
        toast.error("ছবির সাইজ ৩০০ কেবি এর বেশি হতে পারবে না");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedRegistration || !selectedExamId || !selectedMadrasahId) {
      showErrorDialog("সব তথ্য পূরণ করুন");
      return;
    }

    // Check if the selected marhala is ফযীলত or মিশকাত
    const selectedMarhala = selectedRegistration.examineesPerMahala.find(
      (epm) => epm.marhala._id === values.marhala
    )?.marhala;
    
    const isFazilatOrMishkat = selectedMarhala?.name?.bengaliName?.includes('ফযীলত') || 
                              selectedMarhala?.name?.bengaliName?.includes('মিশকাত');
    
    // If it's ফযীলত or মিশকাত, validate Arabic names
    if (isFazilatOrMishkat && (!values.examineeName.arabicName || values.examineeName.arabicName.trim() === '')) {
      form.setError("examineeName.arabicName", {
        type: "manual",
        message: "ফযীলত/মিশকাত মারহালার জন্য পরীক্ষার্থীর আরবী নাম আবশ্যক"
      });
      return;
    }
    
    if (isFazilatOrMishkat && (!values.fatherName.arabicName || values.fatherName.arabicName.trim() === '')) {
      form.setError("fatherName.arabicName", {
        type: "manual",
        message: "ফযীলত/মিশকাত মারহালার জন্য পিতার আরবী নাম আবশ্যক"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setServerResponse(null);
      
      // Determine examineeType based on madrasah information
      const examineeType = selectedRegistration.madrasah.madrasah_information?.highestMarhala?.marhalaType === 'boys' 
        ? 'ছাত্র' 
        : 'ছাত্রী';

      // Prepare form data
      const formData = new FormData();
      
      // Add image if exists
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Add examinee data
      const examineeData = {
        ...values,
        exam: selectedExamId,
        madrasah: selectedMadrasahId,
        preExamineeRegistration: selectedRegistration._id,
        marhala: values.marhala,
        examineeType: examineeType,
      };
      
      formData.append('data', JSON.stringify(examineeData));
      
      // Send request
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post<ExamineeRegistrationResponse>(
        `${process.env.NEXT_PUBLIC_MAIN_URL}/regestered-examinees`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data && response.data.success) {
    
        showSuccessDialog(response.data.message || "পরীক্ষার্থী সফলভাবে নিবন্ধন করা হয়েছে");
        
        // Update remaining slots
        if (values.registrationType === "নিয়মিত") {
          setRemainingSlots(prev => ({
            ...prev,
            regular: Math.max(0, prev.regular - 1)
          }));
        } else {
          setRemainingSlots(prev => ({
            ...prev,
            irregular: Math.max(0, prev.irregular - 1)
          }));
        }
        
        // Reset form but keep modal open
        const currentRegistrationType = form.getValues("registrationType");
        form.reset();
        form.setValue("marhala", selectedMarhalaId);
        form.setValue("registrationType", currentRegistrationType);
        setImageFile(null);
        setImagePreview(null);
      } else {
        showErrorDialog(response.data?.message || "পরীক্ষার্থী নিবন্ধন করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error("Error registering examinee:", err);
      showErrorDialog(err?.response?.data?.message || "পরীক্ষার্থী নিবন্ধন করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedExamId || !selectedMadrasahId) {
    return (
      <div className="text-center py-8 text-gray-500">
        পরীক্ষা ও মাদ্রাসা নির্বাচন করুন
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        নিবন্ধনের কোনো তথ্য পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {selectedMadrasahName && (
        <div className="text-lg font-semibold text-center mt-4">
          {selectedMadrasahName}
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold'>মারহালা</TableHead>
              <TableHead className='font-bold'>নিয়মিত পরীক্ষার্থী</TableHead>
              <TableHead className='font-bold'>অনিয়মিত পরীক্ষার্থী</TableHead>
              <TableHead className='font-bold'>অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              registration.examineesPerMahala.map((examineePerMahala) => (
                <TableRow key={`${registration._id}-${examineePerMahala._id}`}>
                  <TableCell>{examineePerMahala.marhala.name.bengaliName}</TableCell>
                  <TableCell>
                    {convertToBengali(examineePerMahala.regularExamineesSlots - examineePerMahala.remainingRegularExamineesSlots)} / {convertToBengali(examineePerMahala.regularExamineesSlots)}
                  </TableCell>
                  <TableCell>
                    {convertToBengali(examineePerMahala.irregularExamineesSlots - examineePerMahala.remainingIrregularExamineesSlots)} / {convertToBengali(examineePerMahala.irregularExamineesSlots)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleOpenModal(registration, examineePerMahala.marhala._id)}
                      className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                    >
                      নিবন্ধন করুন
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Registration Modal */}
    
     <Dialog 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="পরীক্ষার্থী নিবন্ধন ফর্ম"
        className="w-[90%] max-w-[1200px] my-8"
        submitText="নিবন্ধন তথ্য সংরক্ষণ করুন"


      >
        <DialogContent className="w-full max-h-[85vh] overflow-y-auto p-6">

          
          {selectedRegistration && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h3 className="text-base mb-1 font-bold">
                নিবন্ধন বাকি
              </h3>
              <p className="text-sm font-semibold">নিয়মিত পরীক্ষার্থী: {convertToBengali(remainingSlots.regular)}</p>
              <p className="text-sm font-semibold">অনিয়মিত পরীক্ষার্থী: {convertToBengali(remainingSlots.irregular)}</p>
            </div>
          )}
          
          {serverResponse && (
            <div className={`mb-4 p-3 rounded-md ${serverResponse.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="text-sm font-medium">{serverResponse.message}</p>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Marhala Selection */}
                <FormField
                  control={form.control}
                  name="marhala"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>মারহালা</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!!selectedMarhalaId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="মারহালা নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedRegistration?.examineesPerMahala.map((examineePerMahala) => (
                            <SelectItem 
                              key={examineePerMahala.marhala._id} 
                              value={examineePerMahala.marhala._id}
                            >
                              {examineePerMahala.marhala.name.bengaliName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Registration Type */}
                <FormField
                  control={form.control}
                  name="registrationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>আবেদনের ধরণ</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || undefined}
                        defaultValue={undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="আবেদনের ধরণ নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="নিয়মিত">নিয়মিত</SelectItem>
                          <SelectItem value="অনিয়মিত">অনিয়মিত</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Examinee Name */}
              <div className="space-y-4">
                <h3 className="font-medium">পরীক্ষার্থীর নাম</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="examineeName.bengaliName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পরীক্ষার্থীর বাংলা নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পরীক্ষার্থীর বাংলা নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="examineeName.arabicName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পরীক্ষার্থীর আরবী নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পরীক্ষার্থীর আরবী নাম" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="examineeName.englishName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পরীক্ষার্থীর ইংরেজী নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পরীক্ষার্থীর ইংরেজী নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Father's Name */}
              <div className="space-y-4">
                <h3 className="font-medium">পিতার নাম</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fatherName.bengaliName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পিতার বাংলা নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পিতার বাংলা নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName.arabicName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পিতার আরবী নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পিতার আরবী নাম" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName.englishName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পিতার ইংরেজী নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পিতার ইংরেজী নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Mother's Name */}
              <div className="space-y-4">
                <h3 className="font-medium">মাতার নাম</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="motherName.bengaliName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>মাতার বাংলা নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="মাতার বাংলা নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherName.arabicName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>মাতার আরবী নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="মাতার আরবী নাম" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherName.englishName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>মাতার ইংরেজী নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="মাতার ইংরেজী নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Birth Date and NID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>জন্ম তারিখ</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} 
                      

                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nid_or_birth_certificate_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>জন্ম নিবন্ধন/জাতীয় পরিচয়পত্র নম্বর</FormLabel>
                      <FormControl>
                        <Input 
                        placeholder="জন্ম নিবন্ধন/জাতীয় পরিচয়পত্র নম্বর" {...field} 
                        value={convertToBengali(field.value)}
                       
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>ছবি আপলোড (সর্বোচ্চ ৩০০কেবি)</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-xs max-h-40 object-contain border rounded"
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  বাতিল
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "নিবন্ধন করা হচ্ছে..." : "নিবন্ধন করুন"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={closeDialog}
        title={statusDialog.title || ""}
        message={statusDialog.message || ""}
        type={statusDialog.type === "success" ? "success" : "error"}
      />
    </div>
  );
};

export default ExamineeRegistrationTable; 