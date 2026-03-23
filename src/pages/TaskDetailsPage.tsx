import { Link, useParams } from "react-router-dom";
import { useGetTaskByIdQuery } from "../shared/api/baseApi";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

export default function TaskDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { data: task, isLoading, error } = useGetTaskByIdQuery(id ?? "", {skip: !id});
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Ошибка при загрузке задачи</div>

    const isOverdue = useMemo(() => {
        if (!task) return false
        return task.status !== 'done' && new Date(task.deadline) < new Date()
      }, [task])
    

    return <Box maxWidth={900} mx="auto" mt={4}>
      <Card><CardContent>
      <Box>
                <Typography variant="h5">{task?.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task?.description || 'No description'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" component={Link} to={`/task/${task?.id}/edit`}>
                  Edit
                </Button>
                <Button color="error" variant="contained">
                  Delete
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
              {/* <Chip label={`Status: ${statusLabelMap[task.status]}`} /> */}
              <Chip
                // label={`Priority: ${priorityLabelMap[task.priority]}`}
                color={task?.priority === 'high' ? 'error' : task?.priority === 'medium' ? 'warning' : 'default'}
              />
              <Chip
                label={`Deadline: ${task?.deadline}`}
                color={isOverdue ? 'error' : 'default'}
                variant={isOverdue ? 'filled' : 'outlined'}
              />
            </Stack>
        </CardContent>
        </Card>
    </Box>
}