import { Madrasah } from "@/services/madrasahService";

export function generatePrintContent(madrasahs: Madrasah[], type: 'list' | 'addresses') {
  if (type === 'list') {
    return generateMadrasahListContent(madrasahs);
  } else {
    return generateAddressesContent(madrasahs);
  }
}

// this generateMadrasahListContent just perfect, don't touch it until i tell you
function generateMadrasahListContent(madrasahs: Madrasah[]) {
  // Helper function to handle null/undefined values
  const getValue = (value: string | null | undefined) => value || '-';

  return `
    <div style="text-align: center; margin-bottom: 10mm;">
      <h1 style="font-size: 18pt; font-weight: bold; margin-bottom: 4mm;">জাতীয় দ্বীনি মাদরাসা শিক্ষাবোর্ড</h1>
      <p style="font-size: 11pt; margin-bottom: 4mm;">অস্থায়ী কার্যালয় : ৩৪১/৫ টি ডি রোড, রামপুরা, ঢাকা</p>
      <h2 style="font-size: 14pt; font-weight: bold; border: 1px solid #000; padding: 2mm 4mm; display: inline-block;">মাদরাসা তালিকা</h2>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 5mm;">
      <thead>
        <tr>
          <th style="border: 1px solid black; padding: 2mm; font-size: 11pt; text-align: center;">ক্রমিক</th>
          <th style="border: 1px solid black; padding: 2mm; font-size: 11pt; text-align: center;">কোড</th>
          <th style="border: 1px solid black; padding: 2mm; font-size: 11pt; text-align: center;">মাদরাসার নাম</th>
          <th style="border: 1px solid black; padding: 2mm; font-size: 11pt; text-align: center;">ঠিকানা</th>
          <th style="border: 1px solid black; padding: 2mm; font-size: 11pt; text-align: center;">মুহতামিম</th>
          <th style="border: 1px solid black; padding: 2mm; font-size: 11pt; text-align: center;">মোবাইল</th>
        </tr>
      </thead>
      <tbody>
        ${madrasahs.map((madrasah, index) => `
          <tr>
            <td style="border: 1px solid black; padding: 2mm; font-size: 10pt; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid black; padding: 2mm; font-size: 10pt; text-align: center;">${getValue(madrasah.code)}</td>
            <td style="border: 1px solid black; padding: 2mm; font-size: 10pt; text-align: center;">${getValue(madrasah.madrasahNames.bengaliName)}</td>
            <td style="border: 1px solid black; padding: 2mm; font-size: 10pt; text-align: center;">
              ${getValue(madrasah.address.village)}, 
              ${getValue(madrasah.address.policeStation)}, 
              ${getValue(madrasah.address.subDistrict)}, 
              ${getValue(madrasah.address.district)}
            </td>

            <td style="border: 1px solid black; padding: 2mm; font-size: 10pt; text-align: center;">${getValue(madrasah?.muhtamim?.name)}</td>
            <td style="border: 1px solid black; padding: 2mm; font-size: 10pt; text-align: center;">
              ${getValue(madrasah.contactNo1)}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function generateAddressesContent(madrasahs: Madrasah[]) {
  // Helper function to handle null/undefined values
  const getValue = (value: string | null | undefined) => value || '-';

  return `
    <div style="width: 100%; max-width: 210mm; margin: 0 auto; padding: 10mm; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 5mm;">
      ${madrasahs.map((madrasah) => `
        <div style="padding: 4mm; border: 2px solid black; break-inside: avoid; box-sizing: border-box; font-size: 11pt;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3mm;">
            <span style="font-size: 11pt;">মুহতামিম,</span>
            <span style="font-size: 11pt;">কোড নং- ${getValue(madrasah.code)}</span>
          </div>
          <div style="font-size: 11pt; margin-bottom: 2mm;">${getValue(madrasah?.muhtamim?.name)}</div>
          <div style="font-size: 12pt; font-weight: bold; margin: 3mm 0px;">${getValue(madrasah.madrasahNames.bengaliName)}</div>
          <div style="display: flex; justify-content: space-between; margin: 2mm 0px;">
            <span style="font-size: 11pt;">গ্রাম/মহল্লা: ${getValue(madrasah.address.village)}</span>
            <span style="font-size: 11pt;">ডাক: ${getValue(madrasah.address.policeStation)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 2mm 0px;">
            <span style="font-size: 11pt;">থানা: ${getValue(madrasah.address.subDistrict)}</span>
            <span style="font-size: 11pt;">জেলা: ${getValue(madrasah.address.district)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 2mm 0px;">
            <span style="font-size: 10pt;">মোবাইল-১: ${getValue(madrasah.contactNo1)}</span>
            <span style="font-size: 10pt;">মোবাইল-২: ${getValue(madrasah.contactNo2)}</span>
          </div>
        </div>      
      `).join('')}
    </div>
  `;
}

// Legacy functions for backward compatibility
export function printMadrasahList(madrasahs: Madrasah[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const content = generateMadrasahListContent(madrasahs);
  printWindow.document.write(`
    <html>
      <head>
        <title>মাদরাসা তালিকা</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function printAddresses(madrasahs: Madrasah[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const content = generateAddressesContent(madrasahs);
  printWindow.document.write(`
    <html>
      <head>
        <title>মাদরাসা ঠিকানা তালিকা</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
}
