const placeholderPrograms = [
    {
      id: '1',
      title: 'Youth Leadership Program',
      category: 'Leadership',
      duration: '6 months',
      applicationDeadline: '2023-09-30'
    },
    {
      id: '2',
      title: 'Tech Innovators Bootcamp',
      category: 'Technology',
      duration: '3 months',
      applicationDeadline: '2023-10-15'
    }
  ]
  
  export const ProgramsSkeleton = () => {
    return (
      <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm">
        {placeholderPrograms.map(program => (
          <div
            key={program.id}
            className="flex flex-col gap-2 rounded-lg bg-zinc-800 p-4"
          >
            <div className="w-3/4 rounded-md bg-zinc-700 text-base text-transparent">
              {program.title}
            </div>
            <div className="flex justify-between">
              <span className="w-1/3 rounded-md bg-zinc-700 text-sm text-transparent">
                {program.category}
              </span>
              <span className="w-1/4 rounded-md bg-zinc-700 text-sm text-transparent">
                {program.duration}
              </span>
            </div>
            <div className="w-2/3 rounded-md bg-zinc-700 text-sm text-transparent">
              {program.applicationDeadline}
            </div>
          </div>
        ))}
      </div>
    )
  }