import { IMadrasah } from "@/features/madrasah/interfaces/madrasah.interface";

export function generatePrintContent(madrasahs: IMadrasah[], type: 'list' | 'addresses') {
  if (type === 'list') {
    return generateMadrasahListContent(madrasahs);
  } else {
    return generateAddressesContent(madrasahs);
  }
}

function generateMadrasahListContent(madrasahs: IMadrasah[]) {
  let content = '';

  madrasahs.forEach((madrasah, index) => {
    content += `${index + 1}. ${madrasah.madrasahNames.bengaliName}\n`;
    content += `   কোড: ${madrasah.code}\n`;
    content += `   ঠিকানা: ${madrasah.address.village}, ${madrasah.address.policeStation}, ${madrasah.address.subDistrict}, ${madrasah.address.district}\n`;
    content += `   মুহতামিম: ${madrasah.muhtamim.name}\n`;
    content += `   যোগাযোগ: ${madrasah.contactNo1}\n`;
    content += '\n';
  });

  return content;
}

function generateAddressesContent(madrasahs: IMadrasah[]) {
  let content = '';

  madrasahs.forEach((madrasah, index) => {
    content += `${index + 1}. ${madrasah.madrasahNames.bengaliName}\n`;
    content += `   ${madrasah.address.village}\n`;
    content += `   ${madrasah.address.policeStation}\n`;
    content += `   ${madrasah.address.subDistrict}\n`;
    content += `   ${madrasah.address.district}\n`;
    content += '\n';
  });

  return content;
}

// Legacy functions for backward compatibility
export function printMadrasahList(madrasahs: IMadrasah[]) {
  const content = generateMadrasahListContent(madrasahs);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>মাদ্রাসা তালিকা</title>
          <style>
            body { font-family: 'SutonnyMJ', Arial, sans-serif; white-space: pre-wrap; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}

export function printAddresses(madrasahs: IMadrasah[]) {
  const content = generateAddressesContent(madrasahs);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>ঠিকানা তালিকা</title>
          <style>
            body { font-family: 'SutonnyMJ', Arial, sans-serif; white-space: pre-wrap; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
