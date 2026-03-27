import { describe, expect, it } from 'vitest'
import { taskFormSchema } from './taskFormSchema'

const validBase = {
  title: 'Достаточно длинный заголовок',
  description: '',
  status: 'todo' as const,
  priority: 'medium' as const,
  deadline: '2026-04-01',
  tags: ['ui'],
}

describe('taskFormSchema', () => {
  it('accepts valid payload', () => {
    const r = taskFormSchema.safeParse(validBase)
    expect(r.success).toBe(true)
  })

  it('rejects title shorter than 5 characters', () => {
    const r = taskFormSchema.safeParse({ ...validBase, title: 'abc' })
    expect(r.success).toBe(false)
  })

  it('rejects description longer than 500 characters', () => {
    const r = taskFormSchema.safeParse({
      ...validBase,
      description: 'x'.repeat(501),
    })
    expect(r.success).toBe(false)
  })

  it('rejects empty tags', () => {
    const r = taskFormSchema.safeParse({ ...validBase, tags: [] })
    expect(r.success).toBe(false)
  })

  it('rejects empty deadline', () => {
    const r = taskFormSchema.safeParse({ ...validBase, deadline: '' })
    expect(r.success).toBe(false)
  })
})
