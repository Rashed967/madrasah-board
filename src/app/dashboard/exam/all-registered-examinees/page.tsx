'use client'

import { useState, useEffect } from 'react'
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
import { MoreVertical, Edit, Trash, FileText } from 'lucide-react'
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
  const [exams, setExams] = useState([])
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: ''
  })

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

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExaminees = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching examinees...')
      const response = await examineeRegistrationService.getAll(currentPage, limitPerPage)
      console.log('API Response:', response)
      console.log('Response data:', response.data)
      console.log('Response meta:', response.meta)
      if (response.success) {
        setExaminees(response.data as unknown as IRegesteredExamineeResponse[])
        setTotalDocuments(response.meta.total)
        setTotalPages(Math.ceil(response.meta.total / limitPerPage))
      } else {
        throw new Error(response.message || 'Failed to fetch examinees')
      }
    } catch (err: any) {
      console.error('Fetch Error:', err)
      setError(err.message)
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExaminees()
  }, [currentPage, limitPerPage])

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-2 text-gray-800">সকল নিবন্ধিত পরীক্ষার্থী</h1>

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
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="নাম অথবা রেজিস্ট্রেশন নম্বর..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-gray-700"
                />
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
                    <TableCell className="text-gray-700">{examinee.examineeName?.bengaliName}</TableCell>
                    <TableCell className="text-gray-700">{examinee.fatherName?.bengaliName}</TableCell>
                    <TableCell className="text-gray-700">{examinee.marhala?.name?.bengaliName}</TableCell>
                    <TableCell className="text-gray-700">{examinee.madrasah?.madrasahNames?.bengaliName}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          examinee.examineeStatus === 'নির্বাচিত'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {examinee.examineeStatus}
                      </span>
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
