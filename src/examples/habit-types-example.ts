import { Habit, DailyHabit, WeeklyHabit } from '../types/types'

// ✅ EXEMPLOS DE USO DA DISCRIMINATED UNION

// 1. Hábito Diário - daysOfTheWeek é OBRIGATÓRIO
const dailyHabit: DailyHabit = {
  id: '1',
  title: 'Exercitar-se',
  done: false,
  streak: 5,
  type: 'daily',
  daysOfTheWeek: [1, 2, 3, 4, 5] // ← OBRIGATÓRIO para daily
}

// 2. Hábito Semanal - daysOfTheWeek é OPCIONAL
const weeklyHabit: WeeklyHabit = {
  id: '2',
  title: 'Limpeza geral',
  done: false,
  streak: 2,
  type: 'weekly'
  // daysOfTheWeek é opcional aqui
}

// 3. Hábito Semanal com dias específicos
const weeklyHabitWithDays: WeeklyHabit = {
  id: '3',
  title: 'Reunião semanal',
  done: true,
  streak: 10,
  type: 'weekly',
  daysOfTheWeek: [1] // ← OPCIONAL para weekly
}

// 4. Função que usa Type Guards (TypeScript infere automaticamente)
function processHabit(habit: Habit) {
  if (habit.type === 'daily') {
    // ✅ TypeScript sabe que é DailyHabit
    // daysOfTheWeek está garantido como number[]
    console.log(`Hábito diário nos dias: ${habit.daysOfTheWeek.join(', ')}`)
  } else {
    // ✅ TypeScript sabe que é WeeklyHabit  
    // daysOfTheWeek pode ser undefined
    const days = habit.daysOfTheWeek || []
    console.log(`Hábito semanal: ${days.length > 0 ? days.join(', ') : 'qualquer dia'}`)
  }
}

// 5. Exemplos de ERROS que o TypeScript vai capturar:

// ❌ ERRO: daysOfTheWeek é obrigatório para daily
// const invalidDaily: DailyHabit = {
//   id: '4',
//   title: 'Inválido',
//   done: false,
//   streak: 0,
//   type: 'daily'
//   // ❌ Faltou daysOfTheWeek
// }

// ❌ ERRO: tipo não corresponde
// const invalidType: DailyHabit = {
//   id: '5',
//   title: 'Inválido',
//   done: false,
//   streak: 0,
//   type: 'weekly', // ❌ Deveria ser 'daily'
//   daysOfTheWeek: [1, 2, 3]
// }

export { dailyHabit, weeklyHabit, weeklyHabitWithDays, processHabit }