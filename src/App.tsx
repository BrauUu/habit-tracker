
import { useEffect, useState, useRef, useMemo, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid';

import type { Habit } from './types/types'
import { modalReducer } from './reducers/modalReducer'

import Whiteboard from './components/whiteboard'
import HabitBox from './components/boxes/habitbox'
import Title from './components/title'
import Input from './components/input'
import Filter from './components/filter'
import NewDayModal from './components/modal/new-day';
import Modal from './components/modal/default';
import DayOfWeekSelector from './components/day-of-week-selector';

function App() {

  const [habitsList, setHabitsList] = useState<Habit[]>([])
  const [habitFilter, setHabitFilter] = useState<number | null>(1)
  const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })
  const initialLoadRef = useRef(true)
  const hasResetToday = useRef(true)
  const hasCheckedPendingHabits = useRef(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const checkMidnight = () => {
      let now = new Date();
      let midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const timeUntilMidnight = midnight.getTime() - now.getTime();

      timeoutId = setTimeout(() => {
        const pendingHabits = habitsList.filter(habit => checkIfItsYesterdaysHabit(habit) && !habit.done)
          .map(habit => habit.id)
        if (pendingHabits.length > 0) {
          modalDispatch({ type: 'showNewDay', payload: pendingHabits })
        } else {
          resetDailyHabits()
        }
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

    const localStorageLastResetDate: string | null = localStorage.getItem('lastResetDate')
    if (localStorageLastResetDate) {
      const lastResetDate: Date = new Date(localStorageLastResetDate)
      lastResetDate.setHours(0, 0, 0, 0)
      hasResetToday.current = getHasResetToday(lastResetDate)
    } else {
      saveTodayDateOnLocalStorage()
    }
  }, [])

  useEffect(() => {

    if (process.env.NODE_ENV === 'development' && initialLoadRef.current) {
      return
    }

    if (!hasResetToday.current && habitsList.length > 0 && !hasCheckedPendingHabits.current) {
      hasCheckedPendingHabits.current = true
      const pendingHabits = habitsList.filter(habit => checkIfItsYesterdaysHabit(habit) && !habit.done)
        .map(habit => habit.id)
      if (pendingHabits.length > 0) {
        modalDispatch({ type: 'showNewDay', payload: pendingHabits })
      } else {
        resetDailyHabits()
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

  const habitsListFiltered = useMemo(() => {
    if (habitFilter === 0) return [...habitsList]
    if (habitFilter === 1) return habitsList.filter(habit => checkIfItsTodaysHabit(habit))
    return [...habitsList]
  }, [habitFilter, habitsList])



  function saveTodayDateOnLocalStorage() {
    const now: Date = new Date()
    now.setHours(0, 0, 0, 0)
    localStorage.setItem('lastResetDate', now.toString())
  }

  function resetDailyHabits() {
    saveTodayDateOnLocalStorage()
    modalDispatch({ type: 'hideModal' })
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
    if (checkIfItsYesterdaysHabit(habit)) {
      if (habit.done)
        return habit.streak
      return 0
    }
    return habit.streak
  }

  function checkIfItsTodaysHabit(habit: Habit) {
    const today = new Date().getDay()
    return checkHabitByDay(habit, today)
  }

  function checkIfItsYesterdaysHabit(habit: Habit) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1);
    return checkHabitByDay(habit, yesterday.getDay())
  }

  function checkHabitByDay(habit: Habit, weekDay: number) {
    return habit.daysOfTheWeek.includes(weekDay)
  }

  function createNewHabit(title: string) {
    const newHabit: Habit = {
      'id': uuidv4(),
      'title': title,
      'done': false,
      'streak': 0,
      'daysOfTheWeek': [0, 1, 2, 3, 4, 5, 6]
    }
    modalDispatch({ type: 'createHabit', payload: newHabit })
  }

  function finishHabitCreation() {
    if (modalState.type === 'createHabit' && modalState.data?.habit) {
      setHabitsList([...habitsList, modalState.data.habit])
      modalDispatch({ type: 'hideModal' })
    }
  }

  function cancelHabitCreation() {
    modalDispatch({ type: 'hideModal' })
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
            <HabitBox key={habit.id} habit={habit} updateHabit={updateHabit} deleteHabit={deleteHabit} onlyVisible={false} />
          ))
        }
      </Whiteboard>
      {
        modalState.type === 'newDay' && modalState.data?.pendingHabits &&
        <NewDayModal title='check yesterday habits' onStart={resetDailyHabits}>
          {habitsList.filter(habit => modalState.data?.pendingHabits?.includes(habit.id))
            .map(habit => (
              <HabitBox key={habit.id} habit={habit} updateHabit={updateHabit} deleteHabit={deleteHabit} />
            ))}
        </NewDayModal>
      }
      {
        modalState.type === 'createHabit' && modalState.data?.habit &&
        <Modal
          title={"create habit"}
          onClose={cancelHabitCreation}
          onSave={finishHabitCreation}
        >

          <Input
            value={modalState.data.habit.title}
            placeholder='type your habit'
            onSubmit={(v) => {
              modalDispatch({ type: 'updateHabit', payload: { title: v } })
            }}
            onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
          />
          <DayOfWeekSelector
            selectedDaysProps={modalState.data.habit.daysOfTheWeek}
            onChange={(days) => modalDispatch({ type: 'updateHabit', payload: { daysOfTheWeek: days } })}
          />
        </Modal>
      }
    </div>
  )
}

export default App
