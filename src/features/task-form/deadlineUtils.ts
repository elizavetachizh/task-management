/** Для поля type="date" (локальный календарный день). */
export function isoDeadlineToDateInput(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dateInputToDeadlineIso(dateInput: string) {
  return `${dateInput}T18:00:00.000Z`
}
