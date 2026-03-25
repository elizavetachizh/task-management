import { z } from 'zod'
import { TASK_PRIORITIES, TASK_STATUSES } from '../../../entities/task/model/types/task'

export const taskFormSchema = z.object({
  title: z.string().trim().min(5, 'Минимум 5 символов'),
  description: z.string().max(500, 'Максимум 500 символов'),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  deadline: z.string().min(1, 'Выберите дедлайн'),
  tags: z.array(z.string()).min(1, 'Нужен хотя бы один тег'),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
