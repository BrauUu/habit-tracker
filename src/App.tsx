import { useEffect, useState, useRef, useCallback } from 'react'

import type { Daily, Incremental, HabitsList, Todo } from './types/habit'
import type { User } from './types/others'

import UserSection from './sections/userSection'
import DailyHabitsSection from './sections/dailyHabitSection'
import IncrementalHabitsSection from './sections/incrementalHabitSection'
import TodosSection from './sections/todoSection'
import MobileNav, { type Section } from './components/mobileNav'

import { useToast } from './hooks/useToast'
import { getAllDataFromUser, startNewDay } from './services/user.service'
import { createDaily, deleteDaily, getPendingDailies, updateDaily, checkDaily, uncheckDaily } from './services/daily.service'
import { createIncremental, deleteIncremental, updateIncremental, increaseIncremental, decreaseIncremental } from './services/incremental.service'
import { createTodo, updateTodo as updateTodoService, deleteTodo as deleteTodoService, checkTodo, uncheckTodo } from './services/todo.service'

function App() {
  const [activeSection, setActiveSection] = useState<Section>('daily')

  const [habitsList, setHabitsList] = useState<HabitsList>({
    dailyHabits: [],
    incrementalHabits: [],
    todos: []
  })
  const [user, setUser] = useState<User | null>(null)
  const [pendingDailyHabits, setPendingDailyHabits] = useState<string[]>([])
  const [isUserCheckComplete, setIsUserCheckComplete] = useState(false)

  const initialLoadRef = useRef(true)
  const hasResetToday = useRef(true)
  const hasCheckedPendingHabits = useRef(false)
  const habitsRef = useRef(habitsList)

  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (getTokenOnLocalStorage()) {
        const data = await getUserData()
        if (data) {
          setUser(data.user)
          setHabitsList({
            dailyHabits: data.dailies,
            incrementalHabits: data.incrementals,
            todos: data.todos
          })
        }
      }
      setIsUserCheckComplete(true)
    }
    fetchData()
  },[])

  useEffect(() => {
    habitsRef.current = habitsList
  }, [habitsList])

  useEffect(() => {
    if (!isUserCheckComplete) return

    const handleDailyReset = async () => {
      hasResetToday.current = false
      const pendingHabits = await getPendingHabits()

      if (pendingHabits && pendingHabits?.length > 0) {
        setPendingDailyHabits(pendingHabits)
      } else {
        resetHabits()
      }
    }

    let timeoutId: NodeJS.Timeout
    const checkIfNeedsReset = () => {
      
      const localLastDailyResetDate = user ? user.lastDailyResetDate : localStorage.getItem('lastDailyResetDate')
      if (!localLastDailyResetDate) return

      const lastResetDate = new Date(localLastDailyResetDate)
      const today = new Date()
      today.setHours(3, 0, 0, 0)

      if (lastResetDate < today) {
        handleDailyReset()
      }
    }

    const scheduleNextCheck = () => {
      const now = new Date()
      const targetTime = new Date(now)
      targetTime.setHours(3, 0, 0, 0)
      targetTime.setDate(targetTime.getDate() + 1)

      const timeUntilTarget = targetTime.getTime() - now.getTime()

      timeoutId = setTimeout(() => {
        checkIfNeedsReset()
        scheduleNextCheck()
      }, timeUntilTarget)
    }

    scheduleNextCheck()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkIfNeedsReset()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isUserCheckComplete, user])

  useEffect(() => {
    if (!isUserCheckComplete) return

    if (!user) {
      const localHabitsList: HabitsList = JSON.parse((localStorage.getItem('habitsList') || '[]'))
      const dailyHabits = localHabitsList?.dailyHabits || []
      const incrementalHabits = localHabitsList?.incrementalHabits || []
      const todos = localHabitsList?.todos || []

      setHabitsList({
        dailyHabits,
        incrementalHabits,
        todos
      })
    }


    const tempLastDailyResetDate = user ? user.lastDailyResetDate : localStorage.getItem('lastDailyResetDate')
    if (tempLastDailyResetDate) {
      const localLastDailyResetDate: Date = new Date(tempLastDailyResetDate)
      localLastDailyResetDate.setHours(3, 0, 0, 0)
      hasResetToday.current = getHasResetToday(localLastDailyResetDate)
    } else if (!user) {
      saveTodayDateOnLocalStorage()
    }
  }, [isUserCheckComplete, user])

  useEffect(() => {
    if (!isUserCheckComplete) return
    const handleDailyReset = async () => {
      hasCheckedPendingHabits.current = true
      const pendingHabits = await getPendingHabits()
      if (pendingHabits && pendingHabits?.length > 0) {
        setPendingDailyHabits(pendingHabits)
      } else {
        resetHabits()
      }
    }

    console.log('verificou')
    if (!hasResetToday.current && habitsList.dailyHabits.length > 0 && !hasCheckedPendingHabits.current) {
      console.log('entrou')
      handleDailyReset()
    }
  }, [habitsList, isUserCheckComplete])

  useEffect(() => {
    if (!isUserCheckComplete) return

    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    if (!user) {
      localStorage.setItem('habitsList', JSON.stringify(habitsList))
    }
  }, [isUserCheckComplete, user, habitsList])


  async function addDailyHabit(daily: Daily) {
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        dailyHabits: [...prevState.dailyHabits, daily]
      }))
      return
    }
    const response = await createDaily(daily)
    if (response && response.status == 201) {
      setHabitsList(prevState => ({
        ...prevState,
        dailyHabits: [...prevState.dailyHabits, response.data]
      }))
    }
    return response

  }

  async function updateDailyHabit(id: string, daily: Daily) {
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        dailyHabits: prevState.dailyHabits.map(habit =>
          habit.id === id ? { ...daily } : habit
        )
      }))
      return
    }

    const response = await updateDaily(id, daily)
    if (response && response.status == 200) {
      setHabitsList(prevState => ({
        ...prevState,
        dailyHabits: prevState.dailyHabits.map(habit =>
          habit.id === id ? { ...response.data } : habit
        )
      }))
    }
    return response
  }

  async function updateDailyState(id: string, daily: Daily) {
    setHabitsList(prevState => ({
      ...prevState,
      dailyHabits: prevState.dailyHabits.map(habit =>
        habit.id === id ? { ...daily } : habit
      )
    }))
  }

  async function checkDailyHabit(id: string, daily: Daily) {
    if (!user) {
      daily.done = true
      daily.streak++
      updateDailyState(id, daily)
      return
    }

    const response = await checkDaily(id)
    if (response && response.status === 200) {
      daily.done = true
      daily.streak++
      updateDailyState(id, daily)
    }
    return response
  }

  async function uncheckDailyHabit(id: string, daily: Daily) {
    if (!user) {
      daily.done = false
      daily.streak--
      updateDailyState(id, daily)
      return
    }

    const response = await uncheckDaily(id)
    if (response && response.status === 200) {
      daily.done = false
      daily.streak--
      updateDailyState(id, daily)
    }
    return response
  }


  async function getPendingHabits() {
    if (!user) {
      return habitsRef.current.dailyHabits
        .filter(habit => checkIfItsYesterdaysHabit(habit) && !habit.done)
        .map(habit => habit.id)
    }

    const response = await getPendingDailies()
    if (response && response.status == 200) {
      return response.data
    }

  }


  async function deleteDailyHabit(id: string) {
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        dailyHabits: prevState.dailyHabits.filter(habit => habit.id !== id)
      }))
      return
    }

    const response = await deleteDaily(id)
    if (response && response.status == 200) {
      setHabitsList(prevState => ({
        ...prevState,
        dailyHabits: prevState.dailyHabits.filter(habit => habit.id !== id)
      }))
    }
    return response
  }

  async function addIncrementalHabit(incremental: Incremental) {
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        incrementalHabits: [...prevState.incrementalHabits, incremental]
      }))
      return
    }
    const response = await createIncremental(incremental)
    if (response && response.status == 201) {
      setHabitsList(prevState => ({
        ...prevState,
        incrementalHabits: [...prevState.incrementalHabits, response.data]
      }))
    }
    return response
  }


  async function updateIncrementalHabit(id: string, incremental: Incremental) {
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        incrementalHabits: prevState.incrementalHabits.map(habit =>
          habit.id === id ? { ...incremental } : habit
        )
      }))
      return
    }

    const response = await updateIncremental(id, incremental)
    if (response && response.status == 200) {
      setHabitsList(prevState => ({
        ...prevState,
        incrementalHabits: prevState.incrementalHabits.map(habit =>
          habit.id === id ? { ...response.data } : habit
        )
      }))
    }
    return response
  }

  async function updateIncrementalState(id: string, incremental: Incremental) {
    setHabitsList(prevState => ({
      ...prevState,
      incrementalHabits: prevState.incrementalHabits.map(habit =>
        habit.id === id ? { ...incremental } : habit
      )
    }))
  }

  async function increaseIncrementalHabit(id: string, habit: Incremental) {
    if (!user) {
      habit.positiveCount++
      updateIncrementalState(id, habit)
      return
    }

    const response = await increaseIncremental(id)
    if (response && response.status === 200) {
      habit.positiveCount++
      updateIncrementalState(id, habit)
    }
    return response
  }

  async function decreaseIncrementalHabit(id: string, habit: Incremental) {
    if (!user) {
      habit.negativeCount++
      updateIncrementalState(id, habit)
      return
    }

    const response = await decreaseIncremental(id)
    if (response && response.status === 200) {
      habit.negativeCount++
      updateIncrementalState(id, habit)
    }
    return response
  }

  async function deleteIncrementalHabit(id: string) {

    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        incrementalHabits: prevState.incrementalHabits.filter(habit => habit.id !== id)
      }))
      return
    }

    const response = await deleteIncremental(id)
    if (response && response.status == 200) {
      setHabitsList(prevState => ({
        ...prevState,
        incrementalHabits: prevState.incrementalHabits.filter(habit => habit.id !== id)
      }))
    }
    return response
  }

  async function addTodo(todo: Todo) {
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        todos: [...prevState.todos, todo]
      }))
      return
    }
    const response = await createTodo(todo)
    if (response && response.status == 201) {
      setHabitsList(prevState => ({
        ...prevState,
        todos: [...prevState.todos, response.data]
      }))
    }
    return response
  }

  async function updateTodo(id: string, todo: Todo) {

    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        todos: prevState.todos.map(habit =>
          habit.id === id ? { ...todo } : habit
        )
      }))
      return
    }

    const response = await updateTodoService(id, todo)
    if (response && response.status == 200) {
      setHabitsList(prevState => ({
        ...prevState,
        todos: prevState.todos.map(habit =>
          habit.id === id ? { ...response.data } : habit
        )
      }))
    }
    return response
  }

  async function updateTodoState(id: string, todo: Todo) {
    setHabitsList(prevState => ({
      ...prevState,
      todos: prevState.todos.map(habit =>
        habit.id === id ? { ...todo } : habit
      )
    }))
  }

  async function checkTodoHabit(id: string, todo: Todo) {
    if (!user) {
      const today = new Date()
      today.setHours(3, 0, 0, 0)
      todo.doneDate = today
      updateTodoState(id, todo)
      return
    }

    const response = await checkTodo(id)
    if (response && response.status === 200) {
      const today = new Date()
      today.setHours(3, 0, 0, 0)
      todo.doneDate = today
      updateTodoState(id, todo)
    }
    return response
  }

  async function uncheckTodoHabit(id: string, todo: Todo) {
    if (!user) {
      todo.doneDate = null
      updateTodoState(id, todo)
      return
    }

    const response = await uncheckTodo(id)
    if (response && response.status === 200) {
      todo.doneDate = null
      updateTodoState(id, todo)
    }
    return response
  }

  async function deleteTodo(id: string) {
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        todos: prevState.todos.filter(habit => habit.id !== id)
      }))
      return
    }

    const response = await deleteTodoService(id)
    if (response && response.status == 200) {
      setHabitsList(prevState => ({
        ...prevState,
        todos: prevState.todos.filter(habit => habit.id !== id)
      }))
    }
    return response
  }

  function saveTodayDateOnLocalStorage() {
    const now: Date = new Date()
    now.setHours(3, 0, 0, 0)
    localStorage.setItem('lastDailyResetDate', now.toISOString())
  }

  async function resetHabits() {

    setPendingDailyHabits([])
    if (!user) {
      setHabitsList(prevState => ({
        ...prevState,
        dailyHabits: prevState.dailyHabits.map(habit => ({
          ...habit,
          done: false,
          streak: checkDailyHabitStreak(habit)
        })),
        incrementalHabits: prevState.incrementalHabits.map(habit => {
          const shouldReset = checkShouldResetIncrementalHabit(habit)
          return ({
            ...habit,
            negativeCount: shouldReset ? 0 : habit.negativeCount,
            positiveCount: shouldReset ? 0 : habit.positiveCount
          })
        })
      }))

      habitsList.todos.forEach((todo) => {
        const today = new Date()
        today.setHours(3, 0, 0, 0)

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

      return
    }

    try {
      const response = await startNewDay()
      if (response && response.status == 200) {

        const { dailiesUpdates, incrementalsUpdates, deletedTodos, lastDailyResetDate } = response.data

        setHabitsList(prevState => ({
          ...prevState,
          dailyHabits: prevState.dailyHabits.map((daily) => {
            const updatedDaily = dailiesUpdates.find((du) => du && du.id === daily.id)
            return updatedDaily ? { ...daily, ...updatedDaily } : daily
          }),
          incrementalHabits: prevState.incrementalHabits.map((incremental) => {
            const updatedIncremental = incrementalsUpdates.find((iu) => iu && iu.id === incremental.id)
            return updatedIncremental ? { ...incremental, ...updatedIncremental } : incremental
          }),
          todos: prevState.todos.filter((todo) => {
            return !deletedTodos.find((dt) => dt && dt.id === todo.id)
          }),
        }))
        
        setUser(prevState => prevState ? {...prevState, lastDailyResetDate} : null)
      }
      toast.success('new day started with sucess')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.error(errorMessage)
    }

    return
  }

  function checkShouldResetIncrementalHabit(habit: Incremental): boolean {
    const today = new Date()
    if (habit.resetFrequency === 'daily') return true
    if (habit.resetFrequency === 'weekly') return today.getDay() === 1
    return false
  }


  function getHasResetToday(lastResetTimestamp: Date) {
    const now: Date = new Date()
    now.setHours(3, 0, 0, 0)
    return !(now.getTime() > lastResetTimestamp.getTime())
  }

  function checkDailyHabitStreak(habit: Daily) {
    if (checkIfItsYesterdaysHabit(habit)) {
      if (habit.done)
        return habit.streak
      return 0
    }
    return habit.streak
  }

  function checkIfItsYesterdaysHabit(habit: Daily) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1);
    return checkHabitByDay(habit, yesterday.getDay())
  }

  function checkHabitByDay(habit: Daily, weekDay: number) {
    return habit.daysOfTheWeek?.includes(weekDay)
  }

  const setDailyHabits = useCallback((updater: (dailyHabits: Daily[]) => Daily[]) => {
    setHabitsList(prev => ({
      ...prev,
      dailyHabits: updater(prev.dailyHabits)
    }))
  }, [])

  const setIncrementalHabits = useCallback((updater: (incrementalHabits: Incremental[]) => Incremental[]) => {
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

  async function getUserData() {
    try {
      const response = await getAllDataFromUser()
      toast.success('user data get with success')
      return response.data
    } catch (error: any) {
      if (error.response?.status < 500 && error.response?.status >= 400) {
        toast.error(error.response?.data.message)
      }
    }
  }

  function getTokenOnLocalStorage() {
    return window.localStorage.getItem('token')
  }

  async function handleSynchronizeHabits(habits: HabitsList) {

    setHabitsList(prevState => ({
      dailyHabits: [...prevState.dailyHabits, ...habits.dailyHabits],
      incrementalHabits: [...prevState.incrementalHabits, ...habits.incrementalHabits],
      todos: [...prevState.todos, ...habits.todos]
    }))
  }

  async function handleAuthentication() {
    const data = await getUserData()
    if (data) {
      setHabitsList({
        dailyHabits: data.dailies,
        incrementalHabits: data.incrementals,
        todos: data.todos
      })
    }
  }

  return (
    <div className='flex flex-col w-dvw h-dvh px-4 lg:px-16'>
      <UserSection
        user={user}
        setUser={setUser}
        onSynchronizeHabits={handleSynchronizeHabits}
        onAuthenticate={handleAuthentication}
      ></UserSection>
      <div className='flex flex-1 flex-col lg:flex-row gap-8 lg:pb-12 pb-20 box-border overflow-hidden'>
        <div className={`w-full lg:w-1/3 h-full ${activeSection === 'incremental' ? 'block' : 'hidden lg:block'}`}>
          <IncrementalHabitsSection
            incrementalHabits={habitsList.incrementalHabits}
            setIncrementalHabits={setIncrementalHabits}
            onUpdateIncrementalHabit={updateIncrementalHabit}
            onIncreaseIncremental={increaseIncrementalHabit}
            onDecreaseIncremental={decreaseIncrementalHabit}
            onDeleteIncrementalHabit={deleteIncrementalHabit}
            onAddIncrementalHabit={addIncrementalHabit}
          />
        </div>
        <div className={`w-full lg:w-1/3 h-full ${activeSection === 'daily' ? 'block' : 'hidden lg:block'}`}>
          <DailyHabitsSection
            dailyHabits={habitsList.dailyHabits}
            setDailyHabits={setDailyHabits}
            onUpdateDailyHabit={updateDailyHabit}
            onCheckDaily={checkDailyHabit}
            onUncheckDaily={uncheckDailyHabit}
            onDeleteDailyHabit={deleteDailyHabit}
            onAddDailyHabit={addDailyHabit}
            onResetDailyHabits={resetHabits}
            pendingHabits={pendingDailyHabits}
          />
        </div>
        <div className={`w-full lg:w-1/3 h-full ${activeSection === 'todo' ? 'block' : 'hidden lg:block'}`}>
          <TodosSection
            todos={habitsList.todos}
            setTodos={setTodos}
            onUpdateTodo={updateTodo}
            onCheckTodo={checkTodoHabit}
            onUncheckTodo={uncheckTodoHabit}
            onDeleteTodo={deleteTodo}
            onAddTodo={addTodo}
          />
        </div>
      </div>

      <MobileNav activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  )
}

export default App
