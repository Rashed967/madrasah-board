'use client';

import React, { useEffect, useState } from 'react';
import { divisions, getDistricts, getSubDistricts, getPoliceStations } from '@/data/locations';
import { IMadrasahAddress } from '@/features/madrasah/interfaces';
import { getAllZones } from '@/features/zone';

interface Props {
  formData: {
    address: IMadrasahAddress;
  };
  handleChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const courierTypes = ['কুরিয়ার', 'ডাক'];

/**
 * LocationForm Component
 * Handles the location and address section of the madrasah registration form
 * Including division, district, upazila, and detailed address information
 */
const LocationForm: React.FC<Props> = ({ formData, handleChange, errors }) => {
  const [zones, setZones] = useState([]);
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subDistricts, setSubDistricts] = useState<string[]>([]);
  const [policeStationList, setPoliceStationList] = useState<string[]>([]);

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

  // Update districts when division changes
  useEffect(() => {
    if (formData.address.division) {
      const districtList = getDistricts(formData.address.division);
      setDistricts(districtList);
      // Reset dependent fields
      if (formData.address.district) {
        handleChange('address.district', '');
        handleChange('address.subDistrict', '');
        handleChange('address.policeStation', '');
      }
    } else {
      setDistricts([]);
    }
  }, [formData.address.division]);

  // Update subdistricts when district changes
  useEffect(() => {
    if (formData.address.district) {
      const subDistrictList = getSubDistricts(formData.address.district);
      setSubDistricts(subDistrictList);
      // Reset dependent fields
      if (formData.address.subDistrict) {
        handleChange('address.subDistrict', '');
        handleChange('address.policeStation', '');
      }
    } else {
      setSubDistricts([]);
    }
  }, [formData.address.district]);

  // Update police stations when subdistrict changes
  useEffect(() => {
    if (formData.address.district && formData.address.subDistrict) {
      const policeStations = getPoliceStations(formData.address.district, formData.address.subDistrict);
      setPoliceStationList(policeStations);
      // Reset dependent field
      if (formData.address.policeStation) {
        handleChange('address.policeStation', '');
      }
    } else {
      setPoliceStationList([]);
    }
  }, [formData.address.district, formData.address.subDistrict]);

  return (
    <div className="mb-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">ঠিকানা</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Division Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            বিভাগ <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.address.division}
            onChange={(e) => handleChange('address.division', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.division'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">বিভাগ নির্বাচন করুন</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
          {errors?.['address.division'] && (
            <p className="text-red-500 text-xs italic">{errors['address.division']}</p>
          )}
        </div>

        {/* District Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            জেলা <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.address.district}
            onChange={(e) => handleChange('address.district', e.target.value)}
            disabled={!formData.address.division}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.district'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${
              !formData.address.division ? 'bg-gray-100' : ''
            }`}
          >
            <option value="">জেলা নির্বাচন করুন</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors?.['address.district'] && (
            <p className="text-red-500 text-xs italic">{errors['address.district']}</p>
          )}
        </div>

        {/* Sub-District Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            উপজেলা <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.address.subDistrict}
            onChange={(e) => handleChange('address.subDistrict', e.target.value)}
            disabled={!formData.address.district}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.subDistrict'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${
              !formData.address.district ? 'bg-gray-100' : ''
            }`}
          >
            <option value="">উপজেলা নির্বাচন করুন</option>
            {subDistricts.map((subDistrict) => (
              <option key={subDistrict} value={subDistrict}>
                {subDistrict}
              </option>
            ))}
          </select>
          {errors?.['address.subDistrict'] && (
            <p className="text-red-500 text-xs italic">{errors['address.subDistrict']}</p>
          )}
        </div>

        {/* Police Station Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            থানা <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.address.policeStation}
            onChange={(e) => handleChange('address.policeStation', e.target.value)}
            disabled={!formData.address.subDistrict}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.policeStation'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${
              !formData.address.subDistrict ? 'bg-gray-100' : ''
            }`}
          >
            <option value="">থানা নির্বাচন করুন</option>
            {policeStationList.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
          {errors?.['address.policeStation'] && (
            <p className="text-red-500 text-xs italic">{errors['address.policeStation']}</p>
          )}
        </div>

        {/* Village */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            গ্রাম/মহল্লা <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.village}
            onChange={(e) => handleChange('address.village', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.village'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="গ্রাম/মহল্লা"
          />
          {errors?.['address.village'] && (
            <p className="text-red-500 text-xs italic">{errors['address.village']}</p>
          )}
        </div>

        {/* Holding Number */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            হোল্ডিং নম্বর <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.holdingNumber}
            onChange={(e) => handleChange('address.holdingNumber', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.holdingNumber'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="হোল্ডিং নম্বর"
          />
          {errors?.['address.holdingNumber'] && (
            <p className="text-red-500 text-xs italic">{errors['address.holdingNumber']}</p>
          )}
        </div>

        {/* Zone */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            জোন <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.address.zone}
            onChange={(e) => handleChange('address.zone', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.zone'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
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
          {errors?.['address.zone'] && (
            <p className="text-red-500 text-xs italic">{errors['address.zone']}</p>
          )}
        </div>


        {/* Courier Type */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
          চিঠি প্রেরণের মাধ্যম <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.address.courierAddress || ''}
            onChange={(e) => handleChange('address.courierAddress', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['address.courierAddress'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-lg focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
          >
            <option value="">চিঠি প্রেরণের মাধ্যম নির্বাচন করুন</option>
            {courierTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors?.['address.courierAddress'] && (
            <p className="text-red-500 text-xs italic">{errors['address.courierAddress']}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
