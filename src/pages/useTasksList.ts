import { useEffect, useMemo, useState } from 'react'
import type {
  GetTasksParams,
  TaskPriority,
  TaskStatus,
} from '../entities/task/model/task'
import {
  parseSortOption,
  type SortOption,
} from '../entities/task/model/taskListSort'
import { useGetTagsQuery, useGetTasksQuery } from '../shared/api/baseApi'

export default function useTasksList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('')
  const [tagFilter, setTagFilter] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('createdAt:desc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(6)

  const trimmedSearch = search.trim()

  const queryArgs = useMemo((): GetTasksParams => {
    const q: GetTasksParams = {
      ...parseSortOption(sortOption),
    }
    if (trimmedSearch) q.search = trimmedSearch
    if (statusFilter) q.status = statusFilter
    if (priorityFilter) q.priority = priorityFilter
    if (tagFilter) q.tag = tagFilter
    if (!tagFilter) {
      q.page = page + 1
      q.limit = rowsPerPage
    }
    return q
  }, [
    trimmedSearch,
    statusFilter,
    priorityFilter,
    tagFilter,
    sortOption,
    page,
    rowsPerPage,
  ])

  useEffect(() => {
    setPage(0)
  }, [trimmedSearch, statusFilter, priorityFilter, tagFilter, sortOption])

  const { data: tagsData = [] } = useGetTagsQuery()
  const { data, isLoading, isFetching, error } = useGetTasksQuery(queryArgs)
  const tasks = data?.data ?? []
  const totalCount = data?.total ?? 0

  const displayedTasks = useMemo(() => {
    if (!tagFilter) return tasks
    return tasks.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    )
  }, [tasks, tagFilter, page, rowsPerPage])

  const hasFilters = Boolean(
    trimmedSearch || statusFilter || priorityFilter || tagFilter,
  )

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setPriorityFilter('')
    setTagFilter('')
    setPage(0)
  }

  return {
    totalCount,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    displayedTasks,
    hasFilters,
    clearFilters,
    isLoading,
    isFetching,
    error,
    hasData: data != null,
    tagsData,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    tagFilter,
    setTagFilter,
    sortOption,
    setSortOption,
  }
}
