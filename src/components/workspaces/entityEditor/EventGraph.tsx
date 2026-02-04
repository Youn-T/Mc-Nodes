import Graph from "../../graphs/Graph"

type EventData = Record<string, Event>
type Event = Partial<Record<EventKeys, any[]>>
type EventKeys = 'randomize' | 'add' | 'remove';


function EventGraph({ eventData }: { eventData: EventData }) {
    return (<>
        <Graph></Graph>

        {/* Sidebar: Liste des events/groups */}
        <div className="w-64 bg-neutral-800 border-l border-neutral-700 overflow-y-auto p-3 custom-scrollbar relative pt-0">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 sticky top-0 from-neutral-800 to-transparent via-neutral-800 pt-3 pb-2 bg-linear-to-b">Events</div>
            <div className="flex flex-col gap-2">
                {
                    Object.entries(eventData || {}).map(([key, value]: [string, Event]) => {

                        return (
                            <div className="bg-neutral-700 rounded px-2 pb-2 text-sm pt-1" key={key}>
                                <div className="text-xs text-neutral-400">{key}</div>
                                <input className="text-xs text-neutral-400 border-none outline-none mb-2"
                                    spellCheck={false} />


                            </div>
                        );
                    })
                }
            </div>
        </div>
    </>)
}

export default EventGraph;