import { IZone } from "@/features/zone";
import {
  Dialog,
} from "@/components/ui/dialog";



interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: IZone | null;
}

export const DetailsModal = ({ isOpen, onClose, selectedZone }: DetailsModalProps) => {
  if (!selectedZone) return null;

  
  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="জোনের বিস্তারিত তথ্য"
    >
      <div className="space-y-4">
        <div>
          <label className="font-semibold">জোনের নাম:</label>
          <p>{selectedZone.name}</p>
        </div>
        <div>
          <label className="font-semibold">জোনের কোড:</label>
          <p>{selectedZone.code}</p>
        </div>
        <div>
          <label className="font-semibold">জেলা সমূহ:</label>
          <p>{selectedZone.allDistricts.flat().join(", ")}</p>
        </div>
        <div>
          <label className="font-semibold">কেন্দ্র সমূহ:</label>
          <p>{selectedZone.allMarkazs.length <= 0 ? "কেন্দ্র নেই" : selectedZone.allMarkazs.flat().join(", ")}</p>
        </div>

       
      </div>
    </Dialog>
  );
};
