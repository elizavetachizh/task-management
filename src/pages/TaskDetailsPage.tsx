import { useNavigate, useParams } from "react-router-dom";
import { useGetTaskByIdQuery } from "../shared/api/baseApi";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DeleteTaskDialog from "../features/delete-task/DeleteTaskDialog";
import TaskUpsertDialog from "../features/task-form/TaskUpsertDialog";
import { ROUTES } from "../shared/config/routes";
import { isTaskOverdue } from "../shared/lib/date/isTaskOverdue";
import {
  priorityLabelMap,
  statusLabelMap,
} from "../entities/task/config/labels";

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: task,
    isLoading,
    error,
  } = useGetTaskByIdQuery(id ?? "", { skip: !id });
const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const isOverdue = task ? isTaskOverdue(task) : false;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Ошибка при загрузке задачи</div>;
  if (!task) return <div>Задача не найдена</div>;

const handleDeleteSuccess = () => {
  setOpenDeleteDialog(false);
  navigate(ROUTES.home);
}

  return (
    <>
      <Box maxWidth={900} mx="auto" mt={4}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5">{task.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {task.description || "No description"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              <Chip
                label={`Status: ${statusLabelMap[task.status]}`}
              />
              <Chip
                label={`Priority: ${priorityLabelMap[task.priority]}`}
                color={
                  task.priority === "high"
                    ? "error"
                    : task.priority === "medium"
                      ? "warning"
                      : "default"
                }
              />
              <Chip
                label={`Deadline: ${task.deadline}`}
                color={isOverdue ? "error" : "default"}
                variant={isOverdue ? "filled" : "outlined"}
              />
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              {task.tags.length ? (
                task.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tags
                </Typography>
              )}
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              flexShrink={0}
            >
              <Button variant="outlined" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
      <DeleteTaskDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        taskId={task.id}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <TaskUpsertDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
      />
    </>
  );
}
