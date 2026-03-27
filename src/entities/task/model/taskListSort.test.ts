import { describe, expect, it } from 'vitest'
import { parseSortOption } from './taskListSort'

describe('parseSortOption', () => {
  it('maps createdAt:desc', () => {
    expect(parseSortOption('createdAt:desc')).toEqual({
      sortBy: 'createdAt',
      order: 'desc',
    })
  })

  it('maps deadline:asc', () => {
    expect(parseSortOption('deadline:asc')).toEqual({
      sortBy: 'deadline',
      order: 'asc',
    })
  })
})
