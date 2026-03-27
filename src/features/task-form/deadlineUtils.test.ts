import { describe, expect, it } from 'vitest'
import { dateInputToDeadlineIso, isoDeadlineToDateInput } from './deadlineUtils'

describe('dateInputToDeadlineIso', () => {
  it('appends fixed time in UTC', () => {
    expect(dateInputToDeadlineIso('2026-03-20')).toBe(
      '2026-03-20T18:00:00.000Z',
    )
  })
})

describe('isoDeadlineToDateInput', () => {
  it('returns empty string for invalid iso', () => {
    expect(isoDeadlineToDateInput('')).toBe('')
    expect(isoDeadlineToDateInput('not-valid')).toBe('')
  })

  it('returns yyyy-mm-dd for valid iso', () => {
    const out = isoDeadlineToDateInput('2026-08-10T18:00:00.000Z')
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
