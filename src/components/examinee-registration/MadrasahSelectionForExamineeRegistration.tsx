import { IoSearch } from "react-icons/io5"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const MadrasahSelectionForExamineeRegistration = () => {
    return (
        <div className="flex gap-2">
        <Input
          type="text"
          placeholder="মাদ্রাসা খুঁজুন"
          className="flex-1"
        />
        <Button
          type="button"
          className="bg-[#52B788] hover:bg-[#52B788]/90 text-white"
        >
          <IoSearch className="h-5 w-5" />
        </Button>
      </div>
    )
}

export default MadrasahSelectionForExamineeRegistration;
