'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import type { KeyboardEvent } from 'react';
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ZonesTable } from './components/ZonesTable';
import { TotalCount } from './components/TotalCount';
import { DetailsModal } from './components/DetailsModal';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { getAllZones, IZone, deleteZone } from '@/features/zone';
import { StatusDialog } from '@/components/ui/status-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ZonesTableSkeleton } from './components/ZonesTableSkeleton';

const dummyZones: IZone[] = [];

export default function AllZones() {
  const [zones, setZones] = useState<IZone[]>(dummyZones);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
  const [selectedZoneName, setSelectedZoneName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allZoneNames, setAllZoneNames] = useState<string[]>([]);
  
  useEffect(() => {
    const zoneNames = zones.map(zone => zone.name);
    setAllZoneNames(zoneNames);
  }, [zones]);
  
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    
    if (!('key' in e)) {
      // Just update input value without filtering
      setInputValue(value);
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      // Update search term to trigger filtering
      setSearchTerm(value);
    }
  };

  const handleZoneNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectedZoneName(e.target.value);
  };

  const handleViewZone = (zone: IZone) => {
    setSelectedZone(zone);
    setShowDetailsModal(true);
  };

  const handleDeleteZone = (zone: IZone) => {
    setSelectedZone(zone);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedZone) return;

    try {
      const result = await deleteZone(selectedZone._id.toString());
      
      if (result.success) {
        setStatusDialog({
          isOpen: true,
          type: 'success',
          title: 'সফল!',
          message: result.message || 'জোন ডিলিট করা হয়েছে'
        });
        // Refresh the zones list
        loadZones();
      } else {
        setStatusDialog({
          isOpen: true,
          type: 'error',
          title: 'ত্রুটি!',
          message: result.message || 'জোন ডিলিট করতে সমস্যা হয়েছে'
        });
      }
    } catch (error: any) {
      setStatusDialog({
        isOpen: true,
        type: 'error',
        title: 'ত্রুটি!',
        message: error.message || 'জোন ডিলিট করতে সমস্যা হয়েছে'
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedZone(null);
    }
  };

  // Filter zones based on search term and selected zone name
  const filteredZones = zones.filter(zone => {
    const matchesSearch = searchTerm ? zone.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesZoneName = !selectedZoneName || zone.name === selectedZoneName;
    
    return matchesSearch && matchesZoneName;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header title="সকল জোন" />
      <SearchAndFilter
        searchTerm={inputValue}
        onSearchChange={handleSearchChange}
        selectedZoneName={selectedZoneName}
        onZoneNameChange={handleZoneNameChange}
        zoneNames={allZoneNames}
      />

      {isLoading ? (
        <ZonesTableSkeleton />
      ) : (
        <ZonesTable
          zones={filteredZones}
          onView={handleViewZone}
          onDelete={handleDeleteZone}
        />
      )}

      <TotalCount count={filteredZones.length} />

      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        selectedZone={selectedZone}
      />

      <DeleteConfirmation
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        selectedZone={selectedZone}
      />

      <StatusDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog(prev => ({ ...prev, isOpen: false }))}
        title={statusDialog.title}
        message={statusDialog.message}
        type={statusDialog.type}
      />
    </div>
  );
}
