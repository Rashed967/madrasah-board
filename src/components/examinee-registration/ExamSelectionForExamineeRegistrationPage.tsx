import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"

interface Exam {
  _id: string;
  examName: string;
  endRegistrationDate: string;
  registrationStartNumber: number;
  currentRegistrationNumber: number;
  registrationFeeForRegularStudent: number;
  registrationFeeForIrregularStudent: number;
  lateRegistrationFeeForRegularStudent: number;
  lateRegistrationFeeForIrregularStudent: number;
}

interface ExamSelectionForExamineeRegistrationPageProps {
  exams: Exam[];
  onExamSelect?: (examId: string) => void;
}

const ExamSelectionForExamineeRegistrationPage = ({
  exams,
  onExamSelect
}: ExamSelectionForExamineeRegistrationPageProps) => {
  const [selectedExam, setSelectedExam] = useState<string>("");

  const handleExamChange = (value: string) => {
    setSelectedExam(value);
    if (onExamSelect) {
      onExamSelect(value);
    }
  };

  return (
    <div className="w-1/3">
      <Select value={selectedExam} onValueChange={handleExamChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
        </SelectTrigger>
        <SelectContent>
          {exams && exams.length > 0 ? (
            exams.map((exam) => (
              <SelectItem key={exam._id} value={exam._id}>
                {exam.examName}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-exams" disabled>
              কোন পরীক্ষা পাওয়া যায়নি
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExamSelectionForExamineeRegistrationPage;
