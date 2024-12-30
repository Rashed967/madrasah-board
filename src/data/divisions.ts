export const divisions = {
  "ঢাকা": {
    "ঢাকা": true,
    "গাজীপুর": true,
    "নারায়ণগঞ্জ": true,
    "মানিকগঞ্জ": true,
    "মুন্সিগঞ্জ": true,
    "নরসিংদী": true,
    "কিশোরগঞ্জ": true,
    "টাঙ্গাইল": true,
    "ফরিদপুর": true,
    "মাদারীপুর": true,
    "শরীয়তপুর": true,
    "রাজবাড়ী": true,
    "গোপালগঞ্জ": true
  },
  "চট্টগ্রাম": {
    "চট্টগ্রাম": true,
    "কক্সবাজার": true,
    "রাঙ্গামাটি": true,
    "বান্দরবান": true,
    "খাগড়াছড়ি": true,
    "ফেনী": true,
    "লক্ষ্মীপুর": true,
    "নোয়াখালী": true,
    "ব্রাহ্মণবাড়িয়া": true,
    "কুমিল্লা": true,
    "চাঁদপুর": true
  },
  "রাজশাহী": {
    "রাজশাহী": true,
    "নওগাঁ": true,
    "নাটোর": true,
    "চাঁপাইনবাবগঞ্জ": true,
    "পাবনা": true,
    "সিরাজগঞ্জ": true,
    "বগুড়া": true,
    "জয়পুরহাট": true
  },
  "খুলনা": {
    "খুলনা": true,
    "বাগেরহাট": true,
    "সাতক্ষীরা": true,
    "যশোর": true,
    "নড়াইল": true,
    "মাগুরা": true,
    "কুষ্টিয়া": true,
    "মেহেরপুর": true,
    "চুয়াডাঙ্গা": true,
    "ঝিনাইদহ": true
  },
  "বরিশাল": {
    "বরিশাল": true,
    "ভোলা": true,
    "পটুয়াখালী": true,
    "পিরোজপুর": true,
    "ঝালকাঠি": true,
    "বরগুনা": true
  },
  "সিলেট": {
    "সিলেট": true,
    "মৌলভীবাজার": true,
    "হবিগঞ্জ": true,
    "সুনামগঞ্জ": true
  },
  "রংপুর": {
    "রংপুর": true,
    "দিনাজপুর": true,
    "কুড়িগ্রাম": true,
    "গাইবান্ধা": true,
    "লালমনিরহাট": true,
    "নীলফামারী": true,
    "পঞ্চগড়": true,
    "ঠাকুরগাঁও": true
  },
  "ময়মনসিংহ": {
    "ময়মনসিংহ": true,
    "জামালপুর": true,
    "শেরপুর": true,
    "নেত্রকোনা": true
  }
} as const;

export type Division = keyof typeof divisions;
export type District = {
  [K in Division]: keyof typeof divisions[K];
}[Division];
