import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskCard from '../entities/task/ui/TaskCard'
import TaskUpsertDialog from '../features/task-form/TaskUpsertDialog'
import TagsManageDialog from '../widgets/tags-manage-dialog'
import TasksFilters from '../widgets/tasks-filters'
import TasksPagination from '../widgets/tasks-pagination'
import useTasksList from './useTasksList'

export default function TasksListPage() {
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false)
  const {
    totalCount,
    displayedTasks,
    hasFilters,
    clearFilters,
    isLoading,
    isFetching,
    error,
    hasData,
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
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  } = useTasksList()

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
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          justifyContent={{ xs: 'stretch', sm: 'flex-end' }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setTagsDialogOpen(true)}
          >
            Теги
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateOpen(true)}
          >
            Новая задача
          </Button>
        </Stack>
      </Stack>

      <TasksFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
        hasFilters={hasFilters}
        clearFilters={clearFilters}
        isFetching={isFetching}
        tagsData={tagsData}
      />

      {error ? (
        <Typography color="error">Ошибка при загрузке задач</Typography>
      ) : isLoading && !hasData ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={240}
        >
          <CircularProgress />
        </Box>
      ) : totalCount === 0 ? (
        <Typography color="text.secondary">
          {hasFilters
            ? 'Ничего не найдено по выбранным фильтрам.'
            : 'Не было создано ни одной задачи.'}
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              alignItems: 'stretch',
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
            {displayedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => navigate(`/task/${task.id}`)}
                onTagClick={(tag) =>
                  setTagFilter((prev) => (prev === tag ? '' : tag))
                }
              />
            ))}
          </Box>
          <TasksPagination
            totalCount={totalCount}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </>
      )}

      <TagsManageDialog
        open={tagsDialogOpen}
        onClose={() => setTagsDialogOpen(false)}
      />
      <TaskUpsertDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Container>
  )
}
