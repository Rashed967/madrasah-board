"use client";
import IBoardInfo from '@/features/boardInfo/boardInfo.interface'
import IPreExamineeRegistration from '@/features/preExamineeRegistration/interfaces'


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


      console.log(data)

      const response = await fetch(`${process.env.NEXT_PUBLIC_JSREPORT_SERVER_URL}/generate-pre-examinee-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      console.log(response)

      
      const blob = await response.blob()
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('পিডিএফ জেনারেট করতে সমস্যা হয়েছে');
  }
};

