interface PersonCardProps {
  title: string;
  person: {
    name?: string;
    contactNo?: string;
    nidNumber?: string;
    highestEducationalQualification?: string;
    designation?: string;
  } | null;
}

export function PersonCard({ title, person }: PersonCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="font-semibold mb-4 text-gray-800">{title}</h4>
      <div className="space-y-2">
        <p><span className="text-gray-800">নাম:</span> <span className="text-gray-800">{person?.name || '-'}</span></p>
        <p><span className="text-gray-800">যোগাযোগ:</span> <span className="text-gray-800">{person?.contactNo || '-'}</span></p>
        <p><span className="text-gray-800">এনআইডি:</span> <span className="text-gray-800">{person?.nidNumber || '-'}</span></p>
        {person?.highestEducationalQualification && (
          <p><span className="text-gray-800">শিক্ষাগত যোগ্যতা:</span> <span className="text-gray-800">{person.highestEducationalQualification}</span></p>
        )}
        {person?.designation && (
          <p><span className="text-gray-800">পদবি:</span> <span className="text-gray-800">{person.designation}</span></p>
        )}
      </div>
    </div>
  );
}
