import { PDFOption } from '@/types/pdfGenerator.types';

export const pdfOptions: PDFOption[] = [
  {
    id: 'madrasah-list',
    title: 'পরীক্ষাথীর রোলের লিস্ট',
    description: 'পরীক্ষাথীর রোলের লিস্টের পিডিএফ তৈরি করুন',
    icon: 'FileText',
    color: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    id: 'examinee-list',
    title: 'পরীক্ষার্থী লিস্ট',
    description: 'পরীক্ষার্থীদের তালিকা পিডিএফ তৈরি করুন',
    icon: 'Users',
    color: 'bg-green-50 hover:bg-green-100'
  },
  {
    id: 'kitab-list',
    title: 'কিতাব লিস্ট',
    description: 'কিতাবের তালিকা পিডিএফ তৈরি করুন',
    icon: 'BookOpen',
    color: 'bg-purple-50 hover:bg-purple-100'
  },
  {
    id: 'admit-card-persoanl',
    title: 'প্রবেশপত্র তৈরী (ব্যক্তিগত)',
    description: 'ব্যক্তিগত প্রবেশপত্র তৈরি করুন',
    icon: 'FileBadge2',
    color: 'bg-yellow-50 hover:bg-yellow-100'
  },
  {
    id: 'admit-card-madrasah',
    title: 'প্রবেশপত্র তৈরী (মাদ্রাসাওয়ারী)',
    description: 'মাদ্রাসাওয়ারী প্রবেশপত্র তৈরি করুন',
    icon: 'School',
    color: 'bg-red-50 hover:bg-red-100'
  },
  {
    id: 'markaz-list',
    title: 'মারকায লিস্ট',
    description: 'মারকাযের তালিকা পিডিএফ তৈরি করুন',
    icon: 'FileSpreadsheet',
    color: 'bg-indigo-50 hover:bg-indigo-100'
  },
  {
    id: 'pre-examinee-list',
    title: 'নিবন্ধিত পরীক্ষার্থী তালিকা',
    description: 'নিবন্ধিত পরীক্ষার্থী তালিকা পিডিএফ তৈরি করুন',
    icon: 'FileSpreadsheet',
    color: 'bg-indigo-50 hover:bg-indigo-100'
  }
]; 