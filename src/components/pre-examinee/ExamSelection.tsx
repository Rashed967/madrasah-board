import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ExamSelectionProps {
  exams: Array<{ _id: string; examName: string }>;
  selectedExam: string;
  onExamChange: (value: string) => void;
}

const ExamSelection = ({ exams, selectedExam, onExamChange }: ExamSelectionProps) => {
  return (
    <div>
      <Label>পরীক্ষা নির্বাচন করুন</Label>
      <Select onValueChange={onExamChange} value={selectedExam}>
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
    </div>
  );
};

export default ExamSelection;
