import { v4 as uuidv4 } from 'uuid';
import type { Habit } from './types'

import { useEffect, useState, useRef, useMemo } from 'react'
import Whiteboard from './components/whiteboard'
import HabitBox from './components/boxes/habitbox'
import Title from './components/title'
import Input from './components/input'
import Filter from './components/filter'

function App() {

  const [habitsList, setHabitsList] = useState<Habit[]>([])
  const [habitFilter, setHabitFilter] = useState<number | null>(1)
  const initialLoadRef = useRef(true)
  const hasResetToday = useRef(false)

  useEffect(() => {
    let timeoutId: number

    const checkMidnight = () => {
      let now = new Date();
      let midnight = new Date(now);
      // comment to test 'daily check'
      // midnight.setHours(24, 0, 0, 0);

      // to test 'daily check'
      midnight.setHours(11, 7, 0, 0);
      if (midnight.getTime() <= now.getTime()) {
        midnight.setDate(midnight.getDate() + 1)
      }


      const timeUntilMidnight = midnight.getTime() - now.getTime();

      timeoutId = setTimeout(() => {
        resetDailyHabits()
        checkMidnight();
      }, timeUntilMidnight);
    };

    checkMidnight();

    return () => {
      if (timeoutId)
        clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {

    const localStorageHabitList: Habit[] = JSON.parse((localStorage.getItem('habitsList') || '[]'))
    setHabitsList(localStorageHabitList)

    const localStorageLastResetDate: Date = new Date(localStorage.getItem('lastResetDate') || new Date())
    localStorageLastResetDate.setHours(0, 0, 0, 0)
    hasResetToday.current = getHasResetToday(localStorageLastResetDate)

  }, [])

  useEffect(() => {

    if (process.env.NODE_ENV === 'development' && initialLoadRef.current) {
      return
    }

    if (!hasResetToday.current) {
      resetDailyHabits()
      const now: Date = new Date()
      now.setHours(0, 0, 0, 0)
      localStorage.setItem('lastResetDate', now.toString())
    }
  }, [hasResetToday])

  useEffect(() => {

    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    localStorage.setItem('habitsList', JSON.stringify(habitsList))
  }, [habitsList])

  const habitsListFiltered = useMemo(() => {
    if (habitFilter === 0) return [...habitsList]
    if (habitFilter === 1) return habitsList.filter(habit => getTodayHabits(habit))
    return [...habitsList]
  }, [habitFilter, habitsList])

  function resetDailyHabits() {
    setHabitsList(prevHabits =>
      prevHabits.map(habit => (
        {
          ...habit,
          done: false,
          streak: checkDailyHabitStreak(habit)
        }
      ))
    );
  }

  function getHasResetToday(lastResetTimestamp: Date) {
    const now: Date = new Date()
    now.setHours(0, 0, 0, 0)
    return !(now.getTime() > lastResetTimestamp.getTime())
  }

  function checkDailyHabitStreak(habit: Habit) {
    if (getTodayHabits(habit)) {
      if (habit.done)
        return habit.streak
      return 0
    }
    return habit.streak
  }

  function getTodayHabits(habit: Habit) {
    const today = new Date().getDay()
    return habit.daysOfTheWeek.includes(today)
  }

  function createNewHabit(title: string) {
    const newHabit: Habit = {
      'id': uuidv4(),
      'title': title,
      'done': false,
      'streak': 0,
      'daysOfTheWeek': [0, 1, 2, 3, 4, 5, 6]
    }
    setHabitsList([...habitsList, newHabit])
  }

  function updateHabit(id: string, key: string, value: any) {
    setHabitsList(prevValue =>
      prevValue.map(habit => habit.id === id ? { ...habit, [key]: value } : habit)
    )
  }

  function deleteHabit(id: string) {
    setHabitsList(prevValue =>
      prevValue.filter(habit => habit.id !== id)
    )
  }

  return (
    <div className='m-16 flex flex-col gap-1 w-full md:w-1/2 lg:w-1/4'>
      <div className='flex flex-row justify-between'>
        <Title value='daily habits' />
        <Filter value={habitFilter} onChange={setHabitFilter} />
      </div>
      <Whiteboard>
        <Input placeholder='add habit' onSubmit={createNewHabit} submitOnEnter={true}></Input>
        {
          habitsListFiltered.map((habit) => (
            <HabitBox key={habit.id} habit={habit} updateHabit={updateHabit} deleteHabit={deleteHabit} />
          ))
        }
      </Whiteboard>
    </div>
  )
}

export default App
