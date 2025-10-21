import { v4 as uuidv4 } from 'uuid';
import type { Habit } from './types'

import { useEffect, useState, useRef } from 'react'
import Whiteboard from './components/whiteboard'
import HabitBox from './components/boxes/habitbox'
import Title from './components/title'
import Input from './components/input'

function App() {

  const [habitsList, setHabitsList] = useState<Habit[]>([])
  const initialLoadRef = useRef(true)

  useEffect(() => {

    let hl: Habit[] = JSON.parse((localStorage.getItem('habitsList') || '[]'))
    setHabitsList(hl)

  }, [])

  useEffect(() => {

    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    localStorage.setItem('habitsList', JSON.stringify(habitsList))
  }, [habitsList])

  function createNewHabit(title: string) {
    const newHabit: Habit = {
      'id': uuidv4(),
      'title': title,
      'done': false,
      'daysOfTheWeek': [0,1,2,3,4,5,6]
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
    <div className='p-16 flex flex-col gap-2'>
      <Title value='daily habits' />
      <Whiteboard>
        <Input placeholder='add habit' onSubmit={createNewHabit} submitOnEnter={true}></Input>
        {
          habitsList.map((habit) => {
            return <HabitBox key={habit.id} habit={habit} updateHabit={updateHabit} deleteHabit={deleteHabit} />
          })
        }
      </Whiteboard>
    </div>
  )
}

export default App
