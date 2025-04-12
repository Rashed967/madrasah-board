import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Demo data for the table
const demoData = [
  {
    id: 1,
    madrasah: 'আল-জামিয়াতুল আহলিয়া দারুল উলূম মুঈনুল ইসলাম হাটহাজারী',
    examineeCount: 120,
    remainingCount: 15,
  },
  {
    id: 2,
    madrasah: 'জামিয়া ইসলামিয়া দারুল উলূম দেওভান্দ',
    examineeCount: 85,
    remainingCount: 5,
  },
  {
    id: 3,
    madrasah: 'জামিয়া ইসলামিয়া দারুল উলূম মাদানীনগর',
    examineeCount: 95,
    remainingCount: 10,
  },
];

const ExamineeRegistrationTable = () => {
  return (
    <div className="rounded-md border mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">মাদ্রাসা</TableHead>
            <TableHead className="text-center">পরীক্ষার্থী সংখ্যা</TableHead>
            <TableHead className="text-center">নিবন্ধন বাকী</TableHead>
            <TableHead className="text-center w-[120px]">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.madrasah}</TableCell>
              <TableCell className="text-center">{item.examineeCount}</TableCell>
              <TableCell className="text-center">{item.remainingCount}</TableCell>
              <TableCell className="text-center">
                <Button 
                  size="sm" 
                  className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                >
                  সাবমিট
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamineeRegistrationTable; 