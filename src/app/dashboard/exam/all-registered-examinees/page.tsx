'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { StatusDialog } from '@/components/ui/status-dialog'
import { MoreVertical, Edit, Trash, FileText, List, FileDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MdFilterList } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { examServices } from '@/services/examService'
import { examineeRegistrationService } from '@/services/examineeRegistrationService'
import IRegesteredExaminee, { IRegesteredExamineeResponse } from '@/features/examineeRegistration/ExamineeRegistration.interface'
import { ApiResponse } from '@/core/api/apiService'
import { convertToBengali } from '@/utils/convertToBengali'
import { SmallSwitch, Switch } from '@/components/ui/switch'
import MadrasahSelectionForExamineeRegistration from '@/components/examinee-registration/MadrasahSelectionForExamineeRegistration'
import Madrasah from '@/types/madrasah'



const ITEMS_PER_PAGE = 10

type ExamineeListResponse = {
  data: IRegesteredExaminee[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export default function AllRegisteredExaminees() {
  const router = useRouter()
  const [examinees, setExaminees] = useState<IRegesteredExamineeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [limitPerPage, setLimitPerPage] = useState(ITEMS_PER_PAGE)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedMadrasah, setSelectedMadrasah] = useState('')
  const [madrasahSearchTerm, setMadrasahSearchTerm] = useState('')
  const [madrasahSuggestions, setMadrasahSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMadrasahName, setSelectedMadrasahName] = useState('')
  const [exams, setExams] = useState([])
  const [madrasahs, setMadrasahs] = useState([])
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: ''
  })
  const madrasahSearchRef = useRef(null)
  const [hasExaminees, setHasExaminees] = useState(false)



  const fetchExams = async () => {
    try {
      const response = await examServices.getExams()
      if (response.success) {
        setExams(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch exams:', err)
    }
  }

  const fetchMadrasahs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/madrasahs?limit=1000`)
      const data = await response.json()
      if (data.success) {
        setMadrasahs(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch madrasahs:', err)
    }
  }

  useEffect(() => {
    fetchExams()
    fetchMadrasahs()
  }, [])

  const fetchExaminees = async () => {
    setLoading(true)
    setError(null)
    try {
      // get access token from local storage
      const accessToken = localStorage.getItem('access_token')
      
      // Build the URL with query parameters
      let url = `${process.env.NEXT_PUBLIC_MAIN_URL}/regestered-examinees?page=${currentPage}&limit=${limitPerPage}`
      
      if (selectedExam) {
        url += `&exam=${selectedExam}`
      }
      
      if (selectedMadrasah) {
        url += `&madrasah=${selectedMadrasah}`
      }
      
      
      // Make the API call with authorization header
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setExaminees(data.data)
        setTotalDocuments(data.meta.total)
        setTotalPages(Math.ceil(data.meta.total / limitPerPage))
        // Check if there are any examinees
        setHasExaminees(data.data && data.data.length > 0)
      } else {
        throw new Error(data.message || 'Failed to fetch examinees')
      }
    } catch (err: any) {
      console.error('Fetch Error:', err)
      setError(err.message)

      setHasExaminees(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExaminees()
  }, [currentPage, limitPerPage, selectedExam, selectedMadrasah])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (value: string) => {
    setLimitPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchExaminees()
  }

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/exam/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/exam/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await examineeRegistrationService.deleteExaminee(id)
      if (response.success) {
        fetchExaminees()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleStatusChange = async (id: string, checked: boolean) => {
    try {
      const response = await examineeRegistrationService.updateStatus(id)
      if (response.success && response.data) {
        // Update the state with the new data including the roll number
        setExaminees(prevExaminees => 
          prevExaminees.map(examinee => 
            examinee._id?.toString() === id 
              ? { 
                  ...examinee, 
                  examineeStatus: checked ? 'নির্বাচিত' : 'অনির্বাচিত',
                  roll: response.data.roll
                } 
              : examinee
          )
        );
      }
    } catch (error) {
      console.error('Status change error:', error)
    }
  }

  const handleDownloadFeeForm = async () => {
    if (!selectedExam || !selectedMadrasah) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'পরীক্ষা ও মাদ্রাসা নির্বাচন করুন'
      })
      return
    }
    // get access token from local storage
    const accessToken = localStorage.getItem('access_token')
    
    try {
      const registeredExamineesResponse = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/regestered-examinees?madrasah=${selectedMadrasah}&exam=${selectedExam}&limit=100`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const selectedExamResponse = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/exams/${selectedExam}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const selectedExamData = await selectedExamResponse.json()
      const registeredExaminees = await registeredExamineesResponse.json()

      // get board info 
      const boardInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/board-info/67bb52249fbe4879db797d88`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const boardInfoData = await boardInfoResponse.json()

      // ‍select madrasah 
      const madrasahResponse = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/madrasah/${selectedMadrasah}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const madrasahData = await madrasahResponse.json()

      // Clean up the examinees data by removing nested objects
      const cleanedExaminees = registeredExaminees.data.map(examinee => {
        // Create a new object with only the needed properties
        const { 
          _id, 
          examineeName, 
          fatherName, 
          motherName, 
          nid_or_birth_certificate_number, 
          birthDate, 
          registrationNumber, 
          marks, 
          imageUrl, 
          examineeType, 
          registrationType, 
          isDeleted, 
          createdAt, 
          updatedAt, 
          examineeStatus, 
          roll,
          marhala
        } = examinee;
        
        // Keep only the specified properties in the marhala object
        const cleanedMarhala = marhala ? {
          name: marhala.name,
          marhalaCategory: marhala.marhalaCategory,
          marhalaType: marhala.marhalaType,
          id: marhala.id
        } : null;


        return {
          _id,
          examineeName,
          fatherName,
          motherName,
          nid_or_birth_certificate_number,
          birthDate,
          registrationNumber,
          marks,
          imageUrl,
          examineeType,
          registrationType,
          isDeleted,
          createdAt,
          updatedAt,
          examineeStatus,
          roll,
          marhala: cleanedMarhala
        };
      });

      const finalData = {
        registeredExaminees: cleanedExaminees,
        selectedExam: selectedExamData.data,
        boardInfo: boardInfoData.data,
        madrasah: madrasahData.data
      }
      // generate report and download it
      const response = await fetch(`${process.env.NEXT_PUBLIC_JSREPORT_SERVER_URL}/examinee-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalData)
      })
      const blob = await response.blob()
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    
    } catch (error) {
      console.error('Error fetching data for PDF:', error)
    }
  }

  const handleDownloadInvoice = async () => {
    if (!selectedExam || !selectedMadrasah) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'পরীক্ষা ও মাদ্রাসা নির্বাচন করুন'
      })
      return
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/regestered-examinees?madrasah=${selectedMadrasah}&exam=${selectedExam}`)
      const data = await response.json()
    } catch (error) {
      console.error('Error fetching data for Invoice:', error)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (madrasahSearchRef.current && !madrasahSearchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch madrasah suggestions when search term changes
  useEffect(() => {
    const fetchMadrasahSuggestions = async () => {
      // get access token from local storage
      const accessToken = localStorage.getItem('access_token')

      if (madrasahSearchTerm.length < 2) {
        setMadrasahSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/madrasah?searchTerm=${madrasahSearchTerm}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        const data = await response.json()
        if (data.success) {
          setMadrasahSuggestions(data.data)
          setShowSuggestions(true)
        }
      } catch (err) {
        console.error('Failed to fetch madrasah suggestions:', err)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchMadrasahSuggestions()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [madrasahSearchTerm])

  const handleMadrasahSelect = (madrasah) => {
    setSelectedMadrasah(madrasah._id)
    setSelectedMadrasahName(`${madrasah.madrasahNames.bengaliName} - ${madrasah.code}`)
    setMadrasahSearchTerm(`${madrasah.madrasahNames.bengaliName} - ${madrasah.code}`)
    setShowSuggestions(false)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-2 text-gray-800">সকল নিবন্ধিত পরীক্ষার্থী</h1>

      {/* PDF Download Buttons */}
      <div className="flex gap-4 mb-4">
        <Button 
          onClick={handleDownloadFeeForm} 
          disabled={!selectedExam || !selectedMadrasah || !hasExaminees}
          className="bg-[#52B788] text-white"
        >
          <List className="mr-2 h-4 w-4" />
          ফি জমা ফরম
        </Button>
        <Button 
          onClick={handleDownloadInvoice} 
          disabled={!selectedExam || !selectedMadrasah || !hasExaminees}
          className="bg-[#52B788] text-white"
        >
          <FileDown className="mr-2 h-4 w-4" />
          ইনভয়েস ডাউনলোড
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <form onSubmit={handleFilter} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger>
                    <SelectValue placeholder="পরীক্ষা নির্বাচন" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam._id} value={exam._id}>
                        {exam.examName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 relative" ref={madrasahSearchRef}>
                <Input
                  type="text"
                  placeholder="মাদ্রাসার নাম বা কোড..."
                  value={madrasahSearchTerm}
                  onChange={(e) => setMadrasahSearchTerm(e.target.value)}
                  className="text-gray-700"
                />
                {showSuggestions && madrasahSuggestions.length > 0 && (
                  <div className="text-black absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {madrasahSuggestions.map((madrasah) => (
                      <div
                        key={madrasah._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleMadrasahSelect(madrasah)}
                      >
                        {madrasah.madrasahNames.bengaliName} - {madrasah.code}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="bg-[#52B788] text-white">
                <MdFilterList className="mr-2" />
                ফিল্টার করুন
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Examinees Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#52B788] text-white">
            <TableRow>
                <TableHead>রেজিস্ট্রেশন নং</TableHead>
                <TableHead>রোল</TableHead>
                <TableHead>নাম</TableHead>
                <TableHead>পিতার নাম</TableHead>
                <TableHead>মারহালা</TableHead>
                <TableHead>মাদ্রাসা</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    লোড হচ্ছে...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-500">
                    {error}
                </TableCell>
                </TableRow>
              ) : !examinees || examinees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    কোনো পরীক্ষার্থী পাওয়া যায়নি
                </TableCell>
                </TableRow>
              ) : (
                examinees.map((examinee) => (
                  <TableRow key={examinee._id?.toString()}>
                    <TableCell className="text-gray-700">{convertToBengali(examinee.registrationNumber.toString())}</TableCell>
                    <TableCell className="text-gray-700">{examinee.roll}</TableCell>
                    <TableCell className="text-gray-700">{examinee.examineeName?.bengaliName}</TableCell>
                    <TableCell className="text-gray-700">{examinee.fatherName?.bengaliName}</TableCell>
                    <TableCell className="text-gray-700">{examinee.marhala?.name?.bengaliName}</TableCell>
                    <TableCell className="text-gray-700">{examinee.madrasah?.madrasahNames?.bengaliName}</TableCell>
                    <TableCell>
                      {/* add a beautiful and small toggle, toggle on in case of নির্বাচিত and toggle off in case of বাছাই করা */}
                      {/* need more too small */}
                      <div className='flex flex-col items-center gap-1'>
                      <div>
                      <SmallSwitch
                        checked={examinee.examineeStatus === 'নির্বাচিত'}
                        onCheckedChange={(checked) => handleStatusChange(examinee._id?.toString() || '', checked)}
                      />
                      </div>
                      
                      <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          examinee.examineeStatus === 'নির্বাচিত'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {examinee.examineeStatus}
                      </span>
                      </div>
                      </div>
                     
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu  >
                        <DropdownMenuTrigger asChild className="bg-[#52B788] text-white rounded-full">
                      <Button
                        variant="ghost"
                            className="h-8 w-8 p-0"
                      >
                            <MoreVertical className="h-4 w-4" />
                      </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(examinee._id?.toString() || '')}
                          >
                            <FileText className="mr-2 h-4 w-4 text-gray-700" />
                            বিস্তারিত
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(examinee._id?.toString() || '')}
                          >
                            <Edit className="mr-2 h-4 w-4 text-gray-700" />
                            এডিট
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() => handleDelete(examinee._id?.toString() || '')}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4 text-red-600" />
                            ডিলিট
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                </TableCell>
              </TableRow>
                ))
              )}
          </TableBody>
        </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Status Dialog */}
      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog((prev) => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
    </div>
  )
}
