'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { MdEdit, MdDelete, MdSearch, MdPrint } from 'react-icons/md';
import toast from 'react-hot-toast';
import { divisions, districts, upazilas, policeStations } from '@/app/dashboard/madrasah/register-madrasah/locationData';

const ITEMS_PER_PAGE = 10;

interface Madrasah {
  id: number;
  name: string;
  address: string;
  type: string;
  email: string;
  mobile: string;
}

const madrasahTypes = [
  { value: "বালক", label: "বালক" },
  { value: "বালিকা", label: "বালিকা" },
];

// Mock location data (replace with actual data)
const mockLocations = {
  divisions: ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'],
  districts: {
    'ঢাকা': ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল'],
    'চট্টগ্রাম': ['চট্টগ্রাম', 'কক্সবাজার', 'রাঙ্গামাটি', 'খাগড়াছড়ি'],
    // Add more districts
  },
  upazilas: {
    'ঢাকা': ['সাভার', 'ধামরাই', 'দোহার', 'নবাবগঞ্জ'],
    'গাজীপুর': ['গাজীপুর সদর', 'কালীগঞ্জ', 'কাপাসিয়া'],
    // Add more upazilas
  },
  policeStations: {
    'সাভার': ['সাভার মডেল', 'আশুলিয়া', 'ধামরাই'],
    'গাজীপুর সদর': ['জয়দেবপুর', 'টঙ্গী', 'বাসন'],
    // Add more police stations
  }
};

export default function AllMadrasah() {
  const [madrasahs, setMadrasahs] = useState<Madrasah[]>([]);
  const [filteredMadrasahs, setFilteredMadrasahs] = useState<Madrasah[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    division: '',
    district: '',
    upazila: '',
    policeStation: '',
    type: ''
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: 'দারুল উলূম মাদরাসা',
        address: 'নালিতাবাড়ী, মুক্তাগাছা, ময়মনসিংহ',
        type: 'বালক',
        email: 'info@darululoom.edu.bd',
        mobile: '01522584728'
      },
      {
        id: 2,
        name: 'আল-আমিন মাদরাসা',
        address: 'পাইকপাড়া, মিরপুর, ঢাকা',
        type: 'বালক',
        email: 'contact@alameen.edu.bd',
        mobile: '01812345678'
      },
      {
        id: 3,
        name: 'নূরুল ইসলাম মাদরাসা',
        address: 'টেকনাফ, কক্সবাজার',
        type: 'বালিকা',
        email: 'info@nurulislam.edu.bd',
        mobile: '01912345678'
      },
      {
        id: 4,
        name: 'রহমানিয়া দারুল উলূম মাদরাসা',
        address: 'মুক্তাগাছা, ময়মনসিংহ',
        type: 'বালক',
        email: 'admin@rahmania.edu.bd',
        mobile: '01854621098'
      },
      {
        id: 5,
        name: 'দারুল ফালাহ ইসলামিক একাডেমি',
        address: 'পূর্বী, চট্টগ্রাম',
        type: 'বালিকা',
        email: 'info@darulfalah.edu.bd',
        mobile: '01885754621'
      },
      {
        id: 6,
        name: 'জামিয়া ইসলামিয়া মাদরাসা',
        address: 'কুমিল্লা সদর, কুমিল্লা',
        type: 'বালক',
        email: 'contact@jamia.edu.bd',
        mobile: '01712345678'
      },
      {
        id: 7,
        name: 'মদিনাতুল উলূম মহিলা মাদরাসা',
        address: 'গাজীপুর সদর, গাজীপুর',
        type: 'বালিকা',
        email: 'info@madinatul.edu.bd',
        mobile: '01612345678'
      },
      {
        id: 8,
        name: 'বায়তুল মুকাররম মাদরাসা',
        address: 'সিলেট সদর, সিলেট',
        type: 'বালক',
        email: 'contact@baitul.edu.bd',
        mobile: '01754621098'
      }
    ];
    setMadrasahs(mockData);
    setFilteredMadrasahs(mockData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = madrasahs;

    if (searchTerm) {
      result = result.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.division) {
      result = result.filter(m => m.address.includes(filters.division));
    }

    if (filters.district) {
      result = result.filter(m => m.address.includes(filters.district));
    }

    if (filters.upazila) {
      result = result.filter(m => m.address.includes(filters.upazila));
    }

    if (filters.policeStation) {
      result = result.filter(m => m.address.includes(filters.policeStation));
    }

    if (filters.type) {
      result = result.filter(m => m.type === filters.type);
    }

    setFilteredMadrasahs(result);
    setCurrentPage(1);
  }, [searchTerm, filters, madrasahs]);

  // Pagination
  const totalPages = Math.ceil(filteredMadrasahs.length / ITEMS_PER_PAGE);
  const paginatedMadrasahs = filteredMadrasahs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id: number) => {
    // Implement edit functionality
    toast.success('Edit clicked for ID: ' + id);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
    toast.success('Delete clicked for ID: ' + id);
  };

  return (
    <div className="mt-12">
      {/* Header Section */}
      <div className="w-[90%] mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">মাদরাসা তালিকা</h2>
            <p className="text-gray-500">সকল নিবন্ধিত মাদরাসার তালিকা</p>
          </div>
          <Button 
            variant="default" 
            className="bg-[#00897B] hover:bg-[#00796B] text-white"
            onClick={() => window.print()}
          >
            <MdPrint className="h-4 w-4 mr-2" />
            <span className="text-sm">প্রিন্ট করুন</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="w-[90%] mx-auto space-y-4">
        <div className="grid grid-cols-6 gap-2 bg-white p-4 rounded-lg">
          <div className="relative">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <span>⌄</span> বিভাগ
            </div>
            <Select
              value={filters.division}
              onValueChange={(value) => setFilters(prev => ({ ...prev, division: value, district: '', upazila: '', policeStation: '' }))}
            >
              <SelectTrigger className="w-full bg-white border rounded-md h-10">
                <SelectValue placeholder="সকল বিভাগ" />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.divisions.map(div => (
                  <SelectItem key={div} value={div}>{div}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <span>⌄</span> জেলা
            </div>
            <Select
              value={filters.district}
              onValueChange={(value) => setFilters(prev => ({ ...prev, district: value, upazila: '', policeStation: '' }))}
              disabled={!filters.division}
            >
              <SelectTrigger className="w-full bg-white border rounded-md h-10">
                <SelectValue placeholder="সকল জেলা" />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.districts[filters.division]?.map(dist => (
                  <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <span>⌄</span> উপজেলা
            </div>
            <Select
              value={filters.upazila}
              onValueChange={(value) => setFilters(prev => ({ ...prev, upazila: value, policeStation: '' }))}
              disabled={!filters.district}
            >
              <SelectTrigger className="w-full bg-white border rounded-md h-10">
                <SelectValue placeholder="সকল উপজেলা" />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.upazilas[filters.district]?.map(upazila => (
                  <SelectItem key={upazila} value={upazila}>{upazila}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <span>⌄</span> থানা
            </div>
            <Select
              value={filters.policeStation}
              onValueChange={(value) => setFilters(prev => ({ ...prev, policeStation: value }))}
              disabled={!filters.upazila}
            >
              <SelectTrigger className="w-full bg-white border rounded-md h-10">
                <SelectValue placeholder="সকল থানা" />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.policeStations[filters.upazila]?.map(ps => (
                  <SelectItem key={ps} value={ps}>{ps}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <span>⌄</span> মাদরাসার ধরণ
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-full bg-white border rounded-md h-10">
                <SelectValue placeholder="সকল ধরণ" />
              </SelectTrigger>
              <SelectContent>
                {madrasahTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <span>🔍</span> মাদরাসার নাম
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="মাদরাসার খুঁজুন"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10"
              />
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-500 text-white">
                  <th className="px-6 py-3 text-left">মাদরাসার নাম</th>
                  <th className="px-6 py-3 text-left">ঠিকানা</th>
                  <th className="px-6 py-3 text-left">মাদরাসার ধরণ</th>
                  <th className="px-6 py-3 text-left">ইমেইল</th>
                  <th className="px-6 py-3 text-left">মোবাইল</th>
                  <th className="px-6 py-3 text-right">ক্রিয়াকলাপ</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMadrasahs.map((madrasah) => (
                  <tr key={madrasah.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">{madrasah.name}</td>
                    <td className="px-6 py-4">{madrasah.address}</td>
                    <td className="px-6 py-4">{madrasah.type}</td>
                    <td className="px-6 py-4">{madrasah.email}</td>
                    <td className="px-6 py-4">{madrasah.mobile}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(madrasah.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <MdEdit className="h-4 w-4 mr-1" />
                        <span className="text-xs">সম্পাদনা</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(madrasah.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <MdDelete className="h-4 w-4 mr-1" />
                        <span className="text-xs">মুছে ফেলুন</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <div>
            মোট মাদরাসা: {filteredMadrasahs.length} / {madrasahs.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-gray-50 hover:bg-gray-100 text-sm"
            >
              পূর্ববর্তী
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => 
                Math.min(Math.ceil(filteredMadrasahs.length / ITEMS_PER_PAGE), prev + 1)
              )}
              disabled={currentPage === Math.ceil(filteredMadrasahs.length / ITEMS_PER_PAGE)}
              className="bg-gray-50 hover:bg-gray-100 text-sm"
            >
              পরবর্তী
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
