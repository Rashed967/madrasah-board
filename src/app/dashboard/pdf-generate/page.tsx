'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { getBoardInfo } from '@/features/boardInfo/boardInfor.service'
import { useGetExams } from '@/hooks/useGetExams'
import { useGetMarkazList } from '@/hooks/useGetMarkazList'
import { useGetZones } from '@/hooks/useGetZones'
import { useMarkazListPDFGenerator } from '@/hooks/useMarkazListPDFGenerator'
import { Award, BookOpen, FileSpreadsheet, FileText, GraduationCap, Users } from 'lucide-react'
import { useState } from 'react'
import { pdfOptions } from '@/constants/pdfOptions'
import { pdfGenerators } from '@/config/pdfGenerators'
import { PDFFormData } from '@/types/pdfGenerator.types'

const PdfGeneratePage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { exams, loading: examsLoading, error: examsError } = useGetExams()
  const { zones, getDistrictsForZones, loading: zonesLoading, error: zonesError } = useGetZones()
  const { getMarkazList, loading: markazListLoading, error: markazListError } = useGetMarkazList()
  const { generatePDF, loading: pdfLoading, error: pdfError } = useMarkazListPDFGenerator();

  const selectedPdfOption = pdfOptions.find(option => option.id === selectedOption)
  const selectedGenerator = selectedOption ? pdfGenerators[selectedOption] : null

  const handleSubmit = async (data: PDFFormData) => {
    try {
      setIsLoading(true)
      
      // Convert madrasahType to Bengali for server
      const madrasahTypeInBengali = data.madrasahType === 'boys' ? 'বালক' : 
                                  data.madrasahType === 'girls' ? 'বালিকা' : 
                                  'উভয়';
      
      // Fetch both board info and markaz list in parallel
      const [boardInfoResult, markazListResult] = await Promise.all([
        getBoardInfo(),
        getMarkazList({
          zoneIds: data.zones || [],
          districts: data.districts || [],
          madrasahType: madrasahTypeInBengali,
          marhalaCategory: data.examType
        })
      ]);

      // Combine the results
      const combinedResult = {
        boardInfo: boardInfoResult.data,
        allMarkaz: markazListResult,
        madrasahType: madrasahTypeInBengali,
        examType: data.examType,
        districts: data.districts,
        zones: (data.zones || []).map(zoneId => {
          const zone = zones.find(z => z._id === zoneId);
          return {
            id: zoneId,
            name: zone?.name || ''
          };
        }),
        exam: exams.find(exam => exam._id === data.examId) || null
      };

      // Generate PDF
      await generatePDF(combinedResult);
      
      // Close dialog
      setSelectedOption(null);
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderDialogContent = () => {
    if (!selectedPdfOption || !selectedGenerator) return null;

    const FormComponent = selectedGenerator.component;
    
    return (
      <FormComponent
        exams={exams}
        zones={zones}
        examsLoading={examsLoading}
        examsError={examsError}
        zonesLoading={zonesLoading}
        zonesError={zonesError}
        getDistrictsForZones={getDistrictsForZones}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedOption(null)}
      />
    );
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
            {pdfOptions.map((option) => {
              const Icon = {
                FileText,
                Users,
                BookOpen,
                Award,
                GraduationCap,
                FileSpreadsheet
              }[option.icon];

              return (
                <Button
                  key={option.id}
                  variant="ghost"
                  className={`w-full h-full p-6 flex flex-col items-center justify-center space-y-4 ${option.color} border-2 border-dashed border-gray-200 rounded-xl transition-all duration-200`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <Icon className="w-8 h-8" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedPdfOption && (
        <Dialog
          isOpen={!!selectedOption}
          onClose={() => setSelectedOption(null)}
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