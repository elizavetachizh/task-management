import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { statusLabelMap } from '../../entities/task/config/labels'
import type { Task } from '../../entities/task/model/types/task'
import { TASK_PRIORITIES, TASK_STATUSES } from '../../entities/task/model/types/task'
import {
  useCreateTagMutation,
  useCreateTaskMutation,
  useGetTagsQuery,
  useUpdateTaskMutation,
} from '../../shared/api/baseApi'
import { dateInputToDeadlineIso, isoDeadlineToDateInput } from './deadlineUtils'
import { taskFormSchema, type TaskFormValues } from './model/taskFormSchema'

const emptyDefaults: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  deadline: '',
  tags: [],
}

function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    deadline: isoDeadlineToDateInput(task.deadline),
    tags: [...task.tags],
  }
}

type TaskUpsertDialogProps = {
  open: boolean
  onClose: () => void
  /** Если передан — режим редактирования */
  task?: Task | null
}

export default function TaskUpsertDialog({ open, onClose, task }: TaskUpsertDialogProps) {
  const isEdit = Boolean(task)
  const { data: tagsData = [], isLoading: tagsLoading } = useGetTagsQuery()
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const [createTag] = useCreateTagMutation()

  const tagOptions = useMemo(() => tagsData.map((t) => t.name), [tagsData])

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: emptyDefaults,
  })

  useEffect(() => {
    if (!open) return
    if (task) {
      reset(taskToFormValues(task))
    } else {
      reset(emptyDefaults)
    }
  }, [open, task, reset])

  const isPending = isCreating || isUpdating
  const isBusy = isPending || tagsLoading

  const onSubmit = handleSubmit(async (values) => {
    try {
      const knownTags = new Set(tagOptions)
      for (const name of values.tags) {
        const trimmed = name.trim()
        if (!trimmed) continue
        if (!knownTags.has(trimmed)) {
          await createTag(trimmed).unwrap()
          knownTags.add(trimmed)
        }
      }

      const payload = {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        status: values.status,
        priority: values.priority,
        deadline: dateInputToDeadlineIso(values.deadline),
        tags: values.tags.map((t) => t.trim()).filter(Boolean),
      }

      if (isEdit && task) {
        await updateTask({ id: task.id, data: payload }).unwrap()
      } else {
        await createTask(payload).unwrap()
      }

      onClose()
    } catch {
      // Snackbar позже
    }
  })

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={() => {
        if (!isPending) onClose()
      }}
    >
      <DialogTitle>{isEdit ? 'Редактирование задачи' : 'Новая задача'}</DialogTitle>
      <form onSubmit={onSubmit} noValidate>
        <DialogContent sx={{ pt: 1 }}>
          {isPending && <LinearProgress sx={{ mb: 2 }} />}

          <TextField
            {...register('title')}
            label="Заголовок"
            fullWidth
            required
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
            autoFocus={!isEdit}
          />

          <TextField
            {...register('description')}
            label="Описание"
            fullWidth
            multiline
            minRows={2}
            margin="normal"
            error={!!errors.description}
            helperText={errors.description?.message ?? `${500} символов макс.`}
            inputProps={{ maxLength: 500 }}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Статус"
                fullWidth
                required
                margin="normal"
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                {TASK_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {statusLabelMap[s]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <FormControl
            component="fieldset"
            margin="normal"
            fullWidth
            error={!!errors.priority}
          >
            <FormLabel component="legend">Приоритет</FormLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  {TASK_PRIORITIES.map((p) => (
                    <FormControlLabel
                      key={p}
                      value={p}
                      control={<Radio />}
                      label={p === 'low' ? 'Низкий' : p === 'medium' ? 'Средний' : 'Высокий'}
                    />
                  ))}
                </RadioGroup>
              )}
            />
            {errors.priority ? (
              <FormHelperText>{errors.priority.message}</FormHelperText>
            ) : null}
          </FormControl>

          <TextField
            {...register('deadline')}
            label="Дедлайн"
            type="date"
            fullWidth
            required
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.deadline}
            helperText={errors.deadline?.message}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                options={tagOptions}
                loading={tagsLoading}
                onChange={(_, value) => field.onChange(value)}
                onBlur={field.onBlur}
                value={field.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Теги"
                    margin="normal"
                    placeholder="Выберите или введите"
                    error={!!errors.tags}
                    helperText={errors.tags?.message as string | undefined}
                  />
                )}
                filterSelectedOptions
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isPending}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isBusy}>
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
