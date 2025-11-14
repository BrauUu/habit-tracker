import type { IncrementalHabit } from '../types/habit'

import HabitSection from './habitSection'
import { IncrementalHabitBox, DragOverlayIncrementalHabitBox } from '../components/boxes/incrementalhabitbox'
import ResetFrequencySelector from '../components/resetFrequencySelector';
import { useToast } from '../hooks/useToast';

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
      habits={incrementalHabits}
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
      renderModalFields={(habit, modalDispatch) => (
        <ResetFrequencySelector
          resetFrequency={habit.resetFrequency}
          onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { resetFrequency: v } })}
        />
      )}
    />
  )
}
