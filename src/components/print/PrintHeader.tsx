
interface PrintHeaderProps {
    title?: string
  }
  
   function PrintHeader() {
    return (
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">জাতীয় দ্বীনি মাদরাসা শিক্ষাবোর্ড বাংলাদেশ</h1>
        <p className="text-sm mb-1">অস্থায়ী কার্যালয় : অস্থায়ী কার্যালয় : ৩৪১/৫ টি ডি রোড, পূর্ব রামপুরা, ঢাকা-১২১৯</p>
        <p className="text-sm mb-4">(টেলিফন) ০১৮১১-৪১৯০০৩ (পরীক্ষা বিভাগ) ০১৮১১-৪১৯০০৪</p>
        <div className="w-full border-t border-b border-black my-4"></div>
      </div>
    )
  }

  export default PrintHeader;