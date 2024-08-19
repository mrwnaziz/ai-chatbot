const placeholderInsights = [
    {
      id: '1',
      title: 'The Future of Work in Saudi Arabia',
      author: 'Dr. Abdullah Al-Saud',
      date: '2023-08-01',
      category: 'Economy',
      summary: 'An in-depth analysis of emerging trends in the Saudi job market and their implications for the youth.'
    },
    {
      id: '2',
      title: 'Innovation Ecosystems in the Middle East',
      author: 'Sarah Al-Omar',
      date: '2023-07-15',
      category: 'Technology',
      summary: 'Exploring the growth of tech hubs and startup ecosystems across the Middle East, with a focus on Saudi Arabia.'
    }
  ]
  
  export const InsightsSkeleton = () => {
    return (
      <div className="-mt-2 flex w-full flex-col gap-2 py-4">
        {placeholderInsights.map(insight => (
          <div
            key={insight.id}
            className="flex shrink-0 flex-col gap-1 rounded-lg bg-zinc-800 p-4"
          >
            <div className="w-3/4 rounded-md bg-zinc-700 text-base text-transparent">
              {insight.title}
            </div>
            <div className="flex justify-between">
              <span className="w-1/3 rounded-md bg-zinc-700 text-sm text-transparent">
                {insight.author}
              </span>
              <span className="w-1/4 rounded-md bg-zinc-700 text-sm text-transparent">
                {insight.date}
              </span>
            </div>
            <div className="w-1/4 rounded-md bg-zinc-700 text-sm text-transparent">
              {insight.category}
            </div>
            <div className="w-full rounded-md bg-zinc-700 text-transparent">
              {insight.summary}
            </div>
          </div>
        ))}
      </div>
    )
  }