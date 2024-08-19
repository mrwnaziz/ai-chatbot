import { format, parseISO } from 'date-fns'

interface Event {
  date: string
  title: string
  description: string
  location: string
}

export function Events({ props: events }: { props: Event[] }) {
  return (
    <div className="-mt-2 flex w-full flex-col gap-2 py-4">
      {events.map(event => (
        <div
          key={event.date}
          className="flex shrink-0 flex-col gap-1 rounded-lg bg-zinc-800 p-4"
        >
          <div className="text-sm text-zinc-400">
            {format(parseISO(event.date), 'dd LLL, yyyy')}
          </div>
          <div className="text-base font-bold text-zinc-200">
            {event.title}
          </div>
          <div className="text-sm text-zinc-500">
            {event.location}
          </div>
          <div className="text-zinc-500">
            {event.description.slice(0, 100)}...
          </div>
        </div>
      ))}
    </div>
  )
}