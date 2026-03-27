const deadlineDisplay = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** Дедлайн для UI: пример: `05.04.2026` (локальная календарная дата). */
export function formatTaskDeadline(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return deadlineDisplay.format(d)
}
