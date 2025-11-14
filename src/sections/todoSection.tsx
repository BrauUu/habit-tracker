import { TrashIcon } from '@heroicons/react/24/solid'
import { useState, useMemo } from 'react'

import type { Todo } from '../types/habit'

import HabitSection from './habitSection'
import { TodoBox, DragOverlayTodoBox } from '../components/boxes/todobox'
import Filter from '../components/filter'
import { useToast } from '../hooks/useToast';
import Button from '../components/button'

interface TodosSectionProps {
  todos: Todo[]
  setTodos: (updater: (todos: Todo[]) => Todo[]) => void
  onUpdateTodo: (id: string, key: string, value: any) => void
  onDeleteTodo: (id: string) => void
  onAddTodo: (habit: Todo) => void
  onCleanDoneTodos: () => void
}

export default function TodosSection({
  todos,
  setTodos,
  onUpdateTodo,
  onDeleteTodo,
  onAddTodo,
  onCleanDoneTodos
}: TodosSectionProps) {

  const toast = useToast()
  const [todoFilter, setTodoFilter] = useState<number | null>(1)

  const filterOptions = [
    { 'label': 'active', 'value': 0 },
    { 'label': 'completed', 'value': 1 }
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
      type: 'todo',
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
        title="todos"
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
        renderDragOverlay={(todo) => (
          <DragOverlayTodoBox key={todo.id} todo={todo} />
        )}
        headerExtra={<Filter value={todoFilter} onChange={setTodoFilter} filters={filterOptions} />}
        contentExtra={
          todoFilter == 1 &&
            <p className='text-xs text-center text-secondary-200'>completed todos are deleted after 7 days</p>
        }
      />
    </>
  )
}
