interface ZoneNameProps {
  zoneName: string;
  setZoneName: (name: string) => void;
}

export default function ZoneName({ zoneName, setZoneName }: ZoneNameProps) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        জোনের নাম
      </label>
      <input
        type="text"
        value={zoneName}
        onChange={(e) => setZoneName(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52B788]/70 text-gray-700"
        placeholder="জোনের নাম লিখুন"
        required
      />
    </div>
  );
}
