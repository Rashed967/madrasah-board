'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Users, BookOpen, GraduationCap, Award, FileSpreadsheet } from 'lucide-react'
import { useGetExams } from '@/hooks/useGetExams'
import { useGetZones } from '@/hooks/useGetZones'
import { IExam } from '@/types/exam'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckboxDropdown } from '@/components/ui/checkbox'
import { useGetMarkazList } from '@/hooks/useGetMarkazList'
import { getBoardInfo } from '@/features/boardInfo/boardInfor.service'
import { useMarkazListPDFGenerator } from '@/hooks/useMarkazListPDFGenerator'

const PdfGeneratePage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedMarkaz, setSelectedMarkaz] = useState<string | null>(null)
  const [selectedMadrasahType, setSelectedMadrasahType] = useState<'boys' | 'girls' | 'both' | null>(null)
  const [selectedExamType, setSelectedExamType] = useState<'darsiyat' | 'hifz' | 'both' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [combinedData, setCombinedData] = useState<{
    boardInfo: any;
    allMarkaz: any;
  } | null>(null);
  
  const { exams, loading: examsLoading, error: examsError } = useGetExams()
  const { zones, getDistrictsForZones, loading: zonesLoading, error: zonesError } = useGetZones()
  const { getMarkazList, loading: markazListLoading, error: markazListError } = useGetMarkazList()
  const { generatePDF, loading: pdfLoading, error: pdfError, hasPDF } = useMarkazListPDFGenerator();

  const pdfOptions = [
    {
      id: 'madrasah-list',
      title: 'পরীক্ষাথীর রোলের লিস্ট',
      description: 'পরীক্ষাথীর রোলের লিস্টের পিডিএফ তৈরি করুন',
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'examinee-list',
      title: 'পরীক্ষার্থী লিস্ট',
      description: 'পরীক্ষার্থীদের তালিকা পিডিএফ তৈরি করুন',
      icon: <Users className="w-8 h-8 text-green-500" />,
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      id: 'kitab-list',
      title: 'কিতাব লিস্ট',
      description: 'কিতাবের তালিকা পিডিএফ তৈরি করুন',
      icon: <BookOpen className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'result-list',
      title: 'ফলাফল লিস্ট',
      description: 'পরীক্ষার ফলাফল পিডিএফ তৈরি করুন',
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      color: 'bg-yellow-50 hover:bg-yellow-100'
    },
    {
      id: 'teacher-list',
      title: 'শিক্ষক লিস্ট',
      description: 'শিক্ষকদের তালিকা পিডিএফ তৈরি করুন',
      icon: <GraduationCap className="w-8 h-8 text-red-500" />,
      color: 'bg-red-50 hover:bg-red-100'
    },
    {
      id: 'markaz-list',
      title: 'মারকায লিস্ট',
      description: 'মারকাযের তালিকা পিডিএফ তৈরি করুন',
      icon: <FileSpreadsheet className="w-8 h-8 text-indigo-500" />,
      color: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      id: 'pre-examinee-list',
      title: 'নিবন্ধিত পরীক্ষার্থী তালিকা',
      description: 'নিবন্ধিত পরীক্ষার্থী তালিকা পিডিএফ তৈরি করুন',
      icon: <FileSpreadsheet className="w-8 h-8 text-indigo-500" />,
      color: 'bg-indigo-50 hover:bg-indigo-100'
    }
  ]

  const selectedPdfOption = pdfOptions.find(option => option.id === selectedOption)

  const handleZoneSelect = (zoneId: string, checked: boolean) => {
    if (checked) {
      setSelectedZones([...selectedZones, zoneId])
    } else {
      setSelectedZones(selectedZones.filter(id => id !== zoneId))
      setSelectedDistricts([]) // Clear selected districts when zone is deselected
    }
  }

  const handleDistrictSelect = (district: string, checked: boolean) => {
    if (checked) {
      setSelectedDistricts([...selectedDistricts, district])
    } else {
      setSelectedDistricts(selectedDistricts.filter(d => d !== district))
    }
  }

  const handleSelectAllZones = (checked: boolean) => {
    if (checked) {
      setSelectedZones(zones.map(zone => zone._id))
    } else {
      setSelectedZones([])
      setSelectedDistricts([])
    }
  }

  const handleSelectAllDistricts = (checked: boolean) => {
    const availableDistricts = getDistrictsForZones(selectedZones)
    if (checked) {
      setSelectedDistricts(availableDistricts)
    } else {
      setSelectedDistricts([])
    }
  }

  const renderDialogContent = () => {
    if (!selectedPdfOption) return null

    switch (selectedPdfOption.id) {
      case 'madrasah-list':
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
                  onValueChange={(value: 'boys' | 'girls' | 'both') => setSelectedMadrasahType(value)}
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
                  onValueChange={(value: 'darsiyat' | 'hifz' | 'both') => setSelectedExamType(value)}
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
                onClick={() => {
                  setSelectedOption(null)
                  setSelectedExam(null)
                  setSelectedZones([])
                  setSelectedDistricts([])
                  setSelectedMadrasahType(null)
                  setSelectedExamType(null)
                }}
                className="text-gray-700"
              >
                বাতিল করুন
              </Button>
              <Button
                className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                disabled={!selectedExam || selectedZones.length === 0 || selectedDistricts.length === 0 || !selectedMadrasahType || !selectedExamType || isLoading}
                onClick={async () => {
                  try {
                    setIsLoading(true)
                    const madrasahType = selectedMadrasahType === 'both' ? 'উভয়' : selectedMadrasahType === 'boys' ? 'বালক' : 'বালিকা'
                    
                    // Fetch both board info and markaz list in parallel
                    const [boardInfoResult, markazListResult] = await Promise.all([
                      getBoardInfo(),
                      getMarkazList({
                        zoneIds: selectedZones,
                        districts: selectedDistricts,
                        madrasahType,
                        marhalaCategory: selectedExamType
                      })
                    ]);

                    // Combine the results
                    const combinedResult = {
                      boardInfo: boardInfoResult.data,
                      allMarkaz: markazListResult,
                      madrasahType: madrasahType,
                      examType: selectedExamType,
                      districts: selectedDistricts,
                      zones: selectedZones.map(zoneId => {
                        const zone = zones.find(z => z._id === zoneId);
                        return {
                          id: zoneId,
                          name: zone?.name || ''
                        };
                      }),
                      exam: exams.find(exam => exam._id === selectedExam) || null
                    };

                    setCombinedData(combinedResult);
                    console.log('Combined Data:', combinedResult);

                    // Generate PDF
                    await generatePDF(combinedResult);
                  } catch (error) {
                    console.error('Error:', error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
              >
                {isLoading || markazListLoading || pdfLoading ? (
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
        )

      case 'examinee-list':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              পরীক্ষার্থীদের তালিকা পিডিএফ তৈরি করার জন্য প্রস্তুত হচ্ছে...
            </p>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedOption(null)}
                className="text-gray-700"
              >
                বাতিল করুন
              </Button>
              <Button className="bg-[#52B788] hover:bg-[#52B788]/90 text-white">
                পিডিএফ তৈরি করুন
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              {selectedPdfOption.description}
            </p>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedOption(null)}
                className="text-gray-700"
              >
                বাতিল করুন
              </Button>
              <Button className="bg-[#52B788] hover:bg-[#52B788]/90 text-white">
                পিডিএফ তৈরি করুন
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-white shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">
            পিডিএফ জেনারেট
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfOptions.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                className={`w-full h-full p-6 flex flex-col items-center justify-center space-y-4 ${option.color} border-2 border-dashed border-gray-200 rounded-xl transition-all duration-200`}
                onClick={() => setSelectedOption(option.id)}
              >
                {option.icon}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPdfOption && (
        <Dialog
          isOpen={!!selectedOption}
          onClose={() => {
            setSelectedOption(null)
            setSelectedExam(null)
          }}
          title={selectedPdfOption.title}
          className='w-6/12'
        >
          {renderDialogContent()}
        </Dialog>
      )}
    </div>
  )
}

export default PdfGeneratePage