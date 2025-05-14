"use client";
import IBoardInfo from '@/features/boardInfo/boardInfo.interface'
import IPreExamineeRegistration from '@/features/preExamineeRegistration/interfaces'
// import jsreport from '@jsreport/browser-client'

// jsreport.serverUrl = 'http://localhost:5488'



// Helper function to convert English numbers to Bengali
// const toBengaliNumber = (num: number | string) => {
//   const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
//   return num.toString().replace(/[0-9]/g, (d) => bengaliNumbers[parseInt(d)])
// }

// Helper function to convert number to Bengali words
// const numberToBengaliWords = (number: number) => {
//   const units = [
//     '',
//     'এক',
//     'দুই',
//     'তিন',
//     'চার',
//     'পাঁচ',
//     'ছয়',
//     'সাত',
//     'আট',
//     'নয়'
//   ]
//   const teens = [
//     'দশ',
//     'এগার',
//     'বার',
//     'তের',
//     'চৌদ্দ',
//     'পনের',
//     'ষোল',
//     'সতের',
//     'আঠার',
//     'ঊনিশ'
//   ]
//   const tens = [
//     '',
//     'দশ',
//     'বিশ',
//     'ত্রিশ',
//     'চল্লিশ',
//     'পঞ্চাশ',
//     'ষাট',
//     'সত্তর',
//     'আশি',
//     'নব্বই'
//   ]
//   const scales = ['', 'হাজার', 'লক্ষ', 'কোটি']

//   if (number === 0) return 'শূন্য'

//   const processGroup = (n: number, scaleIndex: number): string => {
//     if (n === 0) return ''

//     let words = ''

//     if (n > 99) {
//       words += units[Math.floor(n / 100)] + 'শত '
//       n %= 100
//     }

//     if (n > 19) {
//       words += tens[Math.floor(n / 10)] + ' '
//       if (n % 10 > 0) words += units[n % 10] + ' '
//     } else if (n > 9) {
//       words += teens[n - 10] + ' '
//     } else if (n > 0) {
//       words += units[n] + ' '
//     }

//     if (scaleIndex > 0 && words !== '') {
//       words += scales[scaleIndex] + ' '
//     }

//     return words
//   }

//   let result = ''
//   let remaining = number
//   let scaleIndex = 0

//   while (remaining > 0) {
//     const group = remaining % 1000
//     if (group > 0) {
//       result = processGroup(group, scaleIndex) + result
//     }
//     remaining = Math.floor(remaining / 1000)
//     scaleIndex++
//   }

//   return result.trim()
// }

interface ReceiptData {
  registrationData: Partial<IPreExamineeRegistration>
  boardInfo: IBoardInfo
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
 
  const {
    registrationData,
    boardInfo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    examName,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    preRegistrationFee,
    madrasahDetails,
  } = data;
  

  try {
    // Validate input data
    if (!registrationData || !registrationData.examineesPerMahala) {
      throw new Error('Invalid registration data');
    }
    if (!Array.isArray(registrationData.examineesPerMahala)) {
      throw new Error('Examinees data must be an array');
    }
    if (!boardInfo || !madrasahDetails) {
      throw new Error('Board or madrasah details are missing');
    }

   

      const response = await fetch('http://localhost:5490/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      const blob = await response.blob()
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('পিডিএফ জেনারেট করতে সমস্যা হয়েছে');
  }
};

