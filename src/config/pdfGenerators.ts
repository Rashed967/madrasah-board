import { PDFGeneratorConfig } from '@/types/pdf';
import { MadrasahListForm } from '@/components/pdf/forms/MadrasahListForm';

export const pdfGenerators: Record<string, PDFGeneratorConfig> = {
  'madrasah-list': {
    id: 'madrasah-list',
    component: MadrasahListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  },
  'examinee-list': {
    id: 'examinee-list',
    component: MadrasahListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  },
  'kitab-list': {
    id: 'kitab-list',
    component: MadrasahListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  },
  'result-list': {
    id: 'result-list',
    component: MadrasahListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  },
  'teacher-list': {
    id: 'teacher-list',
    component: MadrasahListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  },
  'markaz-list': {
    id: 'markaz-list',
    component: MadrasahListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  },
  'pre-examinee-list': {
    id: 'pre-examinee-list',
    component: MadrasahListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  }
}; 