import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import TaskCard from '../entities/task/ui/TaskCard'
import TaskUpsertDialog from '../features/task-form/TaskUpsertDialog'
import { useGetTasksQuery } from '../shared/api/baseApi'

export default function TasksListPage() {
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')
  const trimmedSearch = search.trim()

  const queryArgs = trimmedSearch ? { search: trimmedSearch } : {}
  const { data, isLoading, isFetching, error } = useGetTasksQuery(queryArgs)
  const tasks = data?.data ?? []

  return (
    <Container
      maxWidth="lg"
      disableGutters={false}
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: { xs: 2, sm: 2 } }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Задачи
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
          Новая задача
        </Button>
      </Stack>

      <TextField
        fullWidth
        size="small"
        placeholder="Поиск по названию"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Поиск по названию задачи"
        sx={{ mb: { xs: 2, sm: 3 }, maxWidth: { sm: 400 } }}
        slotProps={{
          input: {
            endAdornment: isFetching ? (
              <InputAdornment position="end">
                <CircularProgress color="inherit" size={20} />
              </InputAdornment>
            ) : undefined,
          },
        }}
      />

      {error ? (
        <Typography color="error">Ошибка при загрузке задач</Typography>
      ) : isLoading && !data ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={240}
        >
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography color="text.secondary">
          {trimmedSearch
            ? 'Ничего не найдено по этому запросу.'
            : 'Не было создано ни одной задачи.'}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, sm: 2.5 },
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              sm: 'repeat(3, minmax(0, 1fr))',
            },
            maxWidth: 1200,
            mx: 'auto',
            opacity: isFetching ? 0.65 : 1,
            transition: (theme) =>
              theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => navigate(`/task/${task.id}`)}
            />
          ))}
        </Box>
      )}

      <TaskUpsertDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Container>
  )
}
