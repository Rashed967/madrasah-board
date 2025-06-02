export const convertBengaliToEnglish = (bengaliNumber: string): number => {
    const bengaliToEnglish: { [key: string]: string } = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    }
    
    const englishNumber = bengaliNumber.split('').map(char => 
      bengaliToEnglish[char] || char
    ).join('')
    
    return Number(englishNumber)
  }