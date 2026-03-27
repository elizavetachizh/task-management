import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isTaskOverdue } from './isTaskOverdue'

describe('isTaskOverdue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-20T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false when status is done', () => {
    expect(
      isTaskOverdue({
        status: 'done',
        deadline: '2010-01-01T00:00:00.000Z',
      }),
    ).toBe(false)
  })

  it('returns false for invalid deadline', () => {
    expect(
      isTaskOverdue({
        status: 'todo',
        deadline: 'invalid',
      }),
    ).toBe(false)
  })

  it('returns true when deadline local end-of-day is before now', () => {
    expect(
      isTaskOverdue({
        status: 'todo',
        deadline: '2019-06-01T12:00:00.000Z',
      }),
    ).toBe(true)
  })

  it('returns false when deadline is in the future', () => {
    expect(
      isTaskOverdue({
        status: 'inProgress',
        deadline: '2030-12-31T00:00:00.000Z',
      }),
    ).toBe(false)
  })
})
