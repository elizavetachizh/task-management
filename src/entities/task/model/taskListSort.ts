import type { GetTasksParams } from './task'

/** Значение селекта сортировки на списке задач → маппится в `GetTasksParams.sortBy` + `order`. */
export type SortOption =
  | 'createdAt:desc'
  | 'createdAt:asc'
  | 'deadline:asc'
  | 'deadline:desc'

export function parseSortOption(
  v: SortOption,
): Pick<GetTasksParams, 'sortBy' | 'order'> {
  const [sortBy, order] = v.split(':') as [
    'createdAt' | 'deadline',
    'asc' | 'desc',
  ]
  return { sortBy, order }
}
