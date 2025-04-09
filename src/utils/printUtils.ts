import { IMadrasah } from '@/features/madrasah/interfaces'
import { convertToBengali } from './convertToBengali'

export function generatePrintContent(
  madrasahs: IMadrasah[],
  type: 'list' | 'addresses',
  selectedMadrasahType: string,
  selectedZone: string
) {
  if (type === 'list') {
    return `
      ${generatePrintHeader()}
      ${generateMadrasahListContent(madrasahs, selectedMadrasahType, selectedZone)}
    `
  } else {
    return generateAddressesContent(madrasahs)
  }
}

// this generateMadrasahListContent just perfect, don't touch it until i tell you
function generateMadrasahListContent(madrasahs: IMadrasah[], selectedMadrasahType: string, selectedZone: string) {
  // Helper function to handle null/undefined values
  const getValue = (value: string | null | undefined) => value ?? ''

  return `

  <div style="display: flex; justify-content: center; align-items: center; ">
    <h2 style="text-align: center;  font-size: 12pt; font-weight: bold; margin-bottom: 0mm; border : 2px solid black; margin-top: 1.5mm; padding: 2mm;">মাদরাসা তালিকা</h2>
    </div>

    <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 2mm; margin-bottom: 2mm;">
      <p style="font-size: 12pt; font-weight: bold; ">${selectedZone === 'all' ? 'সকল জোন' : 'জোন : '  + selectedZone}  </p>
      <p style="font-size: 12pt; font-weight: bold;">(${selectedMadrasahType === 'all' ? 'বালক/বালিকা' : selectedMadrasahType})</p>
    </div>  

    <table style="width: 100%; min-width: 100%; border-collapse: collapse; margin: 0; font-family: 'Kalpurush', Arial, sans-serif;">
      <colgroup>
        <col style="width: 4%">
        <col style="width: 6%">
        <col style="width: 27%">
        <col style="width: 25%">
        <col style="width: 25%">
        <col style="width: 13%">
      </colgroup>
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center; white-space: nowrap;">ক্রমিক</th>
          <th style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center; white-space: nowrap;">কোড</th>
          <th style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center; white-space: nowrap;">মাদরাসার নাম</th>
          <th style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center; white-space: nowrap;">ঠিকানা</th>
          <th style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center; white-space: nowrap;">মুহতামিম</th>
          <th style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center; white-space: nowrap;">মোবাইল</th>
        </tr>
      </thead>
      <tbody>
        ${madrasahs
          .map(
            (madrasah, index) => `
          <tr>
            <td style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center;">${convertToBengali(index + 1)}</td>
            <td style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center;">${convertToBengali(getValue(madrasah.code))}</td>
            <td style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center;">${getValue(madrasah.madrasahNames.bengaliName)}</td>
            <td style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center;">
              ${[
                convertToBengali(getValue(madrasah.address.holdingNumber)),
                convertToBengali(getValue(madrasah.address.village)),
                convertToBengali(getValue(madrasah.address.subDistrict_policeStation)),
                convertToBengali(getValue(madrasah.address.district))
              ].filter(Boolean).join(', ')}
            </td>
            <td style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center;">${getValue(madrasah?.muhtamim?.name)}</td>
            <td style="border: 1px solid black; padding: 3mm; font-size: 14pt; text-align: center;">
              ${convertToBengali(getValue(madrasah.contactNo1))}
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
}

function generateAddressesContent(madrasahs: IMadrasah[]) {
  // Helper function to handle null/undefined values
  const getValue = (value: string | null | undefined) => value || ''

  return `
    <style>
      @media print {
        .courier-address {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color: white !important;
          background-color: gray !important;
        }
      }
    </style>
    <div style="width: 100%; max-width: 210mm; margin: 0 auto; padding: 0.5mm; display: grid; grid-template-columns: repeat(2, 1fr); gap: 3mm; page-break-inside: auto;">
      ${madrasahs
        .map(
          (madrasah) => `
        <div style="padding: 2mm; border: 2px solid black; break-inside: avoid; box-sizing: border-box; font-size: 11pt; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2mm;">
            <span style="font-size: 11pt;">মুহতামিম,</span>
            <div class="courier-address" style="font-size: 8pt; margin-top: 0.5mm; background-color: gray; display: inline; padding: 1mm 2mm; color: white; opacity: 0.5">
          (${getValue(madrasah.address.courierAddress)})
          </div>
            <span style="font-size: 11pt;">কোড নং- ${convertToBengali(getValue(madrasah.code))}</span>
          </div>
          <div style="font-size: 11pt; margin-bottom: 1mm; ">${getValue(madrasah?.muhtamim?.name)}</div>
          <div style="font-size: 12pt; font-weight: bold; margin: 1mm 0px;">${getValue(madrasah.madrasahNames.bengaliName)}
          </div>
          <div style="">
            <span style="font-size: 11pt;">গ্রাম/মহল্লা: ${ convertToBengali(getValue(madrasah.address.holdingNumber))}</span>
            <span style="font-size: 11pt;"> ${ getValue(madrasah.address.village)}</span>

          </div>
          <div style="display: flex; justify-content: space-between; margin: 1mm 0px;">
              <span style="font-size: 11pt;">পোস্ট অফিস: ${getValue(madrasah.address.postOffice)}</span>
            <span style="font-size: 11pt;">উপজেলা/থানা: ${getValue(madrasah.address.subDistrict_policeStation)}</span>
             
          </div>
          <div style="display: flex; justify-content: space-between; margin: 1mm 0px;">
                     <span style="font-size: 11pt;">জেলা: ${getValue(madrasah.address.district)}</span>
                      <div>
                      <span style="font-size: 11pt;">মোবা: ${convertToBengali(getValue(madrasah.contactNo1))}</span>
                      <span style="font-size: 11pt;">${getValue(madrasah.contactNo2)?`- ${convertToBengali(getValue(madrasah.contactNo2))}` : ''}</span>
                      </div>
          </div>
        </div>      
      `
        )
        .join('')}
    </div>
  `
}

export function generatePrintHeader() {
  return `
    <div class="print-header" style="text-align: center;  position: relative; top: 0; left: 0; width: 100%">
      <div class="print-header-logo" >
     <img src="/logo-print.jpg" alt="logo" style="width: 100px; height: 100px;">
     </div>

      <div>
      <h3>Befaqul Madarisiddinia Bangladesh / وفـاق المدارس الدينية بنغلاديش</h3>
      <h1>জাতীয় দ্বীনি মাদরাসা শিক্ষাবোর্ড বাংলাদেশ</h1>
      <h2>[বেফাকুল মাদারিসিদ্দীনিয়্যা বাংলাদেশ]</h2>
      <p>অস্থায়ী কার্যালয় : ৩৪১/৫ টি ডি রোড, পূর্ব রামপুরা, ঢাকা-১২১৯</p>
      <p>০১৮৪১-৪১৯০০৫ (অফিস) ০১৮৪১-৪১৯০০৩ (পরীক্ষা বিভাগ)</p>
      </div>

    </div>


    <div class="print-header-divider"></div>
        

    </div>
  `
}
