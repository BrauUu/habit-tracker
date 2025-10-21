interface FilterProps {
  value: number | null
  onChange: (v: number | null) => void
}

export default function Filter({ value, onChange }: FilterProps) {
  return (
    <div className='flex flex-row justify-center gap-1 text-sm'>
      <button
        onClick={() => onChange(0)}
        className={`px-2 border-b-2 ${value === 0 ? 'border-secondary' : 'border-transparent'}`}
      >
        all
      </button>
      <button
        onClick={() => onChange(1)}
        className={`px-2 border-b-2 ${value === 1 ? 'border-secondary' : 'border-transparent'}`}
      >
        today
      </button>
    </div>
  )
}