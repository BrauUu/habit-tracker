import { useEffect, useState, useRef, useCallback } from 'react'

import type { DailyHabit, IncrementalHabit, HabitsList, Todo } from './types/habit'

import DailyHabitsSection from './sections/dailyHabitSection'
import IncrementalHabitsSection from './sections/incrementalHabitSection'
import TodosSection from './sections/todoSection'
import MobileNav, { type Section } from './components/mobileNav'


function App() {
  const [activeSection, setActiveSection] = useState<Section>('daily')

  const [habitsList, setHabitsList] = useState<HabitsList>({
    dailyHabits: [],
    incrementalHabits: [],
    todos: []
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
    const todos = localStorageHabitList?.todos || []

    setHabitsList({
      dailyHabits,
      incrementalHabits,
      todos
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

  function addDailyHabit(habit: DailyHabit) {
    setHabitsList(prevState => ({
      ...prevState,
      dailyHabits: [...prevState.dailyHabits, habit]
    }))
  }

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

  function addIncrementalHabit(habit: IncrementalHabit) {
    setHabitsList(prevState => ({
      ...prevState,
      incrementalHabits: [...prevState.incrementalHabits, habit]
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


  function addTodo(todo: Todo) {
    setHabitsList(prevState => ({
      ...prevState,
      todos: [...prevState.todos, todo]
    }))
  }

  function updateTodo(id: string, key: string, value: any) {
    setHabitsList(prevState => ({
      ...prevState,
      todos: prevState.todos.map(todo =>
        todo.id === id ? { ...todo, [key]: value } : todo
      )
    }))
  }

  function deleteTodo(id: string) {
    setHabitsList(prevState => ({
      ...prevState,
      todos: prevState.todos.filter(todo => todo.id !== id)
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

    habitsList.todos.forEach((todo) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)

      if (todo?.doneDate) {
        const doneDate = new Date(todo?.doneDate)
        if (doneDate <= sevenDaysAgo) {
          deleteTodo(todo.id)
        }
      }

    })

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

  const setTodos = useCallback((updater: (todos: Todo[]) => Todo[]) => {
    setHabitsList(prev => ({
      ...prev,
      todos: updater(prev.todos)
    }))
  }, [])

  return (
    <>
      <div className='flex flex-col lg:flex-row gap-8 h-screen p-4 pb-20 lg:pb-4 md:p-16'>
        <div className={`w-full h-full ${activeSection === 'incremental' ? 'block' : 'hidden lg:block'}`}>
          <IncrementalHabitsSection
            incrementalHabits={habitsList.incrementalHabits}
            setIncrementalHabits={setIncrementalHabits}
            onUpdateIncrementalHabit={updateIncrementalHabit}
            onDeleteIncrementalHabit={deleteIncrementalHabit}
            onAddIncrementalHabit={addIncrementalHabit}
          />
        </div>
        <div className={`w-full h-full ${activeSection === 'daily' ? 'block' : 'hidden lg:block'}`}>
          <DailyHabitsSection
            dailyHabits={habitsList.dailyHabits}
            setDailyHabits={setDailyHabits}
            onUpdateDailyHabit={updateDailyHabit}
            onDeleteDailyHabit={deleteDailyHabit}
            onAddDailyHabit={addDailyHabit}
            onResetDailyHabits={resetHabits}
            pendingHabits={pendingDailyHabits}
          />
        </div>
        <div className={`w-full h-full ${activeSection === 'todo' ? 'block' : 'hidden lg:block'}`}>
          <TodosSection
            todos={habitsList.todos}
            setTodos={setTodos}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            onAddTodo={addTodo}
          />
        </div>
      </div>
      
      <MobileNav activeSection={activeSection} onSectionChange={setActiveSection} />
    </>
  )
}

export default App
