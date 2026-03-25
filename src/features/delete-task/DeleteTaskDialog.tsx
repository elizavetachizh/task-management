import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { useDeleteTaskMutation } from "../../shared/api/baseApi";

export default function DeleteTaskDialog({
  open,
  onClose,
  taskId,
  onDeleteSuccess,
}: {
  open: boolean;
  onClose: () => void;
  taskId: string;
  onDeleteSuccess: () => void;
}) {
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const onDelete = async () => { 
    try {
      await deleteTask(taskId).unwrap();
      onDeleteSuccess();

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this task?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isDeleting} onClick={onClose}>Cancel</Button>
        <Button disabled={isDeleting} color="error" variant="contained" onClick={onDelete}>Delete</Button>
      </DialogActions>
      {isDeleting && <LinearProgress />}
    </Dialog>
  );
}
