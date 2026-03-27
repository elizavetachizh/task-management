import { describe, expect, it } from 'vitest'
import { formatTaskDeadline } from './formatTaskDeadline'

describe('formatTaskDeadline', () => {
  it('returns original string when date is invalid', () => {
    expect(formatTaskDeadline('not-a-date')).toBe('not-a-date')
  })

  it('formats valid ISO to dd.mm.yyyy (ru locale)', () => {
    const out = formatTaskDeadline('2026-06-15T12:00:00.000Z')
    expect(out).toMatch(/^\d{2}\.\d{2}\.\d{4}$/)
    expect(out).toContain('2026')
  })
})
