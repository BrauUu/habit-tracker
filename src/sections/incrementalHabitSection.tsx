import type { Incremental } from '../types/habit'


import HabitSection from './habitSection'
import { IncrementalHabitBox, DragOverlayIncrementalHabitBox } from '../components/boxes/incrementalBox'
import ResetFrequencySelector from '../components/resetFrequencySelector';
import { useToast } from '../hooks/useToast';
import Filter from '../components/filter';
import { useMemo, useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import type { AxiosResponse } from 'axios';

interface IncrementalHabitsSectionProps {
  incrementalHabits: Incremental[]
  setIncrementalHabits: (updater: (incrementalHabits: Incremental[]) => Incremental[]) => void
  onUpdateIncrementalHabit: (id: string, habit: Incremental) => Promise<AxiosResponse<Incremental> | void>
  onDeleteIncrementalHabit: (id: string) => Promise<AxiosResponse | void>
  onAddIncrementalHabit: (habit: Incremental) => Promise<AxiosResponse<Incremental> | void>
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

  function checkHabitStrength(habit: Incremental, filter: number) {
    const strength : number = habit.positive_count - habit.negative_count
    return strength > 0 && filter == 1 || strength < 0 && filter == -1
  }

  function createDefaultHabit(id: string, title: string): Partial<Incremental> {
    return {
      id,
      reset_frequency: 'weekly',
      title,
      positive_count: 0,
      negative_count: 0
    }
  }

  function validateHabit(habit: Incremental): boolean {
    if (!habit.title) {
      toast.validationError('title')
      return false
    }
    if (!habit.reset_frequency) {
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
          resetFrequency={habit.reset_frequency}
          onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { reset_frequency: v } })}
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
