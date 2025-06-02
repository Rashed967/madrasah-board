import { PDFGeneratorConfig } from '@/types/pdfGenerator.types';
import { MarkazListForm } from '@/components/pdf/forms/MarkazListForm';
import { PlaceholderForm } from '@/components/pdf/forms/PlaceholderForm';
import AdmitCardForm from '@/components/pre-examinee/AdmitCardForm';

export const pdfGenerators: Record<string, PDFGeneratorConfig> = {
  'madrasah-list': {
    id: 'madrasah-list',
    component: PlaceholderForm,
    requiredFields: []
  },
  'examinee-list': {
    id: 'examinee-list',
    component: PlaceholderForm,
    requiredFields: []
  },
  'kitab-list': {
    id: 'kitab-list',
    component: PlaceholderForm,
    requiredFields: []
  },
  'admit-card-persoanl': {
    id: 'admid-card-persoanl',
    component: AdmitCardForm,
    requiredFields: []
  },
  'teacher-list': {
    id: 'teacher-list',
    component: PlaceholderForm,
    requiredFields: []
  },
  'markaz-list': {
    id: 'markaz-list',
    component: MarkazListForm,
    requiredFields: ['examId', 'zones', 'districts', 'madrasahType', 'examType']
  },
  'pre-examinee-list': {
    id: 'pre-examinee-list',
    component: PlaceholderForm,
    requiredFields: []
  }
}; 