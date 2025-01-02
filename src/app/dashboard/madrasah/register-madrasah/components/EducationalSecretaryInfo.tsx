'use client';

import React from 'react';

interface Props {
  formData: {
    educational_secretory: {
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

export default function EducationalSecretaryInfo({ formData, onChange, errors }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">শিক্ষা সচিবের তথ্য</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            নাম
          </label>
          <input
            type="text"
            value={formData.educational_secretory.name}
            onChange={(e) => onChange('educational_secretory.name', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="শিক্ষা সচিবের নাম"
          />
          {errors?.['educational_secretory.name'] && (
            <p className="text-red-500 text-xs italic">{errors['educational_secretory.name']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            এনআইডি নম্বর
          </label>
          <input
            type="text"
            value={formData.educational_secretory.nidNumber}
            onChange={(e) => onChange('educational_secretory.nidNumber', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="এনআইডি নম্বর"
          />
          {errors?.['educational_secretory.nidNumber'] && (
            <p className="text-red-500 text-xs italic">{errors['educational_secretory.nidNumber']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            মোবাইল নম্বর
          </label>
          <input
            type="text"
            value={formData.educational_secretory.contactNo}
            onChange={(e) => onChange('educational_secretory.contactNo', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="মোবাইল নম্বর"
          />
          {errors?.['educational_secretory.contactNo'] && (
            <p className="text-red-500 text-xs italic">{errors['educational_secretory.contactNo']}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            শিক্ষাগত যোগ্যতা
          </label>
          <input
            type="text"
            value={formData.educational_secretory.highestEducationalQualification}
            onChange={(e) => onChange('educational_secretory.highestEducationalQualification', e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="শিক্ষাগত যোগ্যতা"
          />
          {errors?.['educational_secretory.highestEducationalQualification'] && (
            <p className="text-red-500 text-xs italic">{errors['educational_secretory.highestEducationalQualification']}</p>
          )}
        </div>
      </div>
    </div>
  );
}
