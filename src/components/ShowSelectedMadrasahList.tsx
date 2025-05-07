'use client'
import React from 'react'
import { MdDeleteForever } from 'react-icons/md'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'
import { Button } from './ui/button'

interface Madrasah {
  _id: string
  name: string
  code: string
}

interface SelectedMadrasahListProps {
  madrasahs: Madrasah[]
  onRemove: (id: string) => void
}

export default function ShowSelectedMadrasahList({
  madrasahs,
  onRemove
}: SelectedMadrasahListProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-1 bg-green-100 py-1 px-2">
      <div className="flex space-x-3">
        <p className="text-sm">
          মোট সিলেক্টেড মাদ্রাসা:{' '}
          <span className="font-bold">{madrasahs?.length}</span>
        </p>
        {madrasahs.length > 0 && (
          <Button
            type="button"
            size="xs"
            variant="primary"
            className="text-xs font-semibold"
            onClick={() => setIsOpen(true)}
          >
            সব দেখুন
          </Button>
        )}
      </div>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 ">
          <Dialog.Panel className="w-full max-w-md bg-base-100 p-6 rounded-lg shadow-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-md font-bold">
                সিলেক্টেড মাদ্রাসাসমূহ
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {madrasahs.length === 0 ? (
              <p className="text-sm">কোন মাদ্রাসা সিলেক্ট করা হয়নি।</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {madrasahs.map((madrasa) => (
                  <li
                    key={madrasa._id}
                    className="flex justify-between items-center border px-2 py-1 rounded"
                  >
                    <div>
                      <p className="text-base">{madrasa.name}</p>
                      <p className="text-xs text-gray-500">{madrasa.code}</p>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      size="xs"
                      className="text-xs"
                      onClick={() => onRemove(madrasa._id)}
                    >
                      <span className="flex justify-center space-x-1">
                        <MdDeleteForever size={16} />
                        <span>ডিলিট</span>
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
