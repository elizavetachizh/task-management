import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useUpdateTaskStatusMutation } from "../../../shared/api/baseApi";
import { priorityLabelMap, statusLabelMap } from "../config/labels";
import { formatTaskDeadline } from "../../../shared/lib/date/formatTaskDeadline";
import { isTaskOverdue } from "../../../shared/lib/date/isTaskOverdue";
import type { Task } from "../model/task";
import { TASK_STATUSES, type TaskStatus } from "../model/task";

type TaskCardProps = {
  task: Task;
  onClick: () => void;
  /** Клик по тегу — например, выставить фильтр по тегу на списке */
  onTagClick?: (tagName: string) => void;
};

export default function TaskCard({ task, onClick, onTagClick }: TaskCardProps) {
  const theme = useTheme();
  const overdue = isTaskOverdue(task);
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTaskStatusMutation();

  const handleStatusChange = (next: TaskStatus) => {
    if (next === task.status) return;
    updateStatus({ id: task.id, data: { status: next } });
  };

  return (
    <Card
      onClick={onClick}
      elevation={overdue ? 3 : 1}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: overdue ? `1px solid ${theme.palette.error.main}` : undefined,
        bgcolor: overdue
          ? alpha(theme.palette.error.main, 0.06)
          : theme.palette.background.paper,
        cursor: "pointer",
        transition: theme.transitions.create(
          ["box-shadow", "border-color", "background-color"],
          { duration: theme.transitions.duration.shorter },
        ),
        "&:hover": {
          boxShadow: theme.shadows[overdue ? 6 : 4],
        },
      }}
    >
      <CardHeader title={task.title} sx={{ flexShrink: 0, pb: 0 }} />
      <CardContent
        sx={{
          pt: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {task.description ? (
          <Typography variant="body2" sx={{ mb: 1.5, flexShrink: 0 }}>
            {task.description}
          </Typography>
        ) : null}

        <Stack
          spacing={1.5}
          sx={{
            mt: "auto",
            width: "100%",
            flexShrink: 0,
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FormControl size="small" fullWidth>
              <InputLabel id={`task-status-${task.id}`}>Статус</InputLabel>
              <Select<TaskStatus>
                labelId={`task-status-${task.id}`}
                label="Статус"
                value={task.status}
                disabled={isUpdatingStatus}
                onChange={(e) =>
                  handleStatusChange(e.target.value as TaskStatus)
                }
              >
                {TASK_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {statusLabelMap[s]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`Приоритет: ${priorityLabelMap[task.priority]}`}
              size="small"
              color={
                task.priority === "high"
                  ? "error"
                  : task.priority === "medium"
                    ? "warning"
                    : "default"
              }
            />
            <Chip
              label={`Дедлайн: ${formatTaskDeadline(task.deadline)}`}
              size="small"
              color={overdue ? "error" : "default"}
              variant={overdue ? "filled" : "outlined"}
            />
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {task.tags.length ? (
              task.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  clickable={Boolean(onTagClick)}
                  onClick={
                    onTagClick
                      ? (e) => {
                          e.stopPropagation();
                          onTagClick(tag);
                        }
                      : undefined
                  }
                  onMouseDown={
                    onTagClick
                      ? (e) => {
                          e.stopPropagation();
                        }
                      : undefined
                  }
                />
              ))
            ) : (
              <Typography variant="caption" color="text.secondary">
                Нет тегов
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
