import { IMarhala } from '@/features/marhala/marhala.interface'
import { Dialog } from '@/components/ui/dialog'
import InfoItem from './InfoItem'

interface MarhalaDetailsProps {
  marhala: IMarhala | null
  isOpen: boolean
  onClose: () => void
}

export default function MarhalaDetails({ marhala, isOpen, onClose }: MarhalaDetailsProps) {
  if (!marhala) return null

  console.log(marhala)

  return (
    <Dialog className='w-11/12 h-72 md:w-3/6 md:h-80 overflow-auto' isOpen={isOpen} onClose={onClose} title="মারহালা বিস্তারিত">
      <div className="space-y-4 text-gray-800">
        <InfoItem
          label="মারহালা নাম"
          value={marhala.name.bengaliName}
          subValue={marhala.name.arabicName}
        />

        <InfoItem
          label="মারহালা কোড"
          value={Number(marhala.code).toLocaleString('bn-BD')}
        />

        <InfoItem
          label="মারহালার ধরণ"
          value={marhala.marhalaType === 'boys' ? 'বালক' : 'বালিকা'}
        />

        <InfoItem
          label="মারহালার ক্যাটাগরি"
          value={marhala.marhalaCategory === 'darsiyat' ? 'দারসিয়াত' : 'হিফজ'}
        />

        <InfoItem
          label="মারহালার স্তর"
          value={Number(marhala.level).toLocaleString('bn-BD')}
        />

        <div>
          <h5 className="font-semibold mb-2">কিতাব তালিকা</h5>
          {marhala.listOfKitabs && marhala.listOfKitabs.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {marhala.listOfKitabs.map((kitab: any) => (
                <li key={kitab._id} className="text-gray-700">
                  {kitab.name.bengaliName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">কোন কিতাব যোগ করা হয়নি</p>
          )}
        </div>
      </div>
    </Dialog>
  )
} 