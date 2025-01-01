import subDistrictsData from './subDistricts.json';
import policeStationsData from './policeStations.json';

// Division list
export const divisions = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ"
];

// Get districts for a division
export const getDistricts = (division: string): string[] => {
  const districts: string[] = [];
  Object.keys(subDistrictsData).forEach(district => {
    if (division === "ঢাকা" && ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "মানিকগঞ্জ", "মুন্সিগঞ্জ", "নরসিংদী", "কিশোরগঞ্জ", "টাঙ্গাইল", "ফরিদপুর", "মাদারীপুর", "শরীয়তপুর", "রাজবাড়ী", "গোপালগঞ্জ"].includes(district)) {
      districts.push(district);
    } else if (division === "চট্টগ্রাম" && ["চট্টগ্রাম", "কক্সবাজার", "রাঙ্গামাটি", "বান্দরবান", "খাগড়াছড়ি", "ফেনী", "লক্ষ্মীপুর", "নোয়াখালী", "ব্রাহ্মণবাড়িয়া", "কুমিল্লা", "চাঁদপুর"].includes(district)) {
      districts.push(district);
    } else if (division === "রাজশাহী" && ["রাজশাহী", "নওগাঁ", "নাটোর", "চাঁপাইনবাবগঞ্জ", "পাবনা", "সিরাজগঞ্জ", "বগুড়া", "জয়পুরহাট"].includes(district)) {
      districts.push(district);
    } else if (division === "খুলনা" && ["খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "নড়াইল", "মাগুরা", "কুষ্টিয়া", "মেহেরপুর", "চুয়াডাঙ্গা", "ঝিনাইদহ"].includes(district)) {
      districts.push(district);
    } else if (division === "বরিশাল" && ["বরিশাল", "ভোলা", "পটুয়াখালী", "পিরোজপুর", "ঝালকাঠি", "বরগুনা"].includes(district)) {
      districts.push(district);
    } else if (division === "সিলেট" && ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ"].includes(district)) {
      districts.push(district);
    } else if (division === "রংপুর" && ["রংপুর", "দিনাজপুর", "কুড়িগ্রাম", "গাইবান্ধা", "লালমনিরহাট", "নীলফামারী", "পঞ্চগড়", "ঠাকুরগাঁও"].includes(district)) {
      districts.push(district);
    } else if (division === "ময়মনসিংহ" && ["ময়মনসিংহ", "জামালপুর", "শেরপুর", "নেত্রকোনা"].includes(district)) {
      districts.push(district);
    }
  });
  return districts;
};

// Get subdistricts for a district
export const getSubDistricts = (district: string): string[] => {
  return district ? (subDistrictsData[district] || []) : [];
};

// Get police stations for a subdistrict
export const getPoliceStations = (district: string, subDistrict: string): string[] => {
  if (!district || !subDistrict) return [];
  const districtData = policeStationsData[district];
  return districtData ? (districtData[subDistrict] || []) : [];
};

// For backward compatibility
export const districts = divisions.reduce((acc, division) => {
  acc[division] = getDistricts(division);
  return acc;
}, {} as { [key: string]: string[] });

export const upazilas = subDistrictsData;

export const policeStations = Object.keys(policeStationsData).reduce((acc, district) => {
  const districtData = policeStationsData[district];
  Object.keys(districtData).forEach(subDistrict => {
    acc[subDistrict] = districtData[subDistrict];
  });
  return acc;
}, {} as { [key: string]: string[] });
