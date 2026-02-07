import Graph from "../../graphs/Graph"
import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";

type EventData = Record<string, Event>
type Event = Partial<Record<EventKeys, any[]>>
type EventKeys = 'randomize' | 'add' | 'remove' | 'sequence' | 'trigger';

function EventGraph({ eventData }: { eventData: EventData }) {
    const [eventNames, setEventNames] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<EventData>(eventData);



    return (<>
        <Graph ></Graph>

        {/* Sidebar: Liste des events */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-3 custom-scrollbar relative pt-0">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 sticky top-0 from-neutral-800 to-transparent via-neutral-800 pt-3 pb-2 bg-linear-to-b flex justify-between items-center">
                Events
                <Plus className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => {
                     const next = { ...data };
                     let keyIdx = 1;
                     while (next.hasOwnProperty("new_event_" + keyIdx)) { keyIdx++; }
                     next["new_event_" + keyIdx] = {};
                     setData(next);
                }} />
            </div>
            <div className="flex flex-col gap-2">
                {
                    Object.entries(data || {}).map(([key, value]: [string, Event]) => {
                        return (
                            <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1" key={key}>
                                <input className="text-sm text-neutral-400 focus:outline-none bg-transparent w-full"
                                    value={eventNames[key] || key}
                                    spellCheck={false} 
                                    onChange={(e) => setEventNames(prev => ({ ...prev, [key]: e.target.value }))}
                                    onBlur={() => {
                                         const newKey = eventNames[key] || key;
                                         if (newKey !== key) {
                                             setData(prev => {
                                                 const next = { ...prev };
                                                 next[newKey] = next[key];
                                                 delete next[key];
                                                 return next;
                                             });
                                             setEventNames(prev => {
                                                 const next = { ...prev };
                                                 delete next[key];
                                                 return next;
                                             });
                                         }
                                    }}
                                />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    </>)
}

export default EventGraph;