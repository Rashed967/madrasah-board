'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdEdit, MdDelete, MdSearch, MdPrint, MdClose } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { divisions, districts, subDistricts, policeStations } from '@/app/dashboard/madrasah/register-madrasah/locationData';
import AddressCardsPrint from '@/components/madrasah/AddressCardsPrint';
import MadrasahListPrint from '@/components/madrasah/MadrasahListPrint';

const ITEMS_PER_PAGE = 10;

interface Madrasah {
  id: number;
  code: string;
  name: string;
  village: string;
  policeStation: string;
  district: string;
  highestMarhala: string;
  muhtamimName: string;
  type: string;
  email: string;
  mobile: string;
}

const madrasahTypes = [
  { value: "বালক", label: "বালক" },
  { value: "বালিকা", label: "বালিকা" },
];

const marhalaTypes = [
  { value: "", label: "মারহালা নির্বাচন করুন" },
  { value: "ইফতা", label: "ইফতা" },
  { value: "তাকমীল", label: "তাকমীল/দাওরায়ে হাদীস" },
  { value: "ফযীলত", label: "ফযীলত (স্নাতক)" },
  { value: "সানাবিয়্যাহ_উলইয়া", label: "সানাবিয়্যাহ উলইয়া" },
  { value: "কাফিয়া", label: "কাফিয়া (১০ শ্রেনী)" },
  { value: "মুতাওয়াসসিতাহ", label: "মুতাওয়াসসিতাহ (৮ম শ্রেনী)" },
  { value: "ইবতেদাইয়্যাহ", label: "ইবতেদাইয়্যাহ (৫ম শ্রেনী)" }
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
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  const [showListPrint, setShowListPrint] = useState(false);

  const router = useRouter();

  const handlePrintAddressCards = () => {
    setShowPrintComponent(true);
  };

  const handleClosePrint = () => {
    setShowPrintComponent(false);
  };

  const handlePrintList = () => {
    setShowListPrint(true);
  };

  const handleCloseListPrint = () => {
    setShowListPrint(false);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
    toast.success('Delete clicked for ID: ' + id);
  };

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData = [
      {
        "id": 1,
        "code": "354193",
        "name": "আল মারকাযুল ইসলামী ",
        "village": "হোয়াইক্যং",
        "policeStation": "টেকনাফ",
        "district": "রাজশাহী",
        "highestMarhala": "হাদিস",
        "muhtamimName": "মাওলানা মোহাম্মদ শফি",
        "type": "বালিকা",
        "email": "madrasa.edu@madrasa.edu.",
        "mobile": "13136995962"
      },
      {
        "id": 2,
        "code": "907760",
        "name": "আল জামিয়াতুল আরাবি",
        "village": "রামু",
        "policeStation": "কক্সবাজার সদর",
        "district": "চট্টগ্রাম",
        "highestMarhala": "আলিম",
        "muhtamimName": "মাওলানা মোহাম্মদ ইউসুফ",
        "type": "বালক",
        "email": "asa.edu.@madrasa.edu",
        "mobile": "36370550087"
      },
      {
        "id": 3,
        "code": "782755",
        "name": "দারুল উলুম মাদরাসা",
        "village": "হোয়াইক্যং",
        "policeStation": "পেকুয়া",
        "district": "সিলেট",
        "highestMarhala": "দাখিল",
        "muhtamimName": "মাওলানা মুফতি মোহাম্মদ",
        "type": "বালক",
        "email": "madrasa.edu.@madrasa.edu.",
        "mobile": "16072978162"
      },
      {
        "id": 4,
        "code": "682164",
        "name": "নূরানী মাদরাসা",
        "village": "উত্তর টেকনাফ",
        "policeStation": "টেকনাফ",
        "district": "সিলেট",
        "highestMarhala": "দাখিল",
        "muhtamimName": "মাওলানা মোহাম্মদ শফি",
        "type": "বালিকা",
        "email": "@madrasa.edu.",
        "mobile": "40473781432"
      },
      {
        "id": 5,
        "code": "522681",
        "name": "গাউছিয়া মাদরাসা",
        "village": "নাইক্ষ্যংছড়ি",
        "policeStation": "কুতুবদিয়া",
        "district": "কক্সবাজার",
        "highestMarhala": "হাদিস",
        "muhtamimName": "মাওলানা জালাল উদ্দিন",
        "type": "বালিকা",
        "email": "@madrasa.edu.",
        "mobile": "28952155528"
      },
      {
        "id": 6,
        "code": "204061",
        "name": "আল জামিয়াতুল আরাবি",
        "village": "কুতুবদিয়া",
        "policeStation": "পেকুয়া",
        "district": "কুমিল্লা",
        "highestMarhala": "তাখাসসুস",
        "muhtamimName": "মাওলানা আব্দুল হালিম",
        "type": "বালিকা",
        "email": "@madrasa.edu.@madrasa.edu",
        "mobile": "50873322141"
      },
      {
        "id": 7,
        "code": "313444",
        "name": "আল ইমদাদিয়া মাদরাসা",
        "village": "সদর",
        "policeStation": "পেকুয়া",
        "district": "সিলেট",
        "highestMarhala": "ইফতা",
        "muhtamimName": "মাওলানা মোহাম্মদ ইউসুফ",
        "type": "বালিকা",
        "email": "@madrasa.edu.@madrasa.edu",
        "mobile": "72469721698"
      },
      {
        "id": 8,
        "code": "826833",
        "name": "আল জামিয়াতুল আরাবি",
        "village": "রামু",
        "policeStation": "মহেশখালী",
        "district": "বরিশাল",
        "highestMarhala": "মুতাওয়াসসিতাহ",
        "muhtamimName": "মাওলানা আতাউর রহমান",
        "type": "বালিকা",
        "email": "@madrasa.edu.@madrasa.edu",
        "mobile": "29639734594"
      },
      {
        "id": 9,
        "code": "637509",
        "name": "আল জামিয়াতুল আরাবি",
        "village": "চকরিয়া",
        "policeStation": "উজিরপুর",
        "district": "চট্টগ্রাম",
        "highestMarhala": "হিফজ",
        "muhtamimName": "মাওলানা জালাল উদ্দিন",
        "type": "বালিকা",
        "email": "@madrasa.edu.@madrasa.edu",
        "mobile": "36768383957"
      },
      {
        "id": 10,
        "code": "353863",
        "name": "রহমানিয়া মাদরাসা",
        "village": "হোয়াইক্যং",
        "policeStation": "রামু",
        "district": "কুমিল্লা",
        "highestMarhala": "দাখিল",
        "muhtamimName": "মাওলানা আব্দুল হালিম",
        "type": "বালিকা",
        "email": "@madrasa.edu",
        "mobile": "22081848520"
      }
    ]
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
      result = result.filter(m => m.district.includes(filters.division));
    }

    if (filters.district) {
      result = result.filter(m => m.district.includes(filters.district));
    }

    if (filters.upazila) {
      result = result.filter(m => m.policeStation.includes(filters.upazila));
    }

    if (filters.policeStation) {
      result = result.filter(m => m.policeStation.includes(filters.policeStation));
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Regular View */}
      <div className={`${showPrintComponent || showListPrint ? 'hidden' : ''}`}>
        {/* Header Section */}
        <div className="w-[90%] mx-auto mb-6 mt-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">মাদরাসা তালিকা</h2>
              <p className="text-gray-500">সকল নিবন্ধিত মাদরাসার তালিকা</p>
            </div>
            <div className="flex gap-2 relative">
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 bg-white hover:bg-emerald-50"
                onClick={handlePrintList}
              >
                <MdPrint className="mr-2 h-4 w-4" />
                মাদ্রাসার তালিকা প্রিন্ট
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePrintAddressCards}
                  size="sm"
                  className="h-8 bg-white hover:bg-emerald-50 border border-emerald-500 text-emerald-600"
                >
                  <MdPrint className="mr-2 h-4 w-4" />
                  ঠিকানা প্রিন্ট
                </Button>
              </div>
            </div>
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
                    <th className="px-6 py-3 text-left">কোড</th>
                    <th className="px-6 py-3 text-left">মাদরাসার নাম</th>
                    <th className="px-6 py-3 text-left">ঠিকানা</th>
                    <th className="px-6 py-3 text-left">সর্বোচ্চ মারহালা</th>
                    <th className="px-6 py-3 text-left">মুহতামিম</th>
                    <th className="px-6 py-3 text-left">মাদরাসার ধরণ</th>
                    <th className="px-6 py-3 text-left">ইমেইল</th>
                    <th className="px-6 py-3 text-left">মোবাইল</th>
                    <th className="px-6 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMadrasahs.map((madrasah) => (
                    <tr key={madrasah.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">{madrasah.code}</td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/dashboard/madrasah/${madrasah.id}`}
                          className="text-[#52b788] hover:text-[#52b788]/80 hover:underline"
                        >
                          {madrasah.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {[
                          madrasah.village,
                          madrasah.policeStation,
                          madrasah.district
                        ].filter(Boolean).join(', ')}
                      </td>
                      <td className="px-6 py-4">
                        {marhalaTypes.find(m => m.value === madrasah.highestMarhala)?.label || madrasah.highestMarhala}
                      </td>
                      <td className="px-6 py-4">{madrasah.muhtamimName}</td>
                      <td className="px-6 py-4">{madrasah.type}</td>
                      <td className="px-6 py-4">{madrasah.email}</td>
                      <td className="px-6 py-4">{madrasah.mobile}</td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-7 w-7 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center justify-center p-0"
                            >
                              <BsThreeDots className="h-4 w-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="w-40 bg-white shadow-lg border border-gray-100 rounded-md p-1"
                            sideOffset={5}
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/madrasah/${madrasah.id}/edit`}
                                className="flex items-center px-3 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-600 rounded-md cursor-pointer transition-colors"
                              >
                                <MdEdit className="h-4 w-4 mr-2" />
                                <span>সম্পাদনা</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(madrasah.id)}
                              className="flex items-center px-3 py-2 text-sm hover:bg-red-50 hover:text-red-600 rounded-md cursor-pointer transition-colors mt-1"
                            >
                              <MdDelete className="h-4 w-4 mr-2" />
                              <span>মুছে ফেলুন</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                className="bg-white hover:bg-emerald-50 border-emerald-500 text-emerald-600 text-sm disabled:opacity-50"
              >
                পূর্ববর্তী
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => 
                  Math.min(Math.ceil(filteredMadrasahs.length / ITEMS_PER_PAGE), prev + 1)
                )}
                disabled={currentPage === Math.ceil(filteredMadrasahs.length / ITEMS_PER_PAGE)}
                className="bg-white hover:bg-emerald-50 border-emerald-500 text-emerald-600 text-sm disabled:opacity-50"
              >
                পরবর্তী
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Views */}
      {showPrintComponent && (
        <div className="print-content">
          <div className="no-print mb-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '0 10mm' }}>
            <Button
              onClick={handleClosePrint}
              size="sm"
              className="h-8 bg-white hover:bg-red-50 border border-red-500 text-red-600"
            >
              <MdClose className="mr-2 h-4 w-4" />
              বন্ধ করুন
            </Button>
            <Button
              onClick={() => window.print()}
              size="sm"
              className="h-8 bg-white hover:bg-emerald-50 border border-emerald-500 text-emerald-600"
            >
              <MdPrint className="mr-2 h-4 w-4" />
              প্রিন্ট করুন
            </Button>
          </div>
          <AddressCardsPrint madrasahs={filteredMadrasahs} />
        </div>
      )}

      {showListPrint && (
        <div className="print-content">
          <div className="no-print mb-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '0 10mm' }}>
            <Button
              onClick={handleCloseListPrint}
              size="sm"
              className="h-8 bg-white hover:bg-red-50 border border-red-500 text-red-600"
            >
              <MdClose className="mr-2 h-4 w-4" />
              বন্ধ করুন
            </Button>
            <Button
              onClick={() => window.print()}
              size="sm"
              className="h-8 bg-white hover:bg-emerald-50 border border-emerald-500 text-emerald-600"
            >
              <MdPrint className="mr-2 h-4 w-4" />
              প্রিন্ট করুন
            </Button>
          </div>
          <MadrasahListPrint madrasahs={filteredMadrasahs} />
        </div>
      )}
    </div>
  );
}
