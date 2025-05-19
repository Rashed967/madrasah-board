export type MadrasahType = 'boys' | 'girls' | 'both';
export type ExamType = 'darsiyat' | 'hifz' | 'both';

export interface PDFOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface PDFGeneratorConfig {
  id: string;
  component: React.ComponentType<any>;
  requiredFields: string[];
}

export interface PDFFormData {
  examId?: string;
  zones?: string[];
  districts?: string[];
  madrasahType?: MadrasahType;
  examType?: ExamType;
  [key: string]: any;
} 