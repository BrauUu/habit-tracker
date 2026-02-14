import { useState, useMemo } from 'react'

import type { Daily } from '../types/habit'

import HabitSection from './habitSection'
import { HabitBox, DragOverlayHabitBox } from '../components/boxes/dailyBox'
import Filter from '../components/filter'
import NewDayModal from '../components/modal/new-day';
import DayOfWeekSelector from '../components/dayOfWeekSelector';
import { useToast } from '../hooks/useToast';
import { CalendarIcon } from '@heroicons/react/24/outline'
import type { AxiosResponse } from 'axios'

interface DailyHabitsSectionProps {
  dailyHabits: Daily[]
  setDailyHabits: (updater: (dailyHabits: Daily[]) => Daily[]) => void
  onUpdateDailyHabit: (id: string, key: string, value: any) => void
  onDeleteDailyHabit: (id: string) => Promise<AxiosResponse | void>
  onAddDailyHabit: (daily: Daily) => Promise<AxiosResponse<Daily> | void>
  onResetDailyHabits: () => void
  pendingHabits: string[]
}

export default function DailyHabitsSection({
  dailyHabits,
  setDailyHabits,
  onUpdateDailyHabit,
  onDeleteDailyHabit,
  onAddDailyHabit,
  onResetDailyHabits,
  pendingHabits,
}: DailyHabitsSectionProps) {

  const toast = useToast()
  const [dailyHabitFilter, setDailyHabitFilter] = useState<number | null>(1)

  const filterOptions = [
    { 'label': 'all', 'value': 0 },
    { 'label': 'today', 'value': 1 }
  ]

  const habitsListFiltered = useMemo(() => {
    if (dailyHabitFilter === 0) return [...dailyHabits]
    if (dailyHabitFilter === 1) return dailyHabits.filter(habit => checkIfItsTodaysHabit(habit))
    return [...dailyHabits]
  }, [dailyHabitFilter, dailyHabits])

  function checkIfItsTodaysHabit(habit: Daily) {
    const today = new Date().getDay()
    return habit?.days_of_the_week?.includes(today)
  }

  function createDefaultHabit(title: string): Partial<Daily> {
    return {
      title,
      done: false,
      streak: 0,
      days_of_the_week: [0, 1, 2, 3, 4, 5, 6]
    }
  }

  function validateHabit(habit: Daily): boolean {
    if (!habit.title) {
      toast.validationError('title')
      return false
    }
    return true
  }


  return (
    <>
      <HabitSection
        title="daily"
        habits={habitsListFiltered}
        setHabits={setDailyHabits}
        onUpdateHabit={onUpdateDailyHabit}
        onDeleteHabit={onDeleteDailyHabit}
        onAddHabit={onAddDailyHabit}
        createDefaultHabit={createDefaultHabit}
        validateHabit={validateHabit}
        renderHabitBox={(habit, updateHabit, modalDispatch) => (
          <HabitBox
            key={habit.id}
            habit={habit}
            updateHabit={updateHabit}
            onlyVisible={false}
            modalDispatch={modalDispatch}
          />
        )}
        renderDragOverlay={(habit) => (
          <DragOverlayHabitBox key={habit.id} habit={habit} />
        )}
        renderModalFields={(habit, modalDispatch) => (
          <DayOfWeekSelector
            selectedDaysProps={habit.days_of_the_week}
            onChange={(days) => modalDispatch({ type: 'updateHabit', payload: { days_of_the_week: days } })}
          />
        )}
        headerExtra={<Filter value={dailyHabitFilter} onChange={setDailyHabitFilter} filters={filterOptions} />}
        withoutContent={{
          icon: CalendarIcon,
          title: 'daily habits will show here',
          text: 'daily habits have their designated days. complete them as scheduled and watch your streak grow.'
        }}
      />
      {
        pendingHabits.length > 0 && (
          <NewDayModal title='check yesterday habits' onStart={onResetDailyHabits}>
            {dailyHabits.filter(habit => pendingHabits.includes(habit.id))
              .map(habit => (
                <HabitBox key={habit.id} habit={habit} updateHabit={onUpdateDailyHabit} />
              ))}
          </NewDayModal>
        )}
    </>
  )
}
