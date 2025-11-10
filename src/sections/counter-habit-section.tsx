import { useState, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { CounterHabit } from '../types/types'
import { modalReducer } from '../reducers/modalReducer'

import Whiteboard from '../components/whiteboard'
import { CounterHabitBox, DragOverlayCounterHabitBox } from '../components/boxes/counterhabitbox'
import Title from '../components/title'
import Input from '../components/input'
import Modal from '../components/modal/default';

interface CounterHabitsSectionProps {
  counterHabits: CounterHabit[]
  onUpdateCounterHabit: (id: string, key: string, value: any) => void
  onDeleteCounterHabit: (id: string) => void
  onAddCounterHabit: (habit: CounterHabit) => void
}

export default function CounterHabitsSection({
  counterHabits, 
  onUpdateCounterHabit, 
  onDeleteCounterHabit, 
  onAddCounterHabit
}: CounterHabitsSectionProps) {

  const [dragHabit, setDragHabit] = useState<CounterHabit | null>(null)
  const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function createNewHabit(title: string) {
    const newHabit: CounterHabit = {
      'id': uuidv4(),
      'title': title,
      'type': 'counter',
      'positiveCount': 0,
      'negativeCount': 0
    }
    modalDispatch({ type: 'createHabit', payload: newHabit })
  }

  function finishHabitCreation() {
    if (modalState.type === 'createHabit' && modalState.data?.habit) {
      onAddCounterHabit(modalState.data.habit as CounterHabit)
      modalDispatch({ type: 'hideModal' })
    }
  }

  function cancelHabitCreation() {
    modalDispatch({ type: 'hideModal' })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = counterHabits.findIndex(h => h.id === active.id);
      const newIndex = counterHabits.findIndex(h => h.id === over?.id);
      const newOrder = arrayMove(counterHabits, oldIndex, newIndex);
      
      // Atualiza a ordem de todos os hábitos
      newOrder.forEach((habit, index) => {
        onUpdateCounterHabit(habit.id, 'order', index);
      });
    }
    
    setDragHabit(null);
    document.body.classList.remove('dragging');
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const habit = counterHabits.find(h => h.id === active.id) ?? null;
    setDragHabit(habit);
    document.body.classList.add('dragging');
  }

  return (
    <div className='m-16 flex flex-col gap-1 w-full md:w-1/2 lg:w-1/4'>
      <div className='flex flex-row justify-between'>
        <Title value='counter habits' />
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={counterHabits.map(h => h.id)}
          strategy={verticalListSortingStrategy}
        >
          <Whiteboard>
            <Input placeholder='add counter habit' onSubmit={createNewHabit} submitOnEnter={true}></Input>
            {
              counterHabits.map((habit) => (
                <CounterHabitBox 
                  key={habit.id} 
                  habit={habit} 
                  updateHabit={onUpdateCounterHabit} 
                  modalDispatch={modalDispatch}
                  onlyVisible={false} 
                />
              ))
            }
          </Whiteboard>
        </SortableContext>
        <DragOverlay style={{ cursor: 'grabbing' }}>
          {dragHabit &&
            <DragOverlayCounterHabitBox key={dragHabit?.id} habit={dragHabit} />
          }
        </DragOverlay>
      </DndContext>
      {
        modalState.type === 'createHabit' && modalState.data?.habit &&
        <Modal
          title={"create counter habit"}
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
          <p className='text-sm text-secondary/70'>
            Use + when you follow the habit, - when you do the opposite
          </p>
        </Modal>
      }
    </div>
  )
}
