"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Exam {
  _id: string;
  examName: string;
  [key: string]: any;
}

interface ExamSearchContextType {
  selectedExam: Exam | null;
  setSelectedExam: (exam: Exam | null) => void;
}

const ExamSearchContext = createContext<ExamSearchContextType | undefined>(undefined);

interface ExamSearchProviderProps {
  children: ReactNode;
}

export const ExamSearchProvider: React.FC<ExamSearchProviderProps> = ({ children }) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const value = {
    selectedExam,
    setSelectedExam,
  };

  return (
    <ExamSearchContext.Provider value={value}>
      {children}
    </ExamSearchContext.Provider>
  );
};

export const useExam = (): ExamSearchContextType => {
  const context = useContext(ExamSearchContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamSearchProvider');
  }
  return context;
};