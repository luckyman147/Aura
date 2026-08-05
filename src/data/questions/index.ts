import communication from './communication.json'
import finances from './finances.json'
import children from './children.json'
import marriage from './marriage.json'
import values from './values.json'
import intimacy from './intimacy.json'
import dailyLife from './daily-life.json'

export const sections = [
  communication,
  finances,
  children,
  marriage,
  values,
  intimacy,
  dailyLife
]

export type Section = typeof sections[number]
export type Subject = Section['subjects'][number]
export type Question = Subject['questions'][number]

export function getAllQuestions(): Question[] {
  return sections.flatMap(section =>
    section.subjects.flatMap(subject => subject.questions)
  )
}

export function getQuestionsByDepth(depth: 'light' | 'medium' | 'deep'): Question[] {
  return getAllQuestions().filter(q => q.depth === depth)
}

export function getQuestionsBySection(sectionId: string): Question[] {
  const section = sections.find(s => s.section === sectionId)
  if (!section) return []
  return section.subjects.flatMap(subject => subject.questions)
}

export function getRandomQuestions(count: number, depth?: 'light' | 'medium' | 'deep'): Question[] {
  const questions = depth ? getQuestionsByDepth(depth) : getAllQuestions()
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
