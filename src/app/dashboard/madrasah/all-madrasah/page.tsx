'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { ChevronDown, Search, Printer, X } from "lucide-react";
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Pagination } from '@/components/ui/pagination';
import { MadrasahTable } from '@/components/madrasah/MadrasahTable';
import { getSubDistricts, getPoliceStations } from '@/services/locationService';
import { getAllMadrasahs } from '@/services/madrasahService';
import { Madrasah } from "@/types/madrasah";
import { marhalaTypes } from '@/constants/madrasahConstants';
import { generatePrintContent } from "@/utils/printUtils";
import { divisions, Division, District } from '@/data/divisions';

const ITEMS_PER_PAGE = 10;

export default function AllMadrasah() {
  const router = useRouter();
  const [madrasahs, setMadrasahs] = useState<Madrasah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState<Division | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | 'all'>('all');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string | null>(null);
  const [selectedPoliceStation, setSelectedPoliceStation] = useState<string | null>(null);
  const [selectedMadrasahType, setSelectedMadrasahType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printType, setPrintType] = useState<'list' | 'addresses'>('list');
  const [printContent, setPrintContent] = useState('');

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableSubDistricts, setAvailableSubDistricts] = useState<string[]>([]);
  const [availablePoliceStations, setAvailablePoliceStations] = useState<string[]>([]);

  const fetchMadrasahs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMadrasahs();
      
      // Filter madrasahs based on selected filters
      let filteredMadrasahs = response.data;

      if (selectedDivision && selectedDivision !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => m.address.division === selectedDivision
        );
      }

      if (selectedDistrict && selectedDistrict !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => m.address.district === selectedDistrict
        );
      }

      if (selectedSubDistrict && selectedSubDistrict !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => m.address.subDistrict === selectedSubDistrict
        );
      }

      if (selectedPoliceStation && selectedPoliceStation !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => m.address.policeStation === selectedPoliceStation
        );
      }

      if (selectedMadrasahType && selectedMadrasahType !== 'all') {
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) => m.madrasah_information.madrasahType === selectedMadrasahType
        );
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredMadrasahs = filteredMadrasahs.filter(
          (m) =>
            m.madrasahNames.bengaliName.toLowerCase().includes(query) ||
            m.code.toLowerCase().includes(query)
        );
      }

      setMadrasahs(filteredMadrasahs);
      setTotalPages(Math.ceil(filteredMadrasahs.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to fetch madrasahs');
      console.error('Error fetching madrasahs:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDivision, selectedDistrict, selectedSubDistrict, selectedPoliceStation, selectedMadrasahType, searchQuery]);

  // Initial fetch on mount
  useEffect(() => {
    fetchMadrasahs();
  }, [fetchMadrasahs]);

  // Update districts when division changes
  useEffect(() => {
    if (selectedDivision && selectedDivision !== "all") {
      setAvailableDistricts(Object.keys(divisions[selectedDivision]));
      setSelectedDistrict("all");
      setSelectedSubDistrict("all");
      setSelectedPoliceStation("all");
    } else {
      setAvailableDistricts([]);
    }
  }, [selectedDivision]);

  // Update subdistricts when district changes
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "all") {
      setAvailableSubDistricts(getSubDistricts(selectedDistrict));
      setSelectedSubDistrict("all");
      setSelectedPoliceStation("all");
    } else {
      setAvailableSubDistricts([]);
    }
  }, [selectedDistrict]);

  // Update police stations when subdistrict changes
  useEffect(() => {
    if (selectedDistrict && selectedSubDistrict && selectedSubDistrict !== "all") {
      setAvailablePoliceStations(getPoliceStations(selectedDistrict, selectedSubDistrict));
      setSelectedPoliceStation("all");
    } else {
      setAvailablePoliceStations([]);
    }
  }, [selectedDistrict, selectedSubDistrict]);

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি এই মাদরাসাটি মুছে ফেলতে চান?")) {
      try {
        // Implement delete functionality
        toast.success("মাদরাসা সফলভাবে মুছে ফেলা হয়েছে");
        fetchMadrasahs();
      } catch (error) {
        toast.error("মাদরাসা মুছে ফেলতে সমস্যা হয়েছে");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrint = useCallback((type: 'list' | 'addresses') => {
    console.log('Madrasahs data for print:', madrasahs);
    setPrintType(type);
    setPrintContent(generatePrintContent(madrasahs, type));
    setShowPrintPreview(true);
  }, [madrasahs]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={fetchMadrasahs}
          className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  return (
    <>
      {!showPrintPreview ? (
        <div className="container mx-auto px-4 py-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">মাদরাসা তালিকা</h1>
              <p className="text-sm text-gray-600">সকল নিবন্ধিত মাদরাসার তালিকা</p>
            </div>
            <div className="flex gap-2">

              {/* new buttons  */}
              <Button
                onClick={() => handlePrint('list')}
                variant="outline"
                className="flex items-center gap-2 text-sm border border-gray-300 hover:bg-gray-50"
              >
                <Printer className="h-4 w-4" />
                মাদরাসার তালিকা প্রিন্ট
              </Button>
              <Button
                onClick={() => handlePrint('addresses')}
                variant="outline"
                className="flex items-center gap-2 text-sm border border-gray-300 hover:bg-gray-50"
              >
                <Printer className="h-4 w-4" />
                ঠিকানা প্রিন্ট
              </Button>

            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-4 mb-4">
            <div className="grid grid-cols-6 gap-4">
              <div>
                <Label className="flex items-center gap-1 text-sm mb-2">
                  <span className="text-gray-600">বিভাগ</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </Label>
                <Select
                  value={selectedDivision}
                  onValueChange={(value) => setSelectedDivision(value as Division | 'all')}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="সকল বিভাগ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সকল বিভাগ</SelectItem>
                    {Object.keys(divisions).map((division) => (
                      <SelectItem key={division} value={division}>
                        {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-1 text-sm mb-2">
                  <span className="text-gray-600">জেলা</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </Label>
                <Select
                  value={selectedDistrict}
                  onValueChange={(value) => setSelectedDistrict(value as District | 'all')}
                  disabled={!selectedDivision || selectedDivision === 'all'}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="সকল জেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সকল জেলা</SelectItem>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-1 text-sm mb-2">
                  <span className="text-gray-600">উপজেলা</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </Label>
                <Select
                  value={selectedSubDistrict || undefined}
                  onValueChange={setSelectedSubDistrict}
                  disabled={!selectedDistrict}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="সকল উপজেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সকল উপজেলা</SelectItem>
                    {availableSubDistricts.map((subDistrict) => (
                      <SelectItem key={subDistrict} value={subDistrict}>
                        {subDistrict}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-1 text-sm mb-2">
                  <span className="text-gray-600">থানা</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </Label>
                <Select
                  value={selectedPoliceStation || undefined}
                  onValueChange={setSelectedPoliceStation}
                  disabled={!selectedSubDistrict}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="সকল থানা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সকল থানা</SelectItem>
                    {availablePoliceStations.map((station) => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-1 text-sm mb-2">
                  <span className="text-gray-600">মাদরাসার ধরণ</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </Label>
                <Select
                  value={selectedMadrasahType || undefined}
                  onValueChange={setSelectedMadrasahType}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="সকল ধরণ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সকল ধরণ</SelectItem>
                    <SelectItem value="BOY">বালক</SelectItem>
                    <SelectItem value="GIRL">বালিকা</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-1 text-sm mb-2">
                  <span className="text-gray-600">অনুসন্ধান</span>
                  <Search className="h-3 w-3 text-gray-400" />
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="মাদরাসার খুঁজুন"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-white border-gray-200 focus:ring-0 focus:ring-offset-0"
                  />
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <MadrasahTable madrasahs={madrasahs} onDelete={handleDelete} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <Card className="w-10/12 p-4 mx-auto mt-8">
          <div className="flex justify-end">
            <div className="flex gap-2 mb-6 no-print">
              <Button 
                variant="outline" 
                className="text-red-600 border-red-500 hover:bg-red-50"
                onClick={() => setShowPrintPreview(false)}
              >
                <X className="w-4 h-4 mr-2" />
                বন্ধ করুন
              </Button>
              <Button 
                variant="outline" 
                className="text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                প্রিন্ট করুন
              </Button>
            </div>
          </div>
          <div 
            className="print-preview-content"
            dangerouslySetInnerHTML={{ __html: printContent }}
          />
        </Card>
      )}
    </>
  );
}
