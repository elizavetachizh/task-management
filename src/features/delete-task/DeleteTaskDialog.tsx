import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { useDeleteTaskMutation } from "../../shared/api/baseApi";

type DeleteTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  taskId: string;
  /** Показать в тексте подтверждения */
  taskTitle?: string;
  onDeleteSuccess: () => void;
};

export default function DeleteTaskDialog({
  open,
  onClose,
  taskId,
  taskTitle,
  onDeleteSuccess,
}: DeleteTaskDialogProps) {
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) setErrorMessage(null);
  }, [open]);

  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  const handleDialogClose = () => {
    if (isDeleting) return;
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();
      onDeleteSuccess();
    } catch {
      setErrorMessage("Не удалось удалить задачу. Попробуйте ещё раз.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-task-dialog-title"
      aria-describedby="delete-task-dialog-description"
    >
      <DialogTitle id="delete-task-dialog-title">Удалить задачу?</DialogTitle>
      {isDeleting ? <LinearProgress /> : null}
      <DialogContent>
        <DialogContentText id="delete-task-dialog-description" component="div">
          {taskTitle ? (
            <>
              Запись «<strong>{taskTitle}</strong>» будет удалена без
              возможности восстановления.
            </>
          ) : (
            "Эта задача будет удалена без возможности восстановления."
          )}
        </DialogContentText>
        {errorMessage ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button disabled={isDeleting} onClick={handleClose}>
          Отмена
        </Button>
        <Button
          disabled={isDeleting}
          color="error"
          variant="contained"
          onClick={handleDelete}
          autoFocus
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
