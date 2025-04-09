import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { getAllMarhalas, deleteMarhala } from '@/features/marhala/marhala.service'
import type { IMarhala } from '@/features/marhala/marhala.interface'

export const useMarhalaOperations = (marhalaPerPage: number = 10) => {
  const [marhalaList, setMarhalaList] = useState<IMarhala[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingMarhala, setEditingMarhala] = useState<IMarhala | null>(null)
  const [selectedMarhala, setSelectedMarhala] = useState<IMarhala | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [marhalaToDelete, setMarhalaToDelete] = useState<IMarhala | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const loadMarhalas = async () => {
    try {
      setIsLoading(true)
      const fields = ''
      const populate = true
      const limit = marhalaPerPage
      const page = currentPage
      const response = await getAllMarhalas(fields, populate, page, limit)
      if (response.success) {
        setMarhalaList(response.data || [])
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('মারহালা লোড করতে সমস্যা হয়েছে')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handleEditClick = (marhala: IMarhala) => {
    setEditingMarhala(marhala)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = async (updatedMarhala: IMarhala) => {
    const response = await getAllMarhalas('', true, currentPage, marhalaPerPage)
    if (response.success) {
      setMarhalaList(response.data || [])
    }
    setEditDialogOpen(false)
    setEditingMarhala(null)
  }

  const handleDeleteClick = (marhala: IMarhala) => {
    setMarhalaToDelete(marhala)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!marhalaToDelete?._id) return

    const marhalaId = marhalaToDelete._id.toString()
    const marhalaBengaliName = marhalaToDelete.name.bengaliName

    setShowDeleteDialog(false)
    setMarhalaToDelete(null)

    try {
      const response = await deleteMarhala(marhalaId)

      if (response.success) {
        const updatedList = marhalaList.filter(
          (m) => m._id?.toString() !== marhalaId
        )
        setMarhalaList(updatedList)
        toast.success(`${marhalaBengaliName} মারহালা মুছে ফেলা হয়েছে`)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('মারহালা মুছে ফেলতে সমস্যা হয়েছে')
    }
  }

  const handleShowDetails = (marhala: IMarhala) => {
    setSelectedMarhala(marhala)
    setShowDetailsDialog(true)
  }

  return {
    marhalaList,
    isLoading,
    currentPage,
    editingMarhala,
    selectedMarhala,
    showDetailsDialog,
    marhalaToDelete,
    showDeleteDialog,
    editDialogOpen,
    loadMarhalas,
    handlePreviousPage,
    handleNextPage,
    handleEditClick,
    handleEditSuccess,
    handleDeleteClick,
    handleConfirmDelete,
    handleShowDetails,
    setShowDetailsDialog,
    setShowDeleteDialog,
    setEditDialogOpen
  }
} 