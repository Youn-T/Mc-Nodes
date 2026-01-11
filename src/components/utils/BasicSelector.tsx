import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function BasicSelector({ options, value, onChange }: { options: string[], value: string, onChange: (newValue: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <div 
                onClick={() => setIsOpen(prev => !prev)}
                className={`flex items-center justify-between gap-2 bg-neutral-600 border  rounded px-2 p-0.5 text-sm cursor-pointer hover:bg-neutral-600 hover:border-neutral-500 transition-colors ${isOpen ? "border-neutral-500" : "border-neutral-600"}`}
            >
                <span className="truncate">{value || "Select..."}</span>
                <ChevronDown 
                    size={14} 
                    className={`text-neutral-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} 
                />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onMouseDown={() => setIsOpen(false)} />
                    <div className="border border-neutral-500 absolute left-0 right-0 mt-1 bg-neutral-600 rounded shadow-lg z-20 max-h-32 overflow-y-auto custom-scrollbar">
                        {options.map((option: string, index: number) => (
                            <div
                                key={`${option}-${index}`}
                                onClick={() => handleSelect(option)}
                                className={`px-2 py-1.5 text-sm cursor-pointer transition-colors truncate ${
                                    option === value
                                        ? "bg-neutral-500/50 text-neutral-300"
                                        : "hover:bg-neutral-500/50 text-neutral-300"
                                }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}