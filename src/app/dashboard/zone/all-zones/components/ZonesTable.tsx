import { IZone } from "@/features/zone";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";

interface ZonesTableProps {
  zones: IZone[];
  onView: (zone: IZone) => void;
  onDelete: (zone: IZone) => void;
}

export const ZonesTable = ({ zones, onView, onDelete }: ZonesTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead className="bg-[#52B788]/70 text-white text-left">
            <tr>
              <th className="px-6 py-3 w-32">জোনের কোড</th>
              <th className="px-6 py-3 w-48">জোনের নাম</th>
              <th className="px-6 py-3 w-48">জেলা</th>
              <th className="px-6 py-3 w-32">মারকায সংখ্যা</th>
              <th className="px-6 py-3 w-32">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {zones.map((zone, index) => (
              <tr key={zone._id.toString()} className="hover:bg-gray-50">
                <td className="px-6 py-4 truncate">{zone.code}</td>
                <td className="px-6 py-4 truncate">{zone.name}</td>
                <td className="px-6 py-4 truncate">{zone.allDistricts.length > 0 ? zone.allDistricts.flat().concat().join(', ') : 'কোনো জেলা নেই'}</td>
                <td className="px-6 py-4 truncate">{zone.allMarkazs.length}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(zone)}
                      className="text-[#52B788] hover:text-[#52B788]/90 text-xl"
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      // onClick={() => onView(zone)}
                      className="text-[#52B788] hover:text-[#52B788]/90 text-xl"
                    >
                      <MdEditSquare />
                    </button>
                    <button
                      onClick={() => onDelete(zone)}
                      className="text-red-600 hover:text-red-800 text-xl"
                    >
                      <AiTwotoneDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
