'use client';

import React from 'react';

interface Props {
  formData: {
    chairman_mutawalli: {
      name: string;
      contactNo: string;
      nidNumber: string;
      highestEducationalQualification: string;
      code?: string;
    };
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export default function ChairmanInfo({ formData, onChange, errors }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">সভাপতি/মুতাওয়াল্লীর তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            নাম
          </label>
          <input
            type="text"
            value={formData.chairman_mutawalli.name}
            onChange={(e) => onChange('chairman_mutawalli.name', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="সভাপতি/মুতাওয়াল্লীর নাম"
          />
          {errors?.['chairman_mutawalli.name'] && (
            <p className="text-red-500 text-xs italic">{errors['chairman_mutawalli.name']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            এনআইডি নম্বর
          </label>
          <input
            type="text"
            value={formData.chairman_mutawalli.nidNumber}
            onChange={(e) => onChange('chairman_mutawalli.nidNumber', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="এনআইডি নম্বর"
          />
          {errors?.['chairman_mutawalli.nidNumber'] && (
            <p className="text-red-500 text-xs italic">{errors['chairman_mutawalli.nidNumber']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            মোবাইল নম্বর
          </label>
          <input
            type="text"
            value={formData.chairman_mutawalli.contactNo}
            onChange={(e) => onChange('chairman_mutawalli.contactNo', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="মোবাইল নম্বর"
          />
          {errors?.['chairman_mutawalli.contactNo'] && (
            <p className="text-red-500 text-xs italic">{errors['chairman_mutawalli.contactNo']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            শিক্ষাগত যোগ্যতা
          </label>
          <input
            type="text"
            value={formData.chairman_mutawalli.highestEducationalQualification}
            onChange={(e) => onChange('chairman_mutawalli.highestEducationalQualification', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="শিক্ষাগত যোগ্যতা"
          />
          {errors?.['chairman_mutawalli.highestEducationalQualification'] && (
            <p className="text-red-500 text-xs italic">{errors['chairman_mutawalli.highestEducationalQualification']}</p>
          )}
        </div>
      </div>
    </div>
  );
}
