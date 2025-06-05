"use client";
import ExamScheduleForm from '@/components/exam-schedule/ExamScheduleForm'
import { ExamSearchProvider } from '@/contexts/ExamSearchContext'

const CreateExamSchedule = () => {
    return (
        <ExamSearchProvider>

        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">পরীক্ষার শিডিউল তৈরি করুন</h1>
                <p className="text-gray-500">নতুন পরীক্ষার শিডিউল তৈরি করুন</p>
            </div>
            <ExamScheduleForm />
        </div>
        </ExamSearchProvider>
    )
}

export default CreateExamSchedule