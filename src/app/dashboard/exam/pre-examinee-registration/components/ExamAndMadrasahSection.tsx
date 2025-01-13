import React from 'react';
import  IExam  from '@/features/exam/exam.interface';
import { IMadrasah } from '@/features/madrasah/interfaces';
import { SelectField } from '@/components/ui/select';

interface ExamAndMadrasahSectionProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  exams: IExam[] | null;
  madrasahs: IMadrasah[] | null;
}

const ExamAndMadrasahSection: React.FC<ExamAndMadrasahSectionProps> = ({
  formData,
  errors,
  onChange,
  exams,
  madrasahs,
}) => {
  // Create a mapping of exam names to IDs
  const examIdMap = Object.fromEntries(
    (exams || []).map(exam => [exam.examName, exam._id?.toString() || "no-id"])
  );

  // Create a mapping of madrasah names to IDs
  const madrasahIdMap = Object.fromEntries(
    (madrasahs || []).map(madrasah => [
      madrasah.madrasahNames?.bengaliName || "Unknown",
      madrasah._id?.toString() || "no-id"
    ])
  );

  // Handle exam selection
  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const examId = examIdMap[e.target.value] || e.target.value;
    onChange({
      ...e,
      target: { ...e.target, value: examId }
    });
  };

  // Handle madrasah selection
  const handleMadrasahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const madrasahId = madrasahIdMap[e.target.value] || e.target.value;
    onChange({
      ...e,
      target: { ...e.target, value: madrasahId }
    });
  };

  const allExams = [
    "পরীক্ষা নির্বাচন করুন",
    "পরীক্ষা ১",
    "পরীক্ষা ২",
    "পরীক্ষা ৩",
  ]

  // all exam names from fetched data
  const allExamNames = [...exams?.map(exam => exam.examName) || []]


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="পরীক্ষা নির্বাচন করুন"
          name="exam"
          value={formData.exam}
          onChange={handleExamChange}
          error={errors.exam}
          options={allExamNames}
        />

{/* ["পরীক্ষা নির্বাচন করুন", ...(exams || []).map(exam => exam.examName)] */}

        <SelectField
          label="মাদ্রাসা নির্বাচন করুন"
          name="madrasah"
          value={formData.madrasah}
          onChange={handleMadrasahChange}
          error={errors.madrasah}
          options={[
            "মাদ্রাসা নির্বাচন করুন",
            ...(madrasahs || []).map(madrasah => madrasah.madrasahNames?.bengaliName || "Unknown")
          ]}
        />
      </div>
    </div>
  );
};

export default ExamAndMadrasahSection;
