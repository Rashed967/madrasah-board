'use client';

import React, { useEffect, useState } from 'react';
import { districts, divisions } from '../locationData';
import subDistricts from '../../../../../data/subDistricts.json';
import policeStations from '../../../../../data/policeStations.json';
import { getAllZones } from '@/services/zoneService';

// কুরিয়ার অপশন
const courierAddressOptions = ["ডাক", "কুরিয়ার"];

interface LocationFormProps {
  formData: {
    division: string;
    district: string;
    subDistrict: string;
    policeStation: string;
    village: string;
    holdingNumber: string;
    zone: string;
    courierAddress: string;
  };
  handleChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

/**
 * LocationForm Component
 * Handles the location and address section of the madrasah registration form
 * Including division, district, upazila, and detailed address information
 */
const LocationForm: React.FC<LocationFormProps> = ({ formData, handleChange, errors = {} }) => {
  const [zones, setZones] = useState([]);
  const [isLoadingZones, setIsLoadingZones] = useState(true);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const response = await getAllZones();
        setZones(response.data);
      } catch (error) {
        console.error('Failed to load zones:', error);
      } finally {
        setIsLoadingZones(false);
      }
    };

    loadZones();
  }, []);

  // Get filtered location data based on selections
  const filteredDistricts = formData.division ? districts[formData.division] || [] : [];
  const filteredSubDistricts = formData.district ? subDistricts[formData.district] || [] : [];
  const filteredPoliceStations = formData.subDistrict && formData.district ? 
    (policeStations[formData.district]?.[formData.subDistrict] || []) : [];
  
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
            className={`mt-1 block w-full rounded-md border ${errors.division ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">বিভাগ নির্বাচন করুন</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
          {errors.division && (
            <p className="mt-1 text-sm text-red-500">{errors.division}</p>
          )}
        </div>

        {/* District Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">জেলা</label>
          <select
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.district ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">জেলা নির্বাচন করুন</option>
            {filteredDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-sm text-red-500">{errors.district}</p>
          )}
        </div>

        {/* Sub-District Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">উপজেলা</label>
          <select
            value={formData.subDistrict}
            onChange={(e) => handleChange('subDistrict', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.subDistrict ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">উপজেলা নির্বাচন করুন</option>
            {filteredSubDistricts.map((subDistrict) => (
              <option key={subDistrict} value={subDistrict}>
                {subDistrict}
              </option>
            ))}
          </select>
          {errors.subDistrict && (
            <p className="mt-1 text-sm text-red-500">{errors.subDistrict}</p>
          )}
        </div>

        {/* Police Station Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">থানা</label>
          <select
            value={formData.policeStation}
            onChange={(e) => handleChange('policeStation', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.policeStation ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">থানা নির্বাচন করুন</option>
            {filteredPoliceStations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
          {errors.policeStation && (
            <p className="mt-1 text-sm text-red-500">{errors.policeStation}</p>
          )}
        </div>

        {/* Village */}
        <div>
          <label className="block text-sm font-medium text-gray-700">গ্রাম/মহল্লা</label>
          <input
            type="text"
            placeholder="গ্রাম/মহল্লা লিখুন"
            value={formData.village}
            onChange={(e) => handleChange('village', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.village ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          />
          {errors.village && (
            <p className="mt-1 text-sm text-red-500">{errors.village}</p>
          )}
        </div>

        {/* Holding Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">হোল্ডিং নম্বর</label>
          <input
            type="text"
            placeholder="হোল্ডিং নম্বর লিখুন"
            value={formData.holdingNumber}
            onChange={(e) => handleChange('holdingNumber', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.holdingNumber ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          />
          {errors.holdingNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.holdingNumber}</p>
          )}
        </div>

        {/* Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">জোন</label>
          <select
            value={formData.zone}
            onChange={(e) => handleChange('zone', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.zone ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">জোন নির্বাচন করুন</option>
            {isLoadingZones ? (
              <option value="" disabled>লোড হচ্ছে...</option>
            ) : (
              zones.map((zone) => (
                <option key={zone._id} value={zone._id}>
                  {zone.name}
                </option>
              ))
            )}
          </select>
          {errors.zone && (
            <p className="mt-1 text-sm text-red-500">{errors.zone}</p>
          )}
        </div>

        {/* Courier Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">চিঠি প্রেরণের মাধ্যম</label>
          <select
            value={formData.courierAddress}
            onChange={(e) => handleChange('courierAddress', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${errors.courierAddress ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">চিঠি প্রেরণের মাধ্যম</option>
            {courierAddressOptions?.map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
          </select>
          {errors.courierAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.courierAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
