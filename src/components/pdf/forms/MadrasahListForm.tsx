import { Button } from '@/components/ui/button';
import { CheckboxDropdown } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExamType, MadrasahType, PDFFormData } from '@/types/pdf';
import { useState } from 'react';

interface MadrasahListFormProps {
  exams: any[];
  zones: any[];
  examsLoading: boolean;
  examsError: string | null;
  zonesLoading: boolean;
  zonesError: string | null;
  getDistrictsForZones: (zoneIds: string[]) => string[];
  onSubmit: (data: PDFFormData) => Promise<void>;
  onCancel: () => void;
}

export const MadrasahListForm = ({
  exams,
  zones,
  examsLoading,
  examsError,
  zonesLoading,
  zonesError,
  getDistrictsForZones,
  onSubmit,
  onCancel
}: MadrasahListFormProps) => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedMadrasahType, setSelectedMadrasahType] = useState<MadrasahType | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<ExamType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleZoneSelect = (zoneId: string, checked: boolean) => {
    if (checked) {
      setSelectedZones([...selectedZones, zoneId]);
    } else {
      setSelectedZones(selectedZones.filter(id => id !== zoneId));
      setSelectedDistricts([]);
    }
  };

  const handleDistrictSelect = (district: string, checked: boolean) => {
    if (checked) {
      setSelectedDistricts([...selectedDistricts, district]);
    } else {
      setSelectedDistricts(selectedDistricts.filter(d => d !== district));
    }
  };

  const handleSelectAllZones = (checked: boolean) => {
    if (checked) {
      setSelectedZones(zones.map(zone => zone._id));
    } else {
      setSelectedZones([]);
      setSelectedDistricts([]);
    }
  };

  const handleSelectAllDistricts = (checked: boolean) => {
    const availableDistricts = getDistrictsForZones(selectedZones);
    if (checked) {
      setSelectedDistricts(availableDistricts);
    } else {
      setSelectedDistricts([]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      await onSubmit({
        examId: selectedExam,
        zones: selectedZones,
        districts: selectedDistricts,
        madrasahType: selectedMadrasahType,
        examType: selectedExamType
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            পরীক্ষা নির্বাচন করুন
          </label>
          <Select
            value={selectedExam || ''}
            onValueChange={(value) => setSelectedExam(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {examsLoading ? (
                <SelectItem value="loading" disabled>
                  লোড হচ্ছে...
                </SelectItem>
              ) : examsError ? (
                <SelectItem value="error" disabled>
                  {examsError}
                </SelectItem>
              ) : (
                exams.map((exam) => (
                  <SelectItem key={exam._id} value={exam._id}>
                    {exam.examName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            জোন নির্বাচন করুন
          </label>
          <CheckboxDropdown
            trigger={
              <span>
                {selectedZones.length > 0
                  ? `${selectedZones.length}টি জোন নির্বাচিত`
                  : "জোন নির্বাচন করুন"}
              </span>
            }
            items={zones.map(zone => ({
              id: zone._id,
              label: zone.name,
              checked: selectedZones.includes(zone._id),
              onCheckedChange: (checked) => handleZoneSelect(zone._id, checked)
            }))}
            selectAll={{
              label: "সব জোন নির্বাচন করুন",
              checked: selectedZones.length === zones.length,
              onCheckedChange: handleSelectAllZones
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            জেলা নির্বাচন করুন
          </label>
          <CheckboxDropdown
            trigger={
              <span>
                {selectedDistricts.length > 0
                  ? `${selectedDistricts.length}টি জেলা নির্বাচিত`
                  : "জেলা নির্বাচন করুন"}
              </span>
            }
            items={getDistrictsForZones(selectedZones).map(district => ({
              id: district,
              label: district,
              checked: selectedDistricts.includes(district),
              onCheckedChange: (checked) => handleDistrictSelect(district, checked)
            }))}
            selectAll={{
              label: "সব জেলা নির্বাচন করুন",
              checked: selectedDistricts.length === getDistrictsForZones(selectedZones).length,
              onCheckedChange: handleSelectAllDistricts
            }}
            className={selectedZones.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            মাদ্রাসা টাইপ নির্বাচন করুন
          </label>
          <Select
            value={selectedMadrasahType || ''}
            onValueChange={(value: MadrasahType) => setSelectedMadrasahType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="মাদ্রাসা টাইপ নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boys">বালক</SelectItem>
              <SelectItem value="girls">বালিকা</SelectItem>
              <SelectItem value="both">উভয়</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            পরীক্ষার ধরণ নির্বাচন করুন
          </label>
          <Select
            value={selectedExamType || ''}
            onValueChange={(value: ExamType) => setSelectedExamType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="পরীক্ষার ধরণ নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="darsiyat">দারসিয়াত</SelectItem>
              <SelectItem value="hifz">হিফজ</SelectItem>
              <SelectItem value="both">উভয়</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-gray-700"
        >
          বাতিল করুন
        </Button>
        <Button
          className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
          disabled={!selectedExam || selectedZones.length === 0 || selectedDistricts.length === 0 || !selectedMadrasahType || !selectedExamType || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              লোড হচ্ছে...
            </div>
          ) : (
            'পিডিএফ তৈরি করুন'
          )}
        </Button>
      </div>
    </div>
  );
}; 