'use client';

import { useState, useMemo } from 'react';
import { MdEdit, MdDelete, MdAdd, MdSearch, MdFilterList, MdLocationCity } from 'react-icons/md';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Dialog } from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Dummy data - replace with actual API call
const markazList = [
  { id: 1, name: 'লালবাগ মারকায', address: 'লালবাগ, ঢাকা' },
  { id: 2, name: 'মিরপুর মারকায', address: 'মিরপুর-১০, ঢাকা' },
  { id: 3, name: 'উত্তরা মারকায', address: 'উত্তরা, ঢাকা' },
  { id: 4, name: 'চট্টগ্রাম মারকায', address: 'নাসিরাবাদ, চট্টগ্রাম' },
  { id: 5, name: 'কক্সবাজার মারকায', address: 'কক্সবাজার সদর' },
];

const initialZones = [
  {
    id: 1,
    code: 'MZ0001',
    name: 'ঢাকা জোন',
    districts: ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ'],
    markaz: [1, 2, 3], // markaz IDs
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    code: 'MZ0002',
    name: 'চট্টগ্রাম জোন',
    districts: ['চট্টগ্রাম', 'কক্সবাজার', 'রাঙ্গামাটি'],
    markaz: [4, 5], // markaz IDs
    createdAt: '2024-01-15'
  }
];

const districts = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
  'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'ফরিদপুর', 'কিশোরগঞ্জ'
];

export default function AllZones() {
  const [zones, setZones] = useState(initialZones);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedZoneDetails, setSelectedZoneDetails] = useState<any>(null);
  const zonesPerPage = 5;

  // Filtered zones based on search and filter
  const filteredZones = useMemo(() => {
    return zones.filter(zone => {
      const matchesSearch = 
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.districts.some(district => 
          district.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesZoneFilter = !selectedZone || selectedZone === 'all' || zone.name === selectedZone;
      
      return matchesSearch && matchesZoneFilter;
    });
  }, [zones, searchQuery, selectedZone]);

  // Paginated zones
  const paginatedZones = useMemo(() => {
    const startIndex = (currentPage - 1) * zonesPerPage;
    return filteredZones.slice(startIndex, startIndex + zonesPerPage);
  }, [filteredZones, currentPage]);

  // Total pages
  const totalPages = Math.ceil(filteredZones.length / zonesPerPage);

  // Unique zone names for filter
  const uniqueZoneNames = useMemo(() => 
    [...new Set(zones.map(zone => zone.name))],
    [zones]
  );

  const handleEditZone = (zone: any) => {
    setEditingZone({
      ...zone,
      newDistrict: ''
    });
    setShowEditModal(true);
  };

  const handleUpdateZone = () => {
    const updatedZones = zones.map(zone => 
      zone.id === editingZone.id ? {
        ...editingZone,
        newDistrict: undefined // Remove the temporary field
      } : zone
    );
    
    setZones(updatedZones);
    setShowEditModal(false);
    toast.success('জোন সফলভাবে আপডেট করা হয়েছে');
  };

  const handleDeleteClick = (zone: any) => {
    setZoneToDelete(zone);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setZones(zones.filter(zone => zone.id !== zoneToDelete.id));
    setShowDeleteDialog(false);
    toast.success('জোন সফলভাবে মুছে ফেলা হয়েছে');
  };

  const handleViewDetails = (zone: any) => {
    setSelectedZoneDetails(zone);
    setShowDetailsModal(true);
  };

  const handleAddDistrict = () => {
    if (!editingZone.newDistrict) return;
    
    setEditingZone({
      ...editingZone,
      districts: [...editingZone.districts, editingZone.newDistrict],
      newDistrict: ''
    });
  };

  const handleRemoveDistrict = (districtToRemove: string) => {
    setEditingZone({
      ...editingZone,
      districts: editingZone.districts.filter((district: string) => district !== districtToRemove)
    });
  };

  return (
    <div className="p-8 mt-12 mx-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">সকল জোন</h1>
        <Link 
          href="/dashboard/zone/add-zone"
          className="flex items-center gap-2 px-4 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#429670]"
        >
          <MdAdd className="w-5 h-5" />
          <span>নতুন জোন</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="জোন অথবা জেলার নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#52b788] focus:border-[#52b788]"
            />
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <div className="w-64">
          <Select value={selectedZone || undefined} onValueChange={setSelectedZone}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="জোন ফিল্টার করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল জোন</SelectItem>
              {uniqueZoneNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#52b788] text-white">
            <tr>
              <th className="px-4 py-3 text-left">জোন কোড</th>
              <th className="px-4 py-3 text-left">জোনের নাম</th>
              <th className="px-4 py-3 text-left">জেলাসমূহ</th>
              <th className="px-4 py-3 text-left">মারকাযসমূহ</th>
              <th className="px-4 py-3 text-left">তৈরির তারিখ</th>
              <th className="px-4 py-3 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedZones.map((zone) => (
              <tr key={zone.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{zone.code}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(zone)}
                    className="text-[#52b788] hover:underline font-medium"
                  >
                    {zone.name}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {zone.districts.map((district) => (
                      <span
                        key={district}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {district}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {zone.markaz.map((markazId) => {
                      const markaz = markazList.find(m => m.id === markazId);
                      return markaz ? (
                        <span
                          key={markaz.id}
                          className="px-2 py-1 bg-[#52b788]/10 text-[#52b788] text-sm rounded-full flex items-center gap-1"
                        >
                          <MdLocationCity className="w-4 h-4" />
                          {markaz.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">{zone.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEditZone(zone)}
                      className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="সম্পাদনা করুন"
                    >
                      <MdEdit className="w-5 h-5" />
                      <span className="text-sm">সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(zone)}
                      className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      title="মুছে ফেলুন"
                    >
                      <MdDelete className="w-5 h-5" />
                      <span className="text-sm">মুছুন</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            মোট জোন: {zones.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              পূর্ববর্তী
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              পরবর্তী
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="জোন সম্পাদনা করুন"
        onSubmit={handleUpdateZone}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              জোন কোড
            </label>
            <input
              type="text"
              value={editingZone?.code}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              জোনের নাম
            </label>
            <input
              type="text"
              value={editingZone?.name}
              onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#52b788] focus:border-[#52b788]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              জেলা যুক্ত করুন
            </label>
            <div className="flex gap-2">
              <Select
                value={editingZone?.newDistrict}
                onValueChange={(value) => setEditingZone({ ...editingZone, newDistrict: value })}
              >
                <SelectTrigger className="flex-1 bg-white">
                  <SelectValue placeholder="জেলা নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {districts
                    .filter(d => !editingZone?.districts.includes(d))
                    .map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <button
                onClick={handleAddDistrict}
                className="px-3 py-2 bg-[#52b788] text-white rounded-md hover:bg-[#429670]"
              >
                যুক্ত করুন
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              বর্তমান জেলাসমূহ
            </label>
            <div className="flex flex-wrap gap-2">
              {editingZone?.districts.map((district: string) => (
                <div
                  key={district}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full"
                >
                  <span>{district}</span>
                  <button
                    onClick={() => handleRemoveDistrict(district)}
                    className="p-1 hover:text-red-500"
                  >
                    <MdDelete className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              মারকায নির্বাচন করুন
            </label>
            <div className="space-y-2">
              {markazList.map((markaz) => (
                <label key={markaz.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingZone?.markaz.includes(markaz.id)}
                    onChange={(e) => {
                      const newMarkaz = e.target.checked
                        ? [...editingZone.markaz, markaz.id]
                        : editingZone.markaz.filter((id: number) => id !== markaz.id);
                      setEditingZone({ ...editingZone, markaz: newMarkaz });
                    }}
                    className="rounded border-gray-300 text-[#52b788] focus:ring-[#52b788]"
                  />
                  <span className="flex items-center gap-1">
                    <MdLocationCity className="text-[#52b788]" />
                    {markaz.name}
                  </span>
                  <span className="text-sm text-gray-500">- {markaz.address}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="জোন মুছে ফেলার নিশ্চিতকরণ"
        description={`আপনি কি নিশ্চিত যে আপনি "${zoneToDelete?.name}" জোনটি মুছে ফেলতে চান?`}
      />

      {/* View Details Modal */}
      <Dialog
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="জোনের বিস্তারিত তথ্য"
      >
        {selectedZoneDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">জোন কোড</label>
                <p className="mt-1 text-lg font-medium">{selectedZoneDetails.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">তৈরির তারিখ</label>
                <p className="mt-1">{selectedZoneDetails.createdAt}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">জোনের নাম</label>
              <p className="mt-1 text-lg font-medium">{selectedZoneDetails.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">জেলাসমূহ</label>
              <div className="flex flex-wrap gap-2">
                {selectedZoneDetails.districts.map((district: string) => (
                  <span
                    key={district}
                    className="px-3 py-1 bg-[#52b788]/10 text-[#52b788] rounded-full text-sm font-medium"
                  >
                    {district}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">মারকাযসমূহ</label>
              <div className="space-y-2">
                {selectedZoneDetails.markaz.map((markazId: number) => {
                  const markaz = markazList.find(m => m.id === markazId);
                  return markaz ? (
                    <div key={markaz.id} className="flex items-center gap-2 text-gray-700">
                      <MdLocationCity className="text-[#52b788]" />
                      <span className="font-medium">{markaz.name}</span>
                      <span className="text-sm text-gray-500">- {markaz.address}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
