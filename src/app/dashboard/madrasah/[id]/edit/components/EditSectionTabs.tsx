interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function Tab({ label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs md:text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "text-[#52b788] border-b-2 border-[#52b788]"
          : "text-gray-500 hover:text-[#52b788]"
      }`}
    >
      {label}
    </button>
  );
}

interface EditSectionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function EditSectionTabs({ activeTab, onTabChange }: EditSectionTabsProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 pb-4">
      <Tab
        label="মৌলিক তথ্য"
        isActive={activeTab === "basic"}
        onClick={() => onTabChange("basic")}
      />
      <Tab
        label="ঠিকানা"
        isActive={activeTab === "address"}
        onClick={() => onTabChange("address")}
      />
      <Tab
        label="মাদ্রাসার তথ্য"
        isActive={activeTab === "madrasah"}
        onClick={() => onTabChange("madrasah")}
      />
      <Tab
        label="মুহতামিম"
        isActive={activeTab === "muhtamim"}
        onClick={() => onTabChange("muhtamim")}
      />
      <Tab
        label="সভাপতি/মুতাওয়াল্লি"
        isActive={activeTab === "mutawalli"}
        onClick={() => onTabChange("mutawalli")}
      />
      <Tab
        label="শিক্ষা সচিব"
        isActive={activeTab === "secretary"}
        onClick={() => onTabChange("secretary")}
      />
    </div>
  );
}
