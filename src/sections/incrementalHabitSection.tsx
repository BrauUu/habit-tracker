import type { IncrementalHabit } from '../types/habit'

import HabitSection from './habitSection'
import { IncrementalHabitBox, DragOverlayIncrementalHabitBox } from '../components/boxes/incrementalhabitbox'
import ResetFrequencySelector from '../components/resetFrequencySelector';
import { useToast } from '../hooks/useToast';
import Filter from '../components/filter';
import { useMemo, useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface IncrementalHabitsSectionProps {
  incrementalHabits: IncrementalHabit[]
  setIncrementalHabits: (updater: (incrementalHabits: IncrementalHabit[]) => IncrementalHabit[]) => void
  onUpdateIncrementalHabit: (id: string, key: string, value: any) => void
  onDeleteIncrementalHabit: (id: string) => void
  onAddIncrementalHabit: (habit: IncrementalHabit) => void
}

export default function IncrementalHabitsSection({
  incrementalHabits,
  setIncrementalHabits,
  onUpdateIncrementalHabit,
  onDeleteIncrementalHabit,
  onAddIncrementalHabit
}: IncrementalHabitsSectionProps) {
  const toast = useToast()
  const [incrementalHabitFilter, setIncrementalHabitFilter] = useState<number | null>(0)

  const filterOptions = [
    { 'label': 'all', 'value': 0 },
    { 'label': 'strong', 'value': 1 },
    { 'label': 'weak', 'value': -1 }
  ]

  const habitsListFiltered = useMemo(() => {
    if (incrementalHabitFilter === 0) return [...incrementalHabits]
    if (incrementalHabitFilter === 1) return incrementalHabits.filter(habit => checkHabitStrength(habit, incrementalHabitFilter))
    if (incrementalHabitFilter === -1) return incrementalHabits.filter(habit => checkHabitStrength(habit, incrementalHabitFilter))
    return [...incrementalHabits]
  }, [incrementalHabitFilter, incrementalHabits])

  function checkHabitStrength(habit: IncrementalHabit, filter: number) {
    const strength : number = habit.positiveCount - habit.negativeCount
    return strength > 0 && filter == 1 || strength < 0 && filter == -1
  }

  function createDefaultHabit(id: string, title: string): IncrementalHabit {
    return {
      id,
      resetFrequency: 'weekly',
      title,
      type: 'incremental',
      positiveCount: 0,
      negativeCount: 0
    }
  }

  function validateHabit(habit: IncrementalHabit): boolean {
    if (!habit.title) {
      toast.validationError('title')
      return false
    }
    if (!habit.resetFrequency) {
      toast.validationError('reset frequency')
      return false
    }
    return true
  }

  return (
    <HabitSection
      title="incremental"
      habits={habitsListFiltered}
      setHabits={setIncrementalHabits}
      onUpdateHabit={onUpdateIncrementalHabit}
      onDeleteHabit={onDeleteIncrementalHabit}
      onAddHabit={onAddIncrementalHabit}
      createDefaultHabit={createDefaultHabit}
      validateHabit={validateHabit}
      renderHabitBox={(habit, updateHabit, modalDispatch) => (
        <IncrementalHabitBox
          key={habit.id}
          habit={habit}
          updateHabit={updateHabit}
          modalDispatch={modalDispatch}
        />
      )}
      renderDragOverlay={(habit) => (
        <DragOverlayIncrementalHabitBox key={habit.id} habit={habit} />
      )}
      headerExtra={<Filter value={incrementalHabitFilter} onChange={setIncrementalHabitFilter} filters={filterOptions} />}
      renderModalFields={(habit, modalDispatch) => (
        <ResetFrequencySelector
          resetFrequency={habit.resetFrequency}
          onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { resetFrequency: v } })}
        />
      )}
       withoutContent={{
        icon: ChartBarIcon,
        title: 'incremental habits will show here',
        text: 'incremental habits can be tracked whenever they happen. multiple checks build your positive or negative score.'         
        }}
    />
  )
}
