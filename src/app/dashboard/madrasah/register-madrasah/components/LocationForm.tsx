'use client';

import React from 'react';
import { zones } from '../zoneData';
import { districts, divisions, policeStations, subDistricts } from '../locationData';

interface LocationFormProps {
  formData: {
    division: string;
    district: string;
    subDistrict: string;
    policeStation: string;
    postOffice: string;
    village: string;
    holdingNumber: string;
    zone: string;
    courierOption: string;
  };
  handleChange: (field: string, value: string) => void;
}


// কুরিয়ার অপশন
const courierOptions = ["ডাক", "কুরিয়ার"];

/**
 * LocationForm Component
 * Handles the location and address section of the madrasah registration form
 * Including division, district, upazila, and detailed address information
 */
const LocationForm: React.FC<LocationFormProps> = ({ formData, handleChange }) => {
  // Get filtered location data based on selections
  const filteredDistricts = formData.division ? districts[formData.division] || [] : [];
  const filteredSubDistricts = formData.district ? subDistricts[formData.district] || [] : [];
  const filteredPoliceStations = formData.subDistrict ? policeStations[formData.subDistrict] || [] : [];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">ঠিকানা</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Division Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">বিভাগ</label>
          <select
            value={formData.division}
            onChange={(e) => handleChange('division', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="">বিভাগ নির্বাচন করুন</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>

        {/* District Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">জেলা</label>
          <select
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="">জেলা নির্বাচন করুন</option>
            {filteredDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-District Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">উপজেলা</label>
          <select
            value={formData.subDistrict}
            onChange={(e) => handleChange('subDistrict', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="">উপজেলা নির্বাচন করুন</option>
            {filteredSubDistricts.map((subDistrict) => (
              <option key={subDistrict} value={subDistrict}>
                {subDistrict}
              </option>
            ))}
          </select>
        </div>

        {/* Police Station Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">থানা</label>
          <select
            value={formData.policeStation}
            onChange={(e) => handleChange('policeStation', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="">থানা নির্বাচন করুন</option>
            {filteredPoliceStations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        {/* Detailed Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">পোস্ট অফিস</label>
          <input
            type="text"
            placeholder="পোস্ট অফিস লিখুন"
            value={formData.postOffice}
            onChange={(e) => handleChange('postOffice', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">গ্রাম/মহল্লা</label>
          <input
            type="text"
            placeholder="গ্রাম/মহল্লা লিখুন"
            value={formData.village}
            onChange={(e) => handleChange('village', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">হোল্ডিং নম্বর</label>
          <input
            type="text"
            placeholder="হোল্ডিং নম্বর লিখুন"
            value={formData.holdingNumber}
            onChange={(e) => handleChange('holdingNumber', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

                {/* zone  */}
        <div>
          <label className="block text-sm font-medium text-gray-700">জোন</label>
          <select
            value={formData?.zone}
            onChange={(e) => handleChange('zone', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            {zones?.map((zone) => (
              <option key={zone} value={zone}>
                {zone}

              </option>
            ))}

            
          </select>
        </div>
                {/* currier options  */}
        <div>
          <label className="block text-sm font-medium text-gray-700">চিঠি প্রেরণের মাধ্যম</label>
          <select
            value={formData?.courierOption}
            onChange={(e) => handleChange('zone', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            {courierOptions?.map((courierOption) => (
              <option key={courierOption} value={courierOption}>
                {courierOption}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
