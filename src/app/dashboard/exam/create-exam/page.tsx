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


import { useExamForm } from "./hooks/useExamForm";
import ExamBasicInformationSection from "./components/ExamBasicInformationSection";
import RegistrationInformationSection from "./components/RegistrationInformationSection";
import FeeSectionComponent from "./components/FeeSectionComponent";


export default function CreateExamPage() {
  const router = useRouter();
  const { 
    formData, 
    errors, 
    isSubmitting, 
    statusDialog,
    handleChange,
    handleFeeChange,
    handleSubmit,
    setStatusDialog 
  } = useExamForm();

  return (
    <div className="container  md:mx-6 lg:mx-8 mt-8">
      <Card className="bg-[#FBFBFB] md:mx-6 lg:mx-8">
        <CardHeader>
          <CardTitle className="text-md md:text-lg font-bold text-gray-800">নতুন পরীক্ষা তৈরি করুন</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 ">
            {/* Basic Information Section */}
            <ExamBasicInformationSection
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
           

            {/* Registration Information Section */}
        <RegistrationInformationSection 
        formData={formData} 
        onChange={handleChange} 
        errors={errors} />

            <hr  />
            {/* fees section div */}
        <FeeSectionComponent 
              formData={formData}
              errors={errors}
              onFeeChange={handleFeeChange}
            />

            {/* Submit Button */}
            <div className="flex justify-center md:justify-end space-x-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#52B788] hover:bg-[#52B788]/70 text-white w-2/3 md:w-2/6 lg:w-1/4  mx:auto"
              >
                <IoAddCircle className="text-xl mr-2" />

                {isSubmitting ? "তৈরি করা হচ্ছে..." : "পরীক্ষা তৈরি করুন"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <StatusDialog 
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
          title={statusDialog.title}
          message={statusDialog.message}
          type={statusDialog.type}
      />
    </div>
  );
}