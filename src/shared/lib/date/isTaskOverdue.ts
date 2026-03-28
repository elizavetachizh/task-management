/** Task slice needed to decide overdue (done tasks are never overdue). */
export type TaskOverdueInput = {
  status: 'todo' | 'inProgress' | 'done'
  deadline: string
}

/**
 * Overdue if not done and calendar day of deadline has passed (end of local day).
 */
export function isTaskOverdue(task: TaskOverdueInput): boolean {
  if (task.status === 'done') return false
  const d = new Date(task.deadline)
  if (Number.isNaN(d.getTime())) return false
  const endOfDeadline = new Date(d)
  endOfDeadline.setHours(23, 59, 59, 999)
  return endOfDeadline < new Date()
}
