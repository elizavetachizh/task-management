import { alpha, Card, CardContent, CardHeader, Chip, Stack, Typography, useTheme } from "@mui/material";
import type { Task } from "../model/types/task";
import { isTaskOverdue } from "../../../shared/lib/date/isTaskOverdue";
import { priorityLabelMap, statusLabelMap } from "../config/labels";

export default function TaskCard({ task, onClick }: { task: Task, onClick: () => void }) {
    const overdue = isTaskOverdue(task);
    const theme = useTheme();
    return (
        <Card onClick={onClick} elevation={overdue ? 3 : 1} sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
             border: overdue ? `1px solid ${theme.palette.error.main}` : undefined,
            bgcolor: overdue
              ? alpha(theme.palette.error.main, 0.06)
              : theme.palette.background.paper,
            transition: theme.transitions.create(['box-shadow', 'border-color', 'background-color'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              boxShadow: theme.shadows[overdue ? 6 : 4],
            },
          }}>
            <CardHeader title={task.title} sx={{ mb: 2 }} />
            <CardContent>
                <Typography variant="body2">{task.description}</Typography>
                <Chip
                label={`Status: ${statusLabelMap[task?.status ?? "todo"]}`}
              />
                <Chip
                label={`Priority: ${priorityLabelMap[task?.priority ?? "low"]}`}
                color={
                  task?.priority === "high"
                    ? "error"
                    : task?.priority === "medium"
                      ? "warning"
                      : "default"
                }
              />
                <Chip label={`Deadline: ${task?.deadline}`}
                color={overdue ? "error" : "default"}
                variant={overdue ? "filled" : "outlined"}
              />
                 <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              {task?.tags.length ? (
                task.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tags
                </Typography>
              )}
            </Stack>
            </CardContent>
        </Card>
    )
}