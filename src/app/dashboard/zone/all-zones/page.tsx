'use client';

import { useState, useMemo, useEffect } from 'react';
import { MdEdit, MdDelete, MdAdd, MdSearch, MdFilterList, MdLocationCity } from 'react-icons/md';
import Link from 'next/link';
import { Dialog } from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getAllZones, type Zone } from '@/services/zoneService';
import { StatusDialog } from '@/components/ui/status-dialog';

export default function AllZones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<Zone | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedZoneDetails, setSelectedZoneDetails] = useState<Zone | null>(null);
  const [statusDialog, setStatusDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setIsLoading(true);
      const response = await getAllZones();
      setZones(response.data);
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error.message || 'জোন লোড করতে সমস্যা হয়েছে'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered zones based on search and filter
  const filteredZones = useMemo(() => {
    return zones.filter(zone => {
      const matchesSearch = 
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.allDistricts.some(district => 
          district.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesZoneFilter = !selectedZone || selectedZone === 'all' || zone.name === selectedZone;
      
      return matchesSearch && matchesZoneFilter;
    });
  }, [zones, searchQuery, selectedZone]);

  // Modals
  const handleShowDetails = (zone: Zone) => {
    setSelectedZoneDetails(zone);
    setShowDetailsModal(true);
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setShowEditModal(true);
  };

  const handleDelete = (zone: Zone) => {
    setZoneToDelete(zone);
    setShowDeleteDialog(true);
  };

  const closeStatusDialog = () => {
    setStatusDialog(prev => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container  mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">সকল জোন</h1>
        <Link 
          href="/dashboard/zone/add-zone"
          className="inline-flex items-center px-4 py-2 bg-[#52B788] text-white rounded-md hover:bg-[#52B788]/70"
        >
          <MdAdd className="mr-2" />
          নতুন জোন
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-2">
          <div className="relative">
            <input
              type="text"
              placeholder="জোন অথবা জেলা খুঁজুন"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52B788]/70 "
            />
            <MdSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div className="w-full md:w-64 bg-white rounded-md">
          <Select
            value={selectedZone || 'all'}
            onValueChange={(value) => setSelectedZone(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="জোন ফিল্টার করুন" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem  value="all">সব জোন</SelectItem>
              {zones.map((zone) => (
                <SelectItem  key={zone._id} value={zone.name}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#52B788]/70 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">জোন</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">কোড</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">জেলাসমূহ</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">মারকায সংখ্যা</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-white uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredZones.map((zone) => (
              <tr key={zone._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{zone.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {zone.allDistricts.join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {zone.allMarkazs.length || 0} টি মারকায
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleShowDetails(zone)}
                    className="text-[#52B788] hover:text-[#52B788]/70 mr-3"
                  >
                    বিস্তারিত
                  </button>
                  <button
                    onClick={() => handleEdit(zone)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <MdEdit className="inline-block" />
                  </button>
                  <button
                    onClick={() => handleDelete(zone)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <MdDelete className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total count */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          মোট {filteredZones.length}টি জোন দেখাচ্ছে
        </div>
      </div>

      {/* Details Modal */}
      <Dialog
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="জোনের বিস্তারিত"
      >
        {selectedZoneDetails && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">জোনের নাম</h3>
              <p>{selectedZoneDetails.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">কোড</h3>
              <p>{selectedZoneDetails.code}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">জেলাসমূহ</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedZoneDetails.allDistricts.map((district, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#52B788]/80 text-white rounded-full text-sm"
                  >
                    {district}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">মারকাযসমূহ</h3>
              <p>{selectedZoneDetails.allMarkazs.length || 0} টি মারকায</p>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          // Handle delete
          setShowDeleteDialog(false);
        }}
        title="জোন মুছে ফেলুন"
        description={`আপনি কি নিশ্চিত যে আপনি "${zoneToDelete?.name}" জোনটি মুছে ফেলতে চান?`}
      />

      {/* Status Dialog */}
      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={closeStatusDialog}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
    </div>
  );
}
