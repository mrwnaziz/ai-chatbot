const placeholderEvents = [
    {
      date: '2023-08-15',
      title: 'MISK Innovation Summit',
      location: 'Riyadh, Saudi Arabia',
      description: 'Annual gathering of innovators and thought leaders in technology and entrepreneurship.'
    },
    {
      date: '2023-09-01',
      title: 'Youth Leadership Workshop',
      location: 'Jeddah, Saudi Arabia',
      description: 'Intensive workshop focused on developing leadership skills in Saudi youth.'
    }
  ]
  
  export const EventsSkeleton = () => {
    return (
      <div className="-mt-2 flex w-full flex-col gap-2 py-4">
        {placeholderEvents.map(event => (
          <div
            key={event.date}
            className="flex shrink-0 flex-col gap-1 rounded-lg bg-zinc-800 p-4"
          >
            <div className="w-24 rounded-md bg-zinc-700 text-sm text-transparent">
              {event.date}
            </div>
            <div className="w-3/4 rounded-md bg-zinc-700 text-transparent">
              {event.title}
            </div>
            <div className="w-1/2 rounded-md bg-zinc-700 text-sm text-transparent">
              {event.location}
            </div>
            <div className="w-full rounded-md bg-zinc-700 text-transparent">
              {event.description}
            </div>
          </div>
        ))}
      </div>
    )
  }