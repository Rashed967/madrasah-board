import { format } from 'date-fns'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { PreExamineeRegistrationData } from '@/types/preExaminee.types'
import IBoardInfo from '@/features/boardInfo/boardInfo.interface'
import IPreExamineeRegistration from '@/features/preExamineeRegistration/interfaces'
import { useCallback } from 'react'

// Helper function to convert English numbers to Bengali
const toBengaliNumber = (num: number | string) => {
  const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return num.toString().replace(/[0-9]/g, (d) => bengaliNumbers[parseInt(d)])
}

// Helper function to convert number to Bengali words
const numberToBengaliWords = (number: number) => {
  const units = [
    '',
    'এক',
    'দুই',
    'তিন',
    'চার',
    'পাঁচ',
    'ছয়',
    'সাত',
    'আট',
    'নয়'
  ]
  const teens = [
    'দশ',
    'এগার',
    'বার',
    'তের',
    'চৌদ্দ',
    'পনের',
    'ষোল',
    'সতের',
    'আঠার',
    'ঊনিশ'
  ]
  const tens = [
    '',
    'দশ',
    'বিশ',
    'ত্রিশ',
    'চল্লিশ',
    'পঞ্চাশ',
    'ষাট',
    'সত্তর',
    'আশি',
    'নব্বই'
  ]
  const scales = ['', 'হাজার', 'লক্ষ', 'কোটি']

  if (number === 0) return 'শূন্য'

  const processGroup = (n: number, scaleIndex: number): string => {
    if (n === 0) return ''

    let words = ''

    if (n > 99) {
      words += units[Math.floor(n / 100)] + 'শত '
      n %= 100
    }

    if (n > 19) {
      words += tens[Math.floor(n / 10)] + ' '
      if (n % 10 > 0) words += units[n % 10] + ' '
    } else if (n > 9) {
      words += teens[n - 10] + ' '
    } else if (n > 0) {
      words += units[n] + ' '
    }

    if (scaleIndex > 0 && words !== '') {
      words += scales[scaleIndex] + ' '
    }

    return words
  }

  let result = ''
  let remaining = number
  let scaleIndex = 0

  while (remaining > 0) {
    const group = remaining % 1000
    if (group > 0) {
      result = processGroup(group, scaleIndex) + result
    }
    remaining = Math.floor(remaining / 1000)
    scaleIndex++
  }

  return result.trim()
}

interface ReceiptData {
  registrationData: Partial<IPreExamineeRegistration>
  boardInfo: IBoardInfo | null
  examName: string
  preRegistrationFee: number
  madrasahDetails: {
    name: string
    code: string
    address: {
      village: string
      district: string
      division: string
    }
  }
}

export const generatePreExamineeReceipt = async (data: ReceiptData) => {
  console.log(data)
  const {
    registrationData,
    boardInfo,
    examName,
    preRegistrationFee,
    madrasahDetails
  } = data

  try {
    // Create a temporary div for the receipt
    const receiptDiv = document.createElement('div')
    receiptDiv.style.fontFamily = 'Kalpurush'
    receiptDiv.style.padding = '30px'
    receiptDiv.style.width = '148mm' // A5 width
    receiptDiv.style.height = '210mm' // A5 height
    receiptDiv.style.position = 'relative'
    receiptDiv.style.backgroundColor = 'white'

    // Calculate total amount and examinees
    const totalAmount = registrationData.examineesPerMahala.reduce(
      (sum, item) => sum + item.totalExamineesSlots * preRegistrationFee,
      0
    )

    const totalExaminees = registrationData.examineesPerMahala.reduce(
      (sum, item) => sum + (item.totalExamineesSlots || 0),
      0
    )

    // Format short address
    const shortAddress = madrasahDetails?.address
      ? `${madrasahDetails.address.village}, ${madrasahDetails.address.district}, ${madrasahDetails.address.division}`
      : ''

    // Format current date in Bengali
    const currentDate = format(new Date(), 'dd/MM/yyyy')
    const bengaliDate = toBengaliNumber(currentDate)

    // Filter out marhalas with zero examinees
    const activeMarhalas = registrationData.examineesPerMahala.filter(
      (item) => item.totalExamineesSlots > 0
    )

    console.log(activeMarhalas)

    // Add content to the div
    receiptDiv.innerHTML = `
      <div style="height: 100%; position: relative;">
        <!-- Watermark -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; z-index: -1; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <img src="${boardInfo?.logo || ''}" style="width: 300px; height: auto;" />
        </div>

        <!-- Content -->
        <div style="position: relative; z-index: 1;">
          <div style="text-align: center; border-bottom: 1px solid black; padding: 8px 0; margin-bottom: 8px; display: flex; align-items: center;">
            <div style="width: 50px; margin-right: -15px;">
              <img src="${boardInfo?.logo || ''}" style="width: 100%; height: auto;" />
            </div>
            <div style="flex: 1; text-align: center;">
              <h1 style="font-size: 16px; margin-bottom: 4px;">${boardInfo?.boardName.bengaliName || ''}</h1>
              <p style="font-size: 11px; margin: 2px 0; font-weight: 500;">অস্থায়ী কার্যালয় : ${boardInfo?.address || ''}</p>
              <p style="font-size: 11px; margin: 2px 0; font-weight: 500;">(অফিস) ${boardInfo?.contactNo1 || ''} (পরীক্ষা বিভাগ) ${boardInfo?.contactNo2 || ''}</p>
              <p style="font-size: 10px; margin: 4px 0; font-weight: 500;">${examName || ''}</p>
            </div>
          </div>
          
          <h2 style="text-align: center; font-size: 12px; margin-bottom: 8px; font-weight: bold;">নিবন্ধন ফি</h2>
          
          <div style="border: 1px solid black; padding: 4px 6px 8px 6px; margin-bottom: 8px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; padding-bottom: 8px;">
              <p style="font-size: 11px; font-weight: 500; margin: 0;">রসিদ : ${toBengaliNumber(registrationData?.receiptNo) || ''}</p>
              <p style="font-size: 11px; font-weight: 500; margin: 0;">কোড : ${toBengaliNumber(madrasahDetails?.code || '')}</p>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <p style="font-size: 11px; font-weight: 500; margin: 0;">এন্ট্রি তারিখ : ${bengaliDate}</p>
              <p style="font-size: 11px; font-weight: 500; margin: 0;">প্রিন্টের তারিখ : ${bengaliDate}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 8px;">
            <p style="font-size: 11px; margin: 2px 0; font-weight: 500;">মাদরাসা : ${madrasahDetails?.name || ''}</p>
            <p style="font-size: 11px; margin: 2px 0; font-weight: 500;">ঠিকানা : ${shortAddress}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <thead>
              <tr>
                <th style="border: 1px solid #999; border-bottom: 2px solid black; padding: 2px 4px 6px 4px; font-size: 11px; font-weight: normal;">ক্রম</th>
                <th style="border: 1px solid #999; border-bottom: 2px solid black; padding: 2px 4px 6px 4px; font-size: 11px; font-weight: normal;">মারহালা</th>
                <th style="border: 1px solid #999; border-bottom: 2px solid black; padding: 2px 4px 6px 4px; font-size: 11px; font-weight: normal;">পরীক্ষার্থী</th>
                <th style="border: 1px solid #999; border-bottom: 2px solid black; padding: 2px 4px 6px 4px; font-size: 11px; font-weight: normal;">নির্ধারিত ফি</th>
                <th style="border: 1px solid #999; border-bottom: 2px solid black; padding: 2px 4px 6px 4px; font-size: 11px; font-weight: normal;">পরিমাণ</th>
              </tr>
            </thead>
            <tbody>
              ${activeMarhalas
                .map(
                  (item, index) => `
                <tr>
                  <td style="border: 1px solid #999; padding: 2px 4px; font-size: 13px; font-weight: 500; text-align: center;">${toBengaliNumber(index + 1)}</td>
                  <td style="border: 1px solid #999; padding: 2px 4px 8px 4px; font-size: 13px; font-weight: 500;">${item?.marhalaName || 'অজানা'}</td>
                  <td style="border: 1px solid #999; padding: 2px 4px 8px 4px; font-size: 13px; font-weight: 500; text-align: center;">${toBengaliNumber(item.totalExamineesSlots)}</td>
                  <td style="border: 1px solid #999; padding: 2px 4px 8px 4px; font-size: 13px; font-weight: 500; text-align: center;">${toBengaliNumber(preRegistrationFee)}</td>
                  <td style="border: 1px solid #999; padding: 2px 4px 8px 4px; font-size: 12px; font-weight: 500; text-align: right;">${toBengaliNumber(item.totalExamineesSlots * preRegistrationFee)}</td>
                </tr>
              `
                )
                .join('')}
              <tr>
                <td colspan="2" style="border: 1px solid #999; padding: 2px 4px; font-size: 12px; font-weight: 500; text-align: right;">মোট</td>
                <td style="border: 1px solid #999; padding: 2px 4px 8px 4px; font-size: 12px; font-weight: 500; text-align: center;">${toBengaliNumber(totalExaminees)}</td>
                <td style="border: 1px solid #999; padding: 2px 4px; font-size: 12px; font-weight: 500; text-align: center;"></td>
                <td style="border: 1px solid #999; padding: 2px 4px 8px 4px; font-size: 12px; font-weight: 500; text-align: right;">${toBengaliNumber(totalAmount)}</td>
              </tr>
            </tbody>
          </table>
          
          <p style="margin-bottom: 16px; font-size: 11px; font-weight: 500;">কথায় : ‍<span ‍style="font-weight: bold;">${numberToBengaliWords(totalAmount)} টাকা মাত্র।</span> </p>
        </div>

        <!-- Signature -->
        <div style="position: absolute; bottom: 20px; right: 20px; background: white;">
          <div style="text-align: center;">
            <div style="width: 80px; border-top: 1px solid black;"></div>
            <p style="margin-top: 2px; font-size: 11px; font-weight: 500;">গ্রহিতার স্বাক্ষর</p>
          </div>
        </div>
      </div>
    `

    // Add the div to document
    document.body.appendChild(receiptDiv)

    // Convert to canvas and then PDF with optimized quality
    const canvas = await html2canvas(receiptDiv, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: 'white',
      imageTimeout: 0,
      removeContainer: true,
      height: 297 * 3.78,
      windowHeight: 297 * 3.78
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
      compress: true
    })

    const imgWidth = 148
    const pageHeight = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
    pdf.save('pre-registration-receipt.pdf')

    // Remove the temporary div
    document.body.removeChild(receiptDiv)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('পিডিএফ জেনারেট করতে সমস্যা হয়েছে')
  }
}

