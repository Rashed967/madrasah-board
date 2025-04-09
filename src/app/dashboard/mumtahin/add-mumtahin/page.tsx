"use client";
import { useState, useEffect } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { createHallGuard } from '@/features/mumtahin/mumtahin.service';
import { getAllMadrasahs } from '@/services/madrasahService';
import { getAllMarhalas } from '@/features/marhala/marhala.service';
import { getAllKitabs } from '@/features/kitab/kitab.service';

const AddMumtahinPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    nagadAccountNo: '',
    // For madrasah, store selected _id
    madrasah: '',
    hallGuardType: 'হলগার্ড',
    // For marhala (education qualification) and kitab (teaching qualification)
    educationalQualification: '',
    teachingQualification: '',
    // Note: status is no longer included
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  /*** Madrasah Autocomplete State ***/
  const [madrasahQuery, setMadrasahQuery] = useState('');
  const [filteredMadrasahs, setFilteredMadrasahs] = useState<any[]>([]);
  const [showMadrasahSuggestions, setShowMadrasahSuggestions] = useState(false);

  /*** Marhala & Kitab Options ***/
  const [marhalaOptions, setMarhalaOptions] = useState<any[]>([]);
  const [kitabOptions, setKitabOptions] = useState<any[]>([]);

  // Fetch initial madrasahs if needed (can be used for pre-loading, but here we still use query search)
  useEffect(() => {
    // We don't pre-load madrasahs; they are fetched by query.
  }, []);

  // Fetch all marhalas on component mount for the select field.
  useEffect(() => {
    const fetchMarhalas = async () => {
      try {
        const res = await getAllMarhalas("");
        if (res.success && res.data) {
          setMarhalaOptions(res.data);
        }
      } catch (err) {
        console.error("Error fetching marhalas", err);
      }
    };
    fetchMarhalas();
  }, []);

  // Fetch all kitabs on component mount for the select field.
  useEffect(() => {
    const fetchKitabs = async () => {
      try {
        const res = await getAllKitabs();
        if (res.success && res.data) {
          setKitabOptions(res.data);
        }
      } catch (err) {
        console.error("Error fetching kitabs", err);
      }
    };
    fetchKitabs();
  }, []);

  // Madrasah search: fetch from server when query is 3 or more characters.
  const fetchMadrasahsByQuery = async (query: string) => {
    try {
      const res = await getAllMadrasahs(query);
      if (res.success && res.data) {
        setFilteredMadrasahs(res.data);
        setShowMadrasahSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching madrasahs", err);
    }
  };

  // Handle madrasah input change
  const handleMadrasahInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMadrasahQuery(value);
    // Reset selected madrasah id if user changes input
    setFormData({ ...formData, madrasah: '' });
    if (value.length >= 3) {
      fetchMadrasahsByQuery(value);
    } else {
      setFilteredMadrasahs([]);
      setShowMadrasahSuggestions(false);
    }
  };

  const selectMadrasah = (madrasah: any) => {
    // Use madrasahNames.bengaliName instead of m.name
    const displayText = `${madrasah.madrasahNames?.bengaliName || ""} - ${madrasah.code || ""}`;
    setMadrasahQuery(displayText);
    setFormData({ ...formData, madrasah: madrasah._id });
    setShowMadrasahSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    const res = await createHallGuard(formData);
    setLoading(false);
    if (res.success) {
      toast.success("হলগার্ড সফলভাবে তৈরি হয়েছে");
      setFormData({
        name: "",
        contactNo: "",
        nagadAccountNo: "",
        madrasah: "",
        hallGuardType: "হলগার্ড",
        educationalQualification: "",
        teachingQualification: "",
      });
      setMadrasahQuery("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
    <Toaster />
    <div className="p-6 m-6 bg-gray-100">
      <h1 className="text-lg font-bold mb-6">পরীক্ষক নিবন্ধন</h1>
      <form onSubmit={handleSubmit} className="md:grid md:grid-cols-2 gap-4">
        
          {/* Name Input */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">নাম</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded p-2 w-full text-gray-700"
              placeholder="নাম লিখুন"
              required
            />
          </div>
          {/* Mobile */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">মোবাইল (Contact No.)</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="border rounded p-2 w-full text-gray-700"
              placeholder="মোবাইল নম্বর লিখুন"
              required
            />
          </div>
          {/* Nagad Account No */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">নগদ একাউন্ট নম্বর</label>
            <input
              type="text"
              name="nagadAccountNo"
              value={formData.nagadAccountNo}
              onChange={handleChange}
              className="border rounded p-2 w-full text-gray-700"
              placeholder="নগদ একাউন্ট নম্বর লিখুন"
              required
            />
          </div>
          {/* Madrasah Autocomplete Input */}
          <div >
            <label className="block mb-1 font-medium text-gray-800">মাদরাসা</label>
            <input
              type="text"
              name="madrasahInput"
              value={madrasahQuery}
              onChange={handleMadrasahInputChange}
              onFocus={() => {
                if (madrasahQuery.length >= 3) setShowMadrasahSuggestions(true);
              }}
              className="border rounded p-2 w-full text-gray-700"
              placeholder="কমপক্ষে ৩টি অক্ষর টাইপ করুন"
              autoComplete="off"
              required
            />
            {showMadrasahSuggestions && filteredMadrasahs.length > 0 && (
              <div className="absolute z-10 bg-white border rounded w-full max-h-60 overflow-y-auto">
                {filteredMadrasahs.map((m) => {
                  const displayText = `${m.madrasahNames?.bengaliName || ""} - ${m.code || ""}`;
                  return (
                    <div
                      key={m._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectMadrasah(m)}
                    >
                      {displayText}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
     
        {/* Right Column */}
      
          {/* Hall Guard Type */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">হলগার্ড টাইপ</label>
            <select
              name="hallGuardType"
              value={formData.hallGuardType}
              onChange={handleChange}
              className="border rounded p-2 w-full text-gray-700"
            >
              <option value="হলগার্ড">হলগার্ড</option>
              <option value="পরীক্ষক">পরীক্ষক</option>
              <option value="উভয়">উভয়</option>
            </select>
          </div>
          {/* Marhala Select for Education Qualification */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">শিক্ষা যোগ্যতা (মারহালা)</label>
            <select
              name="educationalQualification"
              value={formData.educationalQualification}
              onChange={handleChange}
              className="border rounded p-2 w-full text-gray-700"
              required
            >
              <option value="">মারহালা নির্বাচন করুন</option>
              {marhalaOptions.map((m) => {
                const displayText = `${m.name?.bengaliName || ""} - ${m.code || ""}`;
                return (
                  <option key={m._id} value={m._id}>
                    {displayText}
                  </option>
                );
              })}
            </select>
          </div>
          {/* Kitab Select for Teaching Qualification */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">শিক্ষক যোগ্যতা (কিতাব)</label>
            <select
              name="teachingQualification"
              value={formData.teachingQualification}
              onChange={handleChange}
              className="border rounded p-2 w-full text-gray-700"
              required
            >
              <option value="">কিতাব নির্বাচন করুন</option>
              {kitabOptions.map((k) => {
                // Assuming kitab object has similar structure with name and code fields.
                const displayText = `${k.name?.bengaliName || k.name || ""} - ${k.code || ""}`;
                return (
                  <option key={k._id} value={k._id}>
                    {displayText}
                  </option>
                );
              })}
            </select>
          </div>

        {/* Full-width Submit Section */}
        <div className="col-span-2 flex justify-center mt-2">
          {/* Error & Success Messages */}
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#52B788] text-white rounded px-4 py-2 hover:bg-[#52B788]/70 w-full md:w-2/3"
            disabled={loading}
          >
            {loading ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
          </button>
        </div>
        
      </form>
      </div>
    </>
  );
};

export default AddMumtahinPage;
