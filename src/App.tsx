import { v4 as uuidv4 } from 'uuid';
import type { Habit } from './types'

import { useEffect, useState } from 'react'
import Whiteboard from './components/whiteboard'
import HabitBox from './components/boxes/habitbox'
import Title from './components/title'
import Input from './components/input'

function App() {

  const [habitsList, setHabitsList] = useState<Habit[]>([])

  useEffect(() => {

    let hl : Habit[] = JSON.parse((localStorage.getItem('habitsList') || '[]'))
    setHabitsList(hl)

  }, [])

  useEffect(() => {
    if(habitsList.length)
      localStorage.setItem('habitsList', JSON.stringify(habitsList))
  }, [habitsList])

  function createNewHabit(title: string) {
    const newHabit : Habit = {
      'id' : uuidv4(),
      'description' : title,
      'done' : false,
    }
    setHabitsList([...habitsList, newHabit])
  }

  function updateHabit(id: string, key: string, value: any) {
    setHabitsList(prevValue =>
      prevValue.map(habit => habit.id === id ? {...habit, [key]: value} : habit)
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
        <Input placeholder='add habit' onSubmit={createNewHabit}></Input>
        {
          habitsList.map((habit) => {
            return <HabitBox key={habit.id} habit={habit} updateHabit={updateHabit} deleteHabit={deleteHabit}/>
          })
        }
      </Whiteboard>
    </div>
  )
}

export default App
