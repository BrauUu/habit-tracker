import { useState, useMemo } from 'react'

import type { Todo } from '../types/habit'

import HabitSection from './habitSection'
import { TodoBox, DragOverlayTodoBox } from '../components/boxes/todoBox'
import Filter from '../components/filter'
import { useToast } from '../hooks/useToast';
import DatePicker from '../components/datePicker'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import type { AxiosResponse } from 'axios'
import type { OrderResponse } from '../types/api'

interface TodosSectionProps {
  todos: Todo[]
  setTodos: (updater: (todos: Todo[]) => Todo[]) => void
  onUpdateTodo: (id: string, habit: Todo) => Promise<AxiosResponse<Todo> | void>
  onOrderTodo: (id: string, oldPosition: number, newPosition: number) => Promise<AxiosResponse<OrderResponse> | void>
  onCheckTodo: (id: string, habit: Todo) => Promise<AxiosResponse<Todo> | void>
  onUncheckTodo: (id: string, habit: Todo) => Promise<AxiosResponse<Todo> | void>
  onDeleteTodo: (id: string) => Promise<AxiosResponse | void>
  onAddTodo: (habit: Todo) => Promise<AxiosResponse<Todo> | void>
}

export default function TodosSection({
  todos,
  setTodos,
  onUpdateTodo,
  onOrderTodo,
  onCheckTodo,
  onUncheckTodo,
  onDeleteTodo,
  onAddTodo,
}: TodosSectionProps) {

  const toast = useToast()
  const [todoFilter, setTodoFilter] = useState<number | null>(0)

  const filterOptions = [
    { 'label': 'active', 'value': 0 },
    { 'label': 'completed', 'value': 1 },
  ]

  const todosFilteredAndSorted = useMemo(() => {
     const filtered = todoFilter === 0 
     ? todos.filter(todo => checkIfItsDone(todo, false)) 
     : todos.filter(todo => checkIfItsDone(todo))

     return filtered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [todoFilter, todos])

  function checkIfItsDone(todo: Todo, isDone: boolean = true) {
    return (todo?.doneDate !== null && todo?.doneDate !== undefined) === isDone
  }             

  function createDefaultHabit(id:string, title: string): Partial<Todo> {
    return {
      id,
      title,
      dueDate: null,
      doneDate: null,
      order: todos.length + 1 || 1
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
        title="todo"
        habits={todosFilteredAndSorted}
        setHabits={setTodos}
        onUpdateHabit={onUpdateTodo}
        onOrderHabit={onOrderTodo}
        onCheckHabit={onCheckTodo}
        onUncheckHabit={onUncheckTodo}
        onDeleteHabit={onDeleteTodo}
        onAddHabit={onAddTodo}
        createDefaultHabit={createDefaultHabit}
        validateHabit={validateHabit}
        renderHabitBox={(todo, onCheckTodo, onUncheckTodo, modalDispatch) => (
          <TodoBox
            key={todo.id}
            todo={todo}
            checkTodo={onCheckTodo}
            uncheckTodo={onUncheckTodo}
            modalDispatch={modalDispatch}
          />
        )}
        renderModalFields={(habit, modalDispatch) => (
          <div className='flex justify-center'>
            <DatePicker date={habit.dueDate} placeholder='pick a deadline if needed' onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { dueDate: v } })} />
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
