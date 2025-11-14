interface FilterProps {
  value: number | null
  onChange: (v: number | null) => void
  filters: { label: string, value: number }[]
}

export default function Filter({ value, onChange, filters }: FilterProps) {
  return (
    <div className='flex flex-row justify-center gap-1 text-sm'>
      {filters.map(filter => (
        <button
          onClick={() => onChange(filter.value)}
          className={`px-2 border-b-2 hover:text-secondary-200 ${value === filter.value ? 'border-secondary-100' : 'border-transparent hover:border-secondary-200'}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}