import { ChartBarIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

type Section = 'incremental' | 'daily' | 'todo'

interface MobileNavProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

export default function MobileNav({ activeSection, onSectionChange }: MobileNavProps) {
  const navItems = [
    { id: 'incremental' as Section, label: 'Incremental', icon: ChartBarIcon },
    { id: 'daily' as Section, label: 'Daily', icon: CalendarIcon },
    { id: 'todo' as Section, label: 'Todo', icon: CheckCircleIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary-800 border-t border-primary-600 lg:hidden z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-secondary-100' 
                  : 'text-secondary-100/50 hover:text-secondary-100/75'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export type { Section }
