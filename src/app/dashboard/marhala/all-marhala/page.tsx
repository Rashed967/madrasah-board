'use client'

import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useMarhalaOperations } from '../hooks/useMarhalaOperations'
import dynamic from 'next/dynamic'

const MARHALA_PER_PAGE = 10

const MarhalaTable = dynamic(() => import('./components/MarhalaTable'), {
  loading: () => <div>লোড হচ্ছে...</div>
})

const Pagination = dynamic(() => import('./components/Pagination'), {
  loading: () => <div>লোড হচ্ছে...</div>
})

const MarhalaDetails = dynamic(() => import('./components/MarhalaDetails'), {
  loading: () => <div>লোড হচ্ছে...</div>
})

const EditMarhalaDialog = dynamic(() => import('./components/EditMarhalaDialog'), {
  loading: () => <div>লোড হচ্ছে...</div>
})

export default function AllMarhalaPage() {
  const {
    marhalaList,
    isLoading,
    currentPage,
    editingMarhala,
    selectedMarhala,
    showDetailsDialog,
    editDialogOpen,
    loadMarhalas,
    handlePreviousPage,
    handleNextPage,
    handleEditClick,
    handleEditSuccess,
    handleShowDetails,
    setShowDetailsDialog,
    setEditDialogOpen
  } = useMarhalaOperations(MARHALA_PER_PAGE)

  useEffect(() => {
    loadMarhalas()
  }, [currentPage])

  if (isLoading) {
    return (
      <div className="p-8 mt-12 mx-6 flex justify-center items-center">
        <div className="text-lg">লোড হচ্ছে...</div>
      </div>
    )
  }

  return (
    <div className="p-2 mt-12 mx-1 md:mx-6 text-gray-700">
      <Toaster />
      <h1 className="text-lg font-bold mb-4 text-gray-800">সকল মারহালা</h1>

      <MarhalaTable
        marhalaList={marhalaList}
        onShowDetails={handleShowDetails}
        onEditClick={handleEditClick}
      />

      <Pagination
        currentPage={currentPage}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        hasNextPage={marhalaList.length >= MARHALA_PER_PAGE}
      />

      <MarhalaDetails
        marhala={selectedMarhala}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
      />

      <EditMarhalaDialog
        marhala={editingMarhala}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
