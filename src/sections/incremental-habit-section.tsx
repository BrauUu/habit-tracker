import { useState, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import type { IncrementalHabit } from '../types/habit'
import { modalReducer } from '../reducers/modalReducer'

import Whiteboard from '../components/whiteboard'
import { IncrementalHabitBox, DragOverlayIncrementalHabitBox } from '../components/boxes/incrementalhabitbox'
import Title from '../components/title'
import Input from '../components/input'
import Modal from '../components/modal/default';

interface IncrementalHabitsSectionProps {
  incrementalHabits: IncrementalHabit[]
  setIncrementalHabits: (updater: (incrementalHabits: IncrementalHabit[]) => IncrementalHabit[]) => void
  onUpdateIncrementalHabit: (id: string, key: string, value: any) => void
  onDeleteIncrementalHabit: (id: string) => void
  onAddIncrementalHabit: (habit: IncrementalHabit) => void
}

export default function IncrementalHabitsSection({
  incrementalHabits,
  setIncrementalHabits,
  onUpdateIncrementalHabit,
  onDeleteIncrementalHabit,
  onAddIncrementalHabit
}: IncrementalHabitsSectionProps) {

  const [dragHabit, setDragHabit] = useState<IncrementalHabit | null>(null)
  const [modalState, modalDispatch] = useReducer(modalReducer, { type: null })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function createNewHabit(title: string) {
    const newHabit: IncrementalHabit = {
      'id': uuidv4(),
      'title': title,
      'type': 'incremental',
      'positiveCount': 0,
      'negativeCount': 0
    }
    modalDispatch({ type: 'createHabit', payload: newHabit })
  }

  function finishHabitCreation() {
    if (modalState.type === 'createHabit' && modalState.data?.habit) {
      onAddIncrementalHabit(modalState.data.habit as IncrementalHabit)
      modalDispatch({ type: 'hideModal' })
    }
  }

  function cancelHabitCreation() {
    modalDispatch({ type: 'hideModal' })
  }

  function handleSave() {
    const habit = modalState.data?.habit
    if (!habit) return

    if (habit.type === 'incremental') {
      if (habit.title) {
        onUpdateIncrementalHabit(habit.id, 'title', habit.title)
      }
    }
    closeModal()
  }

  function closeModal() {
    modalDispatch({ type: "hideModal" })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setIncrementalHabits((incrementalHabits) => {
        const oldIndex = incrementalHabits.findIndex(h => h.id === active.id);
        const newIndex = incrementalHabits.findIndex(h => h.id === over?.id);

        return arrayMove(incrementalHabits, oldIndex, newIndex);
      });
    }

    setDragHabit(null);
    document.body.classList.remove('dragging');
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const habit = incrementalHabits.find(h => h.id === active.id) ?? null;
    setDragHabit(habit);
    document.body.classList.add('dragging');
  }

  return (
    <div className='flex flex-col gap-1 w-full md:w-1/2 lg:w-1/4 max-h-full'>
      <div className='flex flex-row justify-between'>
        <Title value='incremental' />
      </div>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={incrementalHabits.map(h => h.id)}
          strategy={verticalListSortingStrategy}
        >
          <Whiteboard>
            <Input placeholder='add habit' onSubmit={createNewHabit} submitOnEnter={true}></Input>
            {
              incrementalHabits.map((habit) => (
                <IncrementalHabitBox
                  key={habit.id}
                  habit={habit}
                  updateHabit={onUpdateIncrementalHabit}
                  modalDispatch={modalDispatch}
                  onlyVisible={false}
                />
              ))
            }
          </Whiteboard>
        </SortableContext>
        <DragOverlay>
          {dragHabit &&
            <DragOverlayIncrementalHabitBox key={dragHabit?.id} habit={dragHabit} />
          }
        </DragOverlay>
      </DndContext>
      {
        modalState.type === 'createHabit' && modalState.data?.habit &&
        <Modal
          title={"create incremental habit"}
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
        </Modal>
      }
      {modalState.type === 'updateHabit' && modalState.data?.habit &&
        <Modal
          title={"edit habit"}
          onClose={closeModal}
          onSave={handleSave}
        >
          <Input
            value={modalState.data.habit.title}
            placeholder='type your habit'
            onSubmit={(v) => {
              modalDispatch({ type: 'updateHabit', payload: { title: v } })
              handleSave()
            }}
            onChange={(v) => modalDispatch({ type: 'updateHabit', payload: { title: v } })}
          />
        </Modal>
      }
      {
        modalState.type === 'deleteHabit' && modalState.data?.habit &&
        <Modal
          title={"delete habit"}
          onClose={closeModal}
          onSave={() => {
            if (modalState.data?.habit?.id)
              onDeleteIncrementalHabit(modalState.data.habit.id)
            closeModal()
          }
          }
          confirmButtonText={"delete"}
        >
          <p>are you sure you want to delete the habit <strong>{modalState.data.habit.title}</strong> ?</p>
        </Modal>
      }
    </div>
  )
}
