import type { TaskPriority, TaskStatus } from '../model/task'

export const statusLabelMap: Record<TaskStatus, string> = {
  todo: 'To do',
  inProgress: 'In progress',
  done: 'Done',
}

export const priorityLabelMap: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}
