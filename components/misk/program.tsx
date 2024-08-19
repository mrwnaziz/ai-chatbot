import { ProgramButton } from './program-button'

interface Program {
  id: string
  title: string
  category: string
  duration: string
  applicationDeadline: string
}

interface ProgramsProps {
  props: Program[];
}

export function Programs({ props: programs }: ProgramsProps) {
  if (!programs || programs.length === 0) {
    return <div>No programs available.</div>;
  }
  
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm">
        {programs.map(program => (
          <ProgramButton key={program.id} program={program} />
        ))}
      </div>
      <div className="p-4 text-center text-sm text-zinc-500">
        Click on a program to learn more about it.
      </div>
    </div>
  )
}

