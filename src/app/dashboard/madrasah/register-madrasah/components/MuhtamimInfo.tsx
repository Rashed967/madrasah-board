'use client';

import { IMuhtamim } from '@/features/madrasah/interfaces';
import React from 'react';

interface Props {
  formData: {
    muhtamim: IMuhtamim;
  };
  handleChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

/**
 * StaffInfoForm Component
 * Handles the staff information section of the madrasah registration form
 * Including Muhtamim, Shikkha Socheeb, and Shovapoti details
 */
export default function MuhtamimInfo({ formData, handleChange, errors }: Props) {

  return (
    <div className="p-6 sace-y-4">
     <div>
     <h2 className="text-base md:text-lg font-semibold mb-4">মুহতামিমের তথ্য</h2>
     </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
            নাম
          </label>
          <input
            type="text"
            value={formData.muhtamim.name}
            onChange={(e) => handleChange('muhtamim.name', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['muhtamim.name'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="মুহতামিমের নাম"
          />
          {errors?.['muhtamim.name'] && (
            <p className="text-red-500 text-xs italic">{errors['muhtamim.name']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
            এনআইডি নম্বর
          </label>
          <input
            type="text"
            value={formData.muhtamim.nidNumber}
            onChange={(e) => handleChange('muhtamim.nidNumber', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['muhtamim.nidNumber'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="এনআইডি নম্বর"
          />
          {errors?.['muhtamim.nidNumber'] && (
            <p className="text-red-500 text-xs italic">{errors['muhtamim.nidNumber']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
            মোবাইল নম্বর
          </label>
          <input
            type="text"
            value={formData.muhtamim.contactNo}
            onChange={(e) => handleChange('muhtamim.contactNo', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['muhtamim.contactNo'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="মোবাইল নম্বর"
          />
          {errors?.['muhtamim.contactNo'] && (
            <p className="text-red-500 text-xs italic">{errors['muhtamim.contactNo']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm md:text-base lg:text font-bold mb-2">
            শিক্ষাগত যোগ্যতা
          </label>
          <input
            type="text"
            value={formData.muhtamim.highestEducationalQualification}
            onChange={(e) => handleChange('muhtamim.highestEducationalQualification', e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors?.['muhtamim.highestEducationalQualification'] ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-xs md:text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
            placeholder="শিক্ষাগত যোগ্যতা"
          />
          {errors?.['muhtamim.highestEducationalQualification'] && (
            <p className="text-red-500 text-xs italic">{errors['muhtamim.highestEducationalQualification']}</p>
          )}
        </div>
      </div>
    </div>
  );
}
