import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from '../model/task'
import TaskCard from './TaskCard'

const updateStatus = vi.fn()
vi.mock('../../../shared/api/baseApi', () => ({
  useUpdateTaskStatusMutation: () => [updateStatus, { isLoading: false }],
}))

const theme = createTheme()

const baseTask: Task = {
  id: 't1',
  title: 'Тестовая задача с длинным заголовком',
  description: 'Описание для карточки',
  status: 'todo',
  priority: 'high',
  deadline: '2030-01-15T18:00:00.000Z',
  tags: ['frontend', 'ui'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function renderTaskCard(
  overrides: Partial<Task> = {},
  props: { onTagClick?: (tag: string) => void } = {},
) {
  const task = { ...baseTask, ...overrides }
  return render(
    <ThemeProvider theme={theme}>
      <TaskCard
        task={task}
        onClick={vi.fn()}
        onTagClick={props.onTagClick}
      />
    </ThemeProvider>,
  )
}

describe('TaskCard', () => {
  it('renders title and description', () => {
    renderTaskCard()
    expect(screen.getByText(baseTask.title)).toBeInTheDocument()
    expect(screen.getByText(baseTask.description!)).toBeInTheDocument()
  })

  it('calls onClick when the card surface is clicked', () => {
    const onClick = vi.fn()
    const task = { ...baseTask }
    const { container } = render(
      <ThemeProvider theme={theme}>
        <TaskCard task={task} onClick={onClick} />
      </ThemeProvider>,
    )
    const card = container.querySelector('.MuiCard-root')
    expect(card).toBeTruthy()
    fireEvent.click(card!)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onTagClick when a tag chip is clicked', () => {
    const onTagClick = vi.fn()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <TaskCard task={baseTask} onClick={vi.fn()} onTagClick={onTagClick} />
      </ThemeProvider>,
    )
    const tagChip = container.querySelector('.MuiChip-clickable')
    expect(tagChip).toBeTruthy()
    fireEvent.click(tagChip!)
    expect(onTagClick).toHaveBeenCalledWith('frontend')
  })

  it('changes status via select without firing card onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    updateStatus.mockClear()
    const task = { ...baseTask }
    render(
      <ThemeProvider theme={theme}>
        <TaskCard task={task} onClick={onClick} />
      </ThemeProvider>,
    )

    const combobox = screen.getAllByRole('combobox', { name: 'Статус' })[0]
    await user.click(combobox)
    const option = await screen.findByRole('option', { name: 'In progress' })
    await user.click(option)

    expect(updateStatus).toHaveBeenCalledWith({
      id: task.id,
      data: { status: 'inProgress' },
    })
    expect(onClick).not.toHaveBeenCalled()
  })
})
