import { useState, useMemo } from 'react'

import type { Todo } from '../types/habit'

import HabitSection from './habitSection'
import { TodoBox, DragOverlayTodoBox } from '../components/boxes/todobox'
import Filter from '../components/filter'
import { useToast } from '../hooks/useToast';
import DatePicker from '../components/datePicker'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface TodosSectionProps {
  todos: Todo[]
  setTodos: (updater: (todos: Todo[]) => Todo[]) => void
  onUpdateTodo: (id: string, key: string, value: any) => void
  onDeleteTodo: (id: string) => void
  onAddTodo: (habit: Todo) => void
}

export default function TodosSection({
  todos,
  setTodos,
  onUpdateTodo,
  onDeleteTodo,
  onAddTodo,
}: TodosSectionProps) {

  const toast = useToast()
  const [todoFilter, setTodoFilter] = useState<number | null>(0)

  const filterOptions = [
    { 'label': 'active', 'value': 0 },
    { 'label': 'completed', 'value': 1 },
  ]

  const todosFiltered = useMemo(() => {
    if (todoFilter === 0) return todos.filter(todo => checkIfItsDone(todo, false))
    if (todoFilter === 1) return todos.filter(todo => checkIfItsDone(todo))
    return [...todos]
  }, [todoFilter, todos])

  function checkIfItsDone(todo: Todo, isDone: boolean = true) {
    return (todo?.doneDate !== undefined) === isDone
  }

  function createDefaultHabit(id: string, title: string): Todo {
    return {
      id,
      title,
      type: 'to do',
      dueDate: null
    }
  }

  function validateHabit(habit: Todo): boolean {
    if (!habit.title) {
      toast.validationError('title')
      return false
    }
    return true
  }


  return (
    <>
      <HabitSection
        title="to do's"
        habits={todosFiltered}
        setHabits={setTodos}
        onUpdateHabit={onUpdateTodo}
        onDeleteHabit={onDeleteTodo}
        onAddHabit={onAddTodo}
        createDefaultHabit={createDefaultHabit}
        validateHabit={validateHabit}
        renderHabitBox={(todo, updateHabit, modalDispatch) => (
          <TodoBox
            key={todo.id}
            todo={todo}
            updateHabit={updateHabit}
            modalDispatch={modalDispatch}
          />
        )}
        renderModalFields={(habit, modalDispatch) => (
          <div className='flex justify-center'>
            <DatePicker date={habit.dueDate}  placeholder='pick a deadline if needed' onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { dueDate: v } })} />
          </div>
        )}
        renderDragOverlay={(todo) => (
          <DragOverlayTodoBox key={todo.id} todo={todo} />
        )}
        headerExtra={<Filter value={todoFilter} onChange={setTodoFilter} filters={filterOptions} />}
        contentExtra={
          todoFilter == 1 &&
          <p className='text-xs text-center text-secondary-200'>completed todos are deleted after 7 days</p>
        }
        withoutContent={{
          icon: CheckCircleIcon,
          title: 'to do\'s will show here',
          text: 'to-do\'s are one-time tasks with optional deadlines. complete them once to check them off your list.'
        }}
      />
    </>
  )
}
