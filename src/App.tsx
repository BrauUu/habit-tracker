import { useEffect, useState, useRef, useCallback } from 'react'

import type { DailyHabit, IncrementalHabit, HabitsList } from './types/habit'

import DailyHabitsSection from './sections/dailyHabitSection'
import IncrementalHabitsSection from './sections/incrementalHabitSection'
import { Toaster } from 'react-hot-toast'

function App() {

  const [habitsList, setHabitsList] = useState<HabitsList>({
    dailyHabits: [],
    incrementalHabits: []
  })
  const [pendingDailyHabits, setPendingDailyHabits] = useState<string[]>([])

  const initialLoadRef = useRef(true)
  const hasResetToday = useRef(true)
  const hasCheckedPendingHabits = useRef(false)
  const habitsRef = useRef(habitsList)

  useEffect(() => {
    habitsRef.current = habitsList
  }, [habitsList])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const checkMidnight = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)

      const timeUntilMidnight = midnight.getTime() - now.getTime()

      timeoutId = setTimeout(() => {
        const pendingHabits = getPendingHabits()

        if (pendingHabits.length > 0) {
          setPendingDailyHabits(pendingHabits)
        } else {
          resetHabits()
        }
        checkMidnight()
      }, timeUntilMidnight)
    }

    checkMidnight()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  useEffect(() => {
    const localStorageHabitList: HabitsList = JSON.parse((localStorage.getItem('habitsList') || '[]'))
    const dailyHabits = localStorageHabitList?.dailyHabits || []
    const incrementalHabits = localStorageHabitList?.incrementalHabits || []

    setHabitsList({
      dailyHabits,
      incrementalHabits
    })

    const localStorageLastDailyResetDate: string | null = localStorage.getItem('lastDailyResetDate')
    if (localStorageLastDailyResetDate) {
      const lastDailyResetDate: Date = new Date(localStorageLastDailyResetDate)
      lastDailyResetDate.setHours(0, 0, 0, 0)
      hasResetToday.current = getHasResetToday(lastDailyResetDate)
    } else {
      saveTodayDateOnLocalStorage()
    }

    const localStorageLastWeeklyResetDate: string | null = localStorage.getItem('lastWeeklyResetDate')
    if (!localStorageLastWeeklyResetDate) {
      setLastSunday()
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && initialLoadRef.current) {
      return
    }

    if (!hasResetToday.current && habitsList.dailyHabits.length > 0 && !hasCheckedPendingHabits.current) {
      hasCheckedPendingHabits.current = true
      const pendingHabits = getPendingHabits()
      if (pendingHabits.length > 0) {
        setPendingDailyHabits(pendingHabits)
      } else {
        resetHabits()
      }
    }
  }, [habitsList])

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    localStorage.setItem('habitsList', JSON.stringify(habitsList))
  }, [habitsList])

  function updateDailyHabit(id: string, key: string, value: any) {
    setHabitsList(prevState => ({
      ...prevState,
      dailyHabits: prevState.dailyHabits.map(habit =>
        habit.id === id ? { ...habit, [key]: value } : habit
      )
    }))
  }

  function getPendingHabits() {
    return habitsRef.current.dailyHabits
      .filter(habit => checkIfItsYesterdaysHabit(habit) && !habit.done)
      .map(habit => habit.id)
  }

  function deleteDailyHabit(id: string) {
    setHabitsList(prevState => ({
      ...prevState,
      dailyHabits: prevState.dailyHabits.filter(habit => habit.id !== id)
    }))
  }

  function updateIncrementalHabit(id: string, key: string, value: any) {
    setHabitsList(prevState => ({
      ...prevState,
      incrementalHabits: prevState.incrementalHabits.map(habit =>
        habit.id === id ? { ...habit, [key]: value } : habit
      )
    }))
  }

  function deleteIncrementalHabit(id: string) {
    setHabitsList(prevState => ({
      ...prevState,
      incrementalHabits: prevState.incrementalHabits.filter(habit => habit.id !== id)
    }))
  }

  function addIncrementalHabit(habit: IncrementalHabit) {
    setHabitsList(prevState => ({
      ...prevState,
      incrementalHabits: [...prevState.incrementalHabits, habit]
    }))
  }

  function addDailyHabit(habit: DailyHabit) {
    setHabitsList(prevState => ({
      ...prevState,
      dailyHabits: [...prevState.dailyHabits, habit]
    }))
  }

  function saveTodayDateOnLocalStorage() {
    const now: Date = new Date()
    now.setHours(0, 0, 0, 0)
    localStorage.setItem('lastDailyResetDate', now.toISOString())
  }

  function resetHabits() {
    const shouldResetWeekly = checkShouldResetWeeklyHabits()
    
    setHabitsList(prevState => ({
      ...prevState,
      dailyHabits: prevState.dailyHabits.map(habit => ({
        ...habit,
        done: false,
        streak: checkDailyHabitStreak(habit)
      })),
      incrementalHabits: prevState.incrementalHabits.map(habit => ({
        ...habit,
        negativeCount: checkShouldResetIncrementalHabit(habit, shouldResetWeekly) ? 0 : habit.negativeCount,
        positiveCount: checkShouldResetIncrementalHabit(habit, shouldResetWeekly) ? 0 : habit.positiveCount
      }))
    }))
    
    saveTodayDateOnLocalStorage()
    
    if (shouldResetWeekly) {
      setLastSunday()
    }
    
    setPendingDailyHabits([])
  }

  function checkShouldResetWeeklyHabits(): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const localStorageLastWeeklyResetDate: string | null = localStorage.getItem('lastWeeklyResetDate')
    if (localStorageLastWeeklyResetDate) {
      const lastWeeklyResetDate = new Date(localStorageLastWeeklyResetDate)
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)
      
      return lastWeeklyResetDate.getTime() <= sevenDaysAgo.getTime()
    }

    return false
  }

  function checkShouldResetIncrementalHabit(habit: IncrementalHabit, shouldResetWeekly: boolean): boolean {
    if (habit.resetFrequency === 'daily') return true
    if (habit.resetFrequency === 'weekly') return shouldResetWeekly
    return false
  }

  function setLastSunday() {
    const lastSunday = new Date()
    lastSunday.setHours(0, 0, 0, 0)
    while (lastSunday.getDay() !== 3) {
      lastSunday.setDate(lastSunday.getDate() - 1)
    }
    localStorage.setItem('lastWeeklyResetDate', lastSunday.toISOString())
  }

  function getHasResetToday(lastResetTimestamp: Date) {
    const now: Date = new Date()
    now.setHours(0, 0, 0, 0)
    return !(now.getTime() > lastResetTimestamp.getTime())
  }

  function checkDailyHabitStreak(habit: DailyHabit) {
    if (checkIfItsYesterdaysHabit(habit)) {
      if (habit.done)
        return habit.streak
      return 0
    }
    return habit.streak
  }

  function checkIfItsYesterdaysHabit(habit: DailyHabit) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1);
    return checkHabitByDay(habit, yesterday.getDay())
  }

  function checkHabitByDay(habit: DailyHabit, weekDay: number) {
    return habit.daysOfTheWeek.includes(weekDay)
  }

  const setDailyHabits = useCallback((updater: (dailyHabits: DailyHabit[]) => DailyHabit[]) => {
    setHabitsList(prev => ({
      ...prev,
      dailyHabits: updater(prev.dailyHabits)
    }))
  }, [])

  const setIncrementalHabits = useCallback((updater: (incrementalHabits: IncrementalHabit[]) => IncrementalHabit[]) => {
    setHabitsList(prev => ({
      ...prev,
      incrementalHabits: updater(prev.incrementalHabits)
    }))
  }, [])

  return (
    <div className='flex flex-row gap-8 h-screen p-16'>
      <IncrementalHabitsSection
        incrementalHabits={habitsList.incrementalHabits}
        setIncrementalHabits={setIncrementalHabits}
        onUpdateIncrementalHabit={updateIncrementalHabit}
        onDeleteIncrementalHabit={deleteIncrementalHabit}
        onAddIncrementalHabit={addIncrementalHabit}
      />
      <DailyHabitsSection
        dailyHabits={habitsList.dailyHabits}
        setDailyHabits={setDailyHabits}
        onUpdateDailyHabit={updateDailyHabit}
        onDeleteDailyHabit={deleteDailyHabit}
        onAddDailyHabit={addDailyHabit}
        onResetDailyHabits={resetHabits}
        pendingHabits={pendingDailyHabits}
      />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            backgroundColor: 'var(--color-primary-600)',
            color: 'var(--color-secondary-100)'
          },
        }}
      />

    </div >
  )
}

export default App
