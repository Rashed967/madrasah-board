/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react'

import Modal from '@/components/ui/Modal'
// all markaz page
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { IMarkazResponse } from '@/features/markaz/markaz.interface'
import { deleteMarkaz, getAllMarkaz } from '@/features/markaz/markazService'
import { getAllZones } from '@/features/zone'
import { convertToBengali } from '@/utils/convertToBengali'
import { Filter, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { EditMarkazDialog } from './components/EditMarkazDialog'
import { Dialog } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface MadrasahDataType {
  code: string
  email?: string | null
  _id: string
  madrasahNames: {
    bengaliName: string
    arabicName: string
    englishName: string
  }
}

const AllMarkaz = () => {
  const router = useRouter()
  const [markazList, setMarkazList] = useState<IMarkazResponse[]>([])
  const [allMadrasah, setAllMadrasah] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [limitPerPage, setLimitPerPage] = useState(10)
  const [selectedMarkaz, setSelectedMarkaz] = useState<IMarkazResponse | null>(
    null
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMarkazId, setSelectedMarkazId] =
    useState<IMarkazResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMarkazForDelete, setSelectedMarkazForDelete] = useState<
    string | null
  >(null)
  const [showActions, setShowActions] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMarkazForAction, setSelectedMarkazForAction] =
    useState<IMarkazResponse | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMarkazForEdit, setSelectedMarkazForEdit] =
    useState<IMarkazResponse | null>(null)
  const [zones, setZones] = useState([])
  const [selectedZone, setSelectedZone] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isOpenViewInfo, setIsOpenViewInfo] = useState(false)

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await getAllZones({
          limit: 50
        })
        if (response.success) {
          setZones(response.data)
       
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError('জোনের তথ্য আনতে সমস্যা হয়েছে।')
      }
    }
    fetchZones()
  }, [])

 
  const fetchMarkaz = async () => {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('page', String(currentPage))
      queryParams.append('limit', String(limitPerPage))
      if (selectedZone.length > 0) {
        queryParams.append('zoneIds', selectedZone.join(','))
      }
      if (selectedCategory) {
        queryParams.append('category', selectedCategory)
      }

      const response = await getAllMarkaz(queryParams.toString())

     
      if (response.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMarkazList((response as any)?.data?.markazList)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAllMadrasah((response as any)?.data?.allMadrasah)
        setTotalPages(Math.ceil(response.meta?.total / limitPerPage))
        setTotalDocuments(response.meta?.total)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('মারকাযের তথ্য আনতে সমস্যা হয়েছে।')
    } finally {
      setLoading(false)
    }
  }

  // useQuery({
  //   queryKey: ['all-markaz-madrasah'],
  //   queryFn:
  // })

  useEffect(() => {
    fetchMarkaz()
  }, [currentPage, limitPerPage])

  function truncateAddress(address, length = 20) {
    return address.length > length
      ? address.substring(0, length) + '...'
      : address
  }

  const handleActionClick = (markaz: IMarkazResponse) => {
    setShowActions(!showActions)
    setSelectedMarkazForAction(markaz)
  }

  const editMarkaz = (markaz: IMarkazResponse) => {
    router.push(`/dashboard/markaz/edit/${markaz._id}`)
  }

  const handleEditSuccess = () => {
    // Refresh the list after successful edit
    const fetchMarkaz = async () => {
      try {
        const queryParams = new URLSearchParams()
        queryParams.append('page', String(currentPage))
        queryParams.append('limit', String(limitPerPage))
        if (selectedCategory) queryParams.append('category', selectedCategory)
        

        if (selectedZone.length > 0)
          queryParams.append('zoneIds', selectedZone.join(','))
        const response = await getAllMarkaz(queryParams.toString())
        if (response.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setMarkazList((response as any).data.data)
          setTotalPages(Math.ceil(response.meta?.total / limitPerPage))
          setTotalDocuments(response.meta?.total)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError('মারকাযের তথ্য আনতে সমস্যা হয়েছে।')
      }
    }
    fetchMarkaz()
  }

  const handleDeleteClick = (id: string) => {
    setSelectedMarkazForDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedMarkazForDelete) return

    try {
      const response = await deleteMarkaz(selectedMarkazForDelete)
      if (response.success) {
        toast.success(response.message)
        // Refresh the list
        const updatedList = markazList.filter(
          (markaz) => markaz._id.toString() !== selectedMarkazForDelete
        )
        setMarkazList(updatedList)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('মারকায ডিলিট করতে সমস্যা হয়েছে')
    } finally {
      setShowDeleteModal(false)
      setSelectedMarkazForDelete(null)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (limit: number) => {
    setLimitPerPage(limit)
    setCurrentPage(1)
  }

  // const handleViewInfo = () => {

  // }

  if (loading) return <LoadingSpinner />
  if (error) return <div>{error}</div>

  return (
    <>
      <Modal isOpen={isOpenViewInfo} onClose={() => setIsOpenViewInfo(false)}>
        <div className="p-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <h2 className="text-lg font-semibold mb-2">
            {selectedMarkaz?.madrasah?.madrasahNames?.bengaliName}
          </h2>
          <p>
            ঠিকানা:{' '}
            {`
              ${selectedMarkaz?.madrasah?.address?.holdingNumber},
              ${selectedMarkaz?.madrasah?.address?.village},
              ${selectedMarkaz?.madrasah?.address?.subDistrict_policeStation},
              ${selectedMarkaz?.madrasah?.address?.district}
              `}
          </p>
          <p>
            কোড:{' '}
            {selectedMarkaz?.code
              ? convertToBengali(selectedMarkaz?.code.toString())
              : ''}
          </p>
          <p>
            মোবাইল নাম্বার:{' '}
            {`${selectedMarkaz?.madrasah?.contactNo1 ?? ''}, ${selectedMarkaz?.madrasah?.contactNo2 ?? ''}`}
          </p>

          <p>
            জোন:{' '}
            {zones?.find((zone) => zone?._id === selectedMarkaz?.zone) && zones?.find((zone) => zone?._id === selectedMarkaz?.zone)?.name || ''}
          </p>
          <p>
            মাদ্রাসার সংখ্যা:{' '}
            {convertToBengali(
              selectedMarkaz?.allMadrasahInMarkaz?.length ? selectedMarkaz?.allMadrasahInMarkaz?.length.toString() : 0
            )}
          </p>
          <h3 className="text-md font-semibold mt-4">মাদ্রাসার তালিকা:</h3>
          <ul className="list-disc pl-5">
            {selectedMarkaz?.allMadrasahInMarkaz?.map((madrasah, index) => (
              <li key={index}>
                {typeof madrasah === 'object'
                  ? madrasah.madrasahNames?.bengaliName || '-'
                  : madrasah}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <div>
        <div className="mx-auto py-6 px-2 md:px-4 max-w-4xl mt-6">
          <h1 className="text-xl font-semibold mb-4">সব মারকায</h1>
          <div className="mb-4 flex gap-4">
            <Select
              value={selectedZone[0] || ''}
              onValueChange={(value) => {
                if (value === 'all') {
                  setSelectedZone([])
                } else {
                  setSelectedZone([value])
                }
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="জোন নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent className='h-[240px]'>
                <SelectItem value="all">সকল জোন</SelectItem>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone._id.toString()}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                if (value === 'all') {
                  setSelectedCategory('')
                } else {
                  setSelectedCategory(value)
                }
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ক্যাটাগরী নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">উভয়</SelectItem>
                <SelectItem value="বালক">বালক</SelectItem>
                <SelectItem value="বালিকা">বালিকা</SelectItem>
              </SelectContent>
            </Select>
            {/* fancy button  */}
            {/* className="bg-[#52B788] hover:bg-[#52B788]/90 text-white py-0" */}
            <Button size='default' variant='primary' onClick={() => fetchMarkaz()}>
              <Filter size={16} className="mr-2" />
              ফিল্টার
            </Button>
          </div>
          <table
            className="min-w-full divide-y divide-gray-200 "
            style={{ borderSpacing: '0px', borderCollapse: 'separate' }}
          >
            <thead className="bg-[#52B788]/70 text-white ">
              <tr className="">
                <th
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider textgra"
                  style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                >
                  মারকায কোড
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                  style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                >
                  মারকাযের নাম
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                  style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                >
                  ঠিকানা
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                  style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                >
                  মোবাইল
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                  style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                >
                  মাদ্রাসার সংখ্যা
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                  style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                >
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {markazList?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    কোনো ডাটা পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                markazList?.map((markaz) => (
                  <tr key={markaz._id.toString()} className="hover:bg-gray-100">
                    <td
                      className="px-6 py-4 text-sm font-medium text-gray-900 "
                      style={{
                        maxWidth: '200px',
                        wordWrap: 'break-word',
                        padding: '10px'
                      }}
                    >
                      {convertToBengali(markaz.code.toString())}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-500 cursor-pointer"
                      onClick={() => {
                      
                        setSelectedMarkaz(markaz)
                        setIsOpenViewInfo(true)
                      }}
                      style={{
                        maxWidth: '200px',
                        wordWrap: 'break-word',
                        padding: '10px'
                      }}
                    >
                      {markaz.madrasah.madrasahNames.bengaliName}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-500"
                      style={{
                        maxWidth: '200px',
                        wordWrap: 'break-word',
                        padding: '10px'
                      }}
                    >
                      {
                        (markaz.madrasah?.address?.district,
                        markaz?.madrasah?.address?.division,
                        markaz?.madrasah?.address?.holdingNumber)
                      }
                    </td>

                    <td
                      className="px-6 py-4 text-sm text-gray-500"
                      style={{
                        maxWidth: '200px',
                        wordWrap: 'break-word',
                        padding: '10px'
                      }}
                    >
                      {markaz.madrasah?.contactNo1
                        ? markaz.madrasah?.contactNo1
                        : '-'}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-500 "
                      style={{
                        maxWidth: '200px',
                        wordWrap: 'break-word',
                        padding: '10px'
                      }}
                    >
                      {allMadrasah.length &&
                        convertToBengali(allMadrasah?.length.toString())}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-6 w-6 p-0 bg-[#52B788] rounded-full"
                            >
                              <MoreHorizontal className="h-4 w-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white/70 text-gray-700"
                          >
                            <DropdownMenuItem
                              onClick={() => editMarkaz(markaz)}
                            >
                              এডিট করুন
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleDeleteClick(markaz._id.toString())
                              }
                            >
                              ডিলিট করুন
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className=" max-w-4xl mt-4 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">প্রতি পেজে:</span>
            <Select
              value={String(limitPerPage)}
              onValueChange={(value) => handleLimitChange(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={limitPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                মারকায ডিলিট নিশ্চিতকরণ
              </h2>
              <p className="mb-4">
                আপনি কি নিশ্চিত যে আপনি এই মারকাযটি ডিলিট করতে চান?
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                >
                  বাতিল করুন
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  ডিলিট করুন
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit Markaz Modal */}
        {selectedMarkazForEdit && (
          <EditMarkazDialog
            markaz={selectedMarkazForEdit}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false)
              setSelectedMarkazForEdit(null)
            }}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </>
  )
}

export default AllMarkaz
