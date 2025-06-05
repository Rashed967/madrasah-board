"use client";
import { useContext, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toast, Toaster } from 'react-hot-toast'
import { useExam } from '@/contexts/ExamSearchContext';
import ExamSearch from '../shared/ExamSearch';


// Demo data
const demoExams = [
  { id: '1', name: 'মাদরাসা বোর্ড পরীক্ষা ২০২৪' },
  { id: '2', name: 'মাদরাসা বোর্ড পরীক্ষা ২০২৩' }
]

const demoMarhalas = [
  { id: '1', name: 'আলিম' },
  { id: '2', name: 'ফাজিল' },
  { id: '3', name: 'কামিল' }
]

const demoSubjects = [
  { id: '1', name: 'আরবি সাহিত্য' },
  { id: '2', name: 'ইসলামি আইন' },
  { id: '3', name: 'হাদিস' }
]

const demoMarkazs = [
  { id: '1', name: 'মারকাজ ১' },
  { id: '2', name: 'মারকাজ ২' },
  { id: '3', name: 'মারকাজ ৩' }
]

const ExamScheduleForm = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    exam: '',
    marhala: '',
    subject: '',
    markaz: '',
    examDate: '',
    startTime: '',
    endTime: '',
    duration: '',
    totalMarks: '',
  })

  const {selectedExam} =  useExam()
  console.log(selectedExam)

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success('পরীক্ষার শিডিউল সফলভাবে সংরক্ষণ করা হয়েছে')
      setLoading(false)
      // Optionally reset form or show success message
    }, 1000)
  }

  return (
    <Card className="p-6">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Exam Selection */}
        <ExamSearch />


          {/* Marhala Selection */}
          <div className="space-y-2">
            <Label htmlFor="marhala">মারহালা নির্বাচন করুন</Label>
            <Select onValueChange={(value) => handleInputChange('marhala', value)} value={formData.marhala}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="মারহালা নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {demoMarhalas.map(marhala => (
                  <SelectItem key={marhala.id} value={marhala.id}>{marhala.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subject">বিষয় নির্বাচন করুন</Label>
            <Select onValueChange={(value) => handleInputChange('subject', value)} value={formData.subject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="বিষয় নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {demoSubjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Markaz Selection */}
          <div className="space-y-2">
            <Label htmlFor="markaz">মারকাজ নির্বাচন করুন</Label>
            <Select onValueChange={(value) => handleInputChange('markaz', value)} value={formData.markaz}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="মারকাজ নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {demoMarkazs.map(markaz => (
                  <SelectItem key={markaz.id} value={markaz.id}>{markaz.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exam Date */}
          <div className="space-y-2">
            <Label htmlFor="examDate">পরীক্ষার তারিখ</Label>
            <Input 
              type="date" 
              id="examDate" 
              value={formData.examDate} 
              onChange={(e) => handleInputChange('examDate', e.target.value)}
            />
          </div>

          {/* Exam Time */}
          <div className="space-y-2">
            <Label>পরীক্ষার সময়</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">শুরুর সময়</Label>
                <Input 
                  type="time" 
                  id="startTime" 
                  value={formData.startTime} 
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">শেষের সময়</Label>
                <Input 
                  type="time" 
                  id="endTime" 
                  value={formData.endTime} 
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">পরীক্ষার সময়কাল (মিনিট)</Label>
            <Input 
              type="number" 
              id="duration" 
              placeholder="উদাহরণ: 180" 
              value={formData.duration} 
              onChange={(e) => handleInputChange('duration', e.target.value)}
            />
          </div>

          {/* Total Marks */}
          <div className="space-y-2">
            <Label htmlFor="totalMarks">মোট নম্বর</Label>
            <Input 
              type="number" 
              id="totalMarks" 
              placeholder="উদাহরণ: 100" 
              value={formData.totalMarks} 
              onChange={(e) => handleInputChange('totalMarks', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            বাতিল করুন
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ExamScheduleForm 