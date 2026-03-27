import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateTagMutation, useGetTagsQuery } from "../shared/api/baseApi";

export type TagsManageDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function TagsManageDialog({
  open,
  onClose,
}: TagsManageDialogProps) {
  const {
    data: tags = [],
    isLoading,
    isError,
    refetch,
  } = useGetTagsQuery(undefined, { skip: !open });
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();

  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDialogClose = () => {
    if (isCreating) return;
    setName("");
    setLocalError(null);
    onClose();
  };

  const sortedTags = [...tags].sort((a, b) =>
    a.name.localeCompare(b.name, "ru", { sensitivity: "base" }),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError("Введите название тега");
      return;
    }
    const exists = tags.some(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setLocalError("Такой тег уже есть в списке");
      return;
    }
    setLocalError(null);
    try {
      await createTag(trimmed).unwrap();
      setName("");
    } catch {
      setLocalError("Не удалось создать тег. Попробуйте ещё раз.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="tags-manage-dialog-title"
    >
      <DialogTitle id="tags-manage-dialog-title" sx={{ fontWeight: 600 }}>
        Теги
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Создайте тег здесь — он появится в форме задачи и в фильтрах.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={1.5}>
              <TextField
                label="Новый тег"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (localError) setLocalError(null);
                }}
                size="small"
                fullWidth
                disabled={isCreating}
                autoFocus
                error={Boolean(localError)}
                helperText={localError}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isCreating}
                fullWidth
              >
                {isCreating ? "Сохранение…" : "Добавить"}
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Typography variant="subtitle2" color="text.secondary">
            Все теги ({sortedTags.length})
          </Typography>

          {isError ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  Повторить
                </Button>
              }
            >
              Не удалось загрузить список тегов.
            </Alert>
          ) : isLoading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={32} />
            </Box>
          ) : sortedTags.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Пока нет ни одного тега — добавьте первый выше.
            </Typography>
          ) : (
            <List
              dense
              disablePadding
              sx={{ maxHeight: 280, overflow: "auto" }}
            >
              {sortedTags.map((tag) => (
                <ListItem key={tag.id} disableGutters sx={{ py: 0.25 }}>
                  <ListItemText primary={tag.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleDialogClose} disabled={isCreating}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}
