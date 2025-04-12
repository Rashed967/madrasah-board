"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IoSearch } from 'react-icons/io5';

const ExamineeRegistrationPage = () => {
  return (
    <div className="container max-w-4xl mx-auto mt-8 px-4 text-gray-800">
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">
            নিবন্ধন ফরম
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Select Dropdown */}
              <div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="পরীক্ষা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">অপশন ১</SelectItem>
                    <SelectItem value="option2">অপশন ২</SelectItem>
                    <SelectItem value="option3">অপশন ৩</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input with Button */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="মাদ্রাসা খুঁজুন"
                  className="flex-1"
                />
                <Button
                  type="button"
                  className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
                >
                  <IoSearch className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ExamineeRegistrationPage;