import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CreateTaskInput, GetTasksParams, Task, UpdateTaskInput, UpdateTaskStatusInput } from '../../entities/task/model/types/task'
import type { Tag } from '../../entities/tag/model/types/tag'


type GetTasksResponse = {
  data: Task[]
  total: number
}


const buildTasksParams = (params?: GetTasksParams) => {
  if (!params) return undefined
  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.priority ? { priority: params.priority } : {}),
    ...(params.tag ? { tags_like: params.tag } : {}), // для массива tags в json-server
    // json-server v1: подстрока — через :contains (не title_like и не title= из v0)
    ...(params.search ? { title_like: params.search } : {}),
    ...(params.sortBy ? { _sort: params.sortBy } : {}),
    ...(params.order ? { _order: params.order } : {}),
    ...(params.page ? { _page: params.page } : {}),
    ...(params.limit ? { _limit: params.limit } : {}),
  }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),
  tagTypes: ['Task', 'Tag'],
  endpoints: (builder) => ({
// tasks
getTasks: builder.query<GetTasksResponse, GetTasksParams | undefined>({
  query: (params) => ({
    url: '/tasks', 
    params:buildTasksParams(params),

  }),
  transformResponse: (response: Task[], meta) => ({
    data: response,
    total: Number(meta?.response?.headers.get('X-Total-Count') ?? response.length),
  }),
  providesTags: (result) =>
    result
      ? [
          ...result.data.map((task) => ({ type: 'Task' as const, id: task.id })),
          { type: 'Task' as const, id: 'LIST' },
        ]
      : [{ type: 'Task' as const, id: 'LIST' }],
  }),


  getTaskById: builder.query<Task, string>({
    query: (id) => `/tasks/${id}`,
    providesTags: (_result, _error, id) => [{ type: 'Task', id }],
  }),

  createTask: builder.mutation<Task, CreateTaskInput>({
    query: (task) => {
      const now = new Date().toISOString()
      return {
        url: '/tasks',
        method: 'POST',
        body: {
          ...task,
          createdAt: now,
          updatedAt: now,
        },
      }
    },
    invalidatesTags: [{ type: 'Task', id: 'LIST' }],
  }),

  updateTask: builder.mutation<Task, { id: string; data: UpdateTaskInput }>({
    query: ({ id, data }) => ({
      url: `/tasks/${id}`,
      method: 'PATCH',
      body: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    }),
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Task', id },
      { type: 'Task', id: 'LIST' },
    ],
  }),
  updateTaskStatus: builder.mutation<Task, { id: string; data: UpdateTaskStatusInput }>({
    query: ({ id, data }) => ({
      url: `/tasks/${id}`,
      method: 'PATCH',
      body: {
        ...data,
      },
    }),
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Task', id },
      { type: 'Task', id: 'LIST' },
    ],
  }),

  deleteTask: builder.mutation<void, string>({
    query: (id) => ({
      url: `/tasks/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: (_result, _error, id) => [
      { type: 'Task', id },
      { type: 'Task', id: 'LIST' },
    ],
  }),

  // tags
  getTags: builder.query<Tag[], void>({
    query: () => '/tags',
    providesTags: [{ type: 'Tag', id: 'LIST' }],
  }),

  createTag: builder.mutation<Tag, string>({
    query: (name) => ({
      url: '/tags',
      method: 'POST',
      body: { name },
    }),
    invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
  }),

})
})
export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
   useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetTagsQuery,
  useCreateTagMutation,
} = baseApi