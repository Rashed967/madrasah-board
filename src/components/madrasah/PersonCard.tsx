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
      <h4 className="font-semibold mb-4">{title}</h4>
      <div className="space-y-2">
        <p><span className="text-gray-600">নাম:</span> {person?.name || '-'}</p>
        <p><span className="text-gray-600">যোগাযোগ:</span> {person?.contactNo || '-'}</p>
        <p><span className="text-gray-600">এনআইডি:</span> {person?.nidNumber || '-'}</p>
        {person?.highestEducationalQualification && (
          <p><span className="text-gray-600">শিক্ষাগত যোগ্যতা:</span> {person.highestEducationalQualification}</p>
        )}
        {person?.designation && (
          <p><span className="text-gray-600">পদবি:</span> {person.designation}</p>
        )}
      </div>
    </div>
  );
}
