'use client';

import { useState, useEffect } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { StatusDialog } from '@/components/ui/status-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { IPreExamineeRegistration } from '@/features/preExamineeRegistration/interfaces';
import { preExamineeRegistrationServices } from '@/services/preExamineeRegistrationService';
import { MoreVertical, Edit, Trash, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { examServices } from '@/services/examService';
import { MdFilterList } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

interface ApiResponse {
  data: {
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  };
  success: boolean;
  message?: string;
}

export default function AllPreExamineeRegistrations() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [exams, setExams] = useState([]);
  const [statusDialog, setStatusDialog] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: ''
  });

  const fetchExams = async () => {
    try {
      const response = await examServices.getExams();
      if (response.success) {
        setExams(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch exams:', err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await preExamineeRegistrationServices.getAll(currentPage, limitPerPage) as ApiResponse;
      console.log(response);
      if (response.success) {
        setRegistrations(response.data.data);
        setTotalDocuments(response.data.meta.total);
        setTotalPages(Math.ceil(response.data.meta.total / limitPerPage));
      } else {
        throw new Error(response.message || 'Failed to fetch registrations');
      }
    } catch (err: any) {
      console.error('Fetch Error:', err);
      setError(err.message);
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, limitPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (value: string) => {
    setLimitPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRegistrations();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-2">সকল প্রাক নিবন্ধন</h1>

      {/* Filter Section */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <form onSubmit={handleFilter} className="space-y-4 ">
            <div className="flex items-center gap-4 ">
              <div className="flex-1">
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger>
                    <SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
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
                  placeholder="নাম অথবা কোড..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="bg-[#52B788] text-white rounded-md p-2 h-8 w-17 flex items-center justify-center">
                {/* // filter icon */}
                <MdFilterList className="h-4 w-4" />
              <Button type="submit">ফিল্টার করুন</Button>
            </div>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Items per page section */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center gap-2">
          <span>প্রতি পেজে:</span>
          <Select value={String(limitPerPage)} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <Card>
        <CardContent className="p-0">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader className='bg-[#52B788] text-white'>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>কোড</TableHead>
                <TableHead>নাম</TableHead>
                <TableHead>মোট পরীক্ষার্থী</TableHead>
                <TableHead>মোট ফি</TableHead>
                <TableHead>পরিশোধিত</TableHead>
                <TableHead>নিবন্ধন তারিখ</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-red-500">{error}</TableCell>
                </TableRow>
              ) : registrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No registrations found</TableCell>
                </TableRow>
              ) : (
                registrations.map((registration, index) => (
                  <TableRow 
                    key={registration._id.toString()}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <TableCell>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{registration.madrasah.code}</TableCell>
                    <TableCell>
                      <button 
                        onClick={() => router.push(`/dashboard/exam/pre-examinee-registration/${registration._id}`)}
                        className="text-left hover:text-[#52B788] hover:underline"
                      >
                        {registration.madrasah.madrasahNames.bengaliName}
                      </button>
                    </TableCell>
                    <TableCell>{registration.totalExaminees.toLocaleString('bn-BD')}</TableCell>
                    <TableCell>
                      {typeof registration.transaction.totalAmount === 'number' ? registration.transaction.totalAmount.toLocaleString('bn-BD') : (0).toLocaleString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      {typeof registration.transaction.paidAmount === 'number' ? registration.transaction.paidAmount.toLocaleString('bn-BD') : (0).toLocaleString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      {new Date(registration.createdAt).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-100">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/exam/pre-examinee-registration/${registration._id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>এডিট</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>ডিলিট</span>
                          </DropdownMenuItem>
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
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
    </div>
  );
}
