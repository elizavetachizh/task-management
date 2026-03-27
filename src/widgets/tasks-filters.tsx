import {
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {
  priorityLabelMap,
  statusLabelMap,
} from "../entities/task/config/labels";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "../entities/task/model/task";
import type { Tag } from "../entities/tag/model/tag";
import type { SortOption } from "../entities/task/model/taskListSort";

export type TasksFiltersProps = {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: TaskStatus | "";
  setStatusFilter: (v: TaskStatus | "") => void;
  priorityFilter: TaskPriority | "";
  setPriorityFilter: (v: TaskPriority | "") => void;
  tagFilter: string;
  setTagFilter: (v: string) => void;
  sortOption: SortOption;
  setSortOption: (v: SortOption) => void;
  hasFilters: boolean;
  clearFilters: () => void;
  isFetching: boolean;
  tagsData: Tag[];
};

export default function TasksFilters({
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
  hasFilters,
  clearFilters,
  isFetching,
  tagsData,
}: TasksFiltersProps) {
  return (
    <>
      <TextField
        fullWidth
        size="small"
        placeholder="Поиск по названию"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Поиск по названию задачи"
        sx={{ mb: 2, maxWidth: { sm: 400 } }}
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

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        flexWrap="wrap"
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 2 }}
      >
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
          <InputLabel id="filter-status-label">Статус</InputLabel>
          <Select<TaskStatus | "">
            labelId="filter-status-label"
            label="Статус"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
          >
            <MenuItem value="">Все</MenuItem>
            {TASK_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {statusLabelMap[s]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
          <InputLabel id="filter-priority-label">Приоритет</InputLabel>
          <Select<TaskPriority | "">
            labelId="filter-priority-label"
            label="Приоритет"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as TaskPriority | "")
            }
          >
            <MenuItem value="">Все</MenuItem>
            {TASK_PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {priorityLabelMap[p]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
          <InputLabel id="filter-tag-label">Тег</InputLabel>
          <Select
            labelId="filter-tag-label"
            label="Тег"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {tagsData.map((t) => (
              <MenuItem key={t.id} value={t.name}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 280 } }}>
          <InputLabel id="sort-label">Сортировка</InputLabel>
          <Select<SortOption>
            labelId="sort-label"
            label="Сортировка"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <MenuItem value="createdAt:desc">
              Дата создания — сначала новые
            </MenuItem>
            <MenuItem value="createdAt:asc">
              Дата создания — сначала старые
            </MenuItem>
            <MenuItem value="deadline:asc">
              Дедлайн — сначала ближайшие
            </MenuItem>
            <MenuItem value="deadline:desc">Дедлайн — сначала поздние</MenuItem>
          </Select>
        </FormControl>

        {hasFilters ? (
          <Button size="small" onClick={clearFilters}>
            Сбросить фильтры
          </Button>
        ) : null}
      </Stack>
    </>
  );
}
