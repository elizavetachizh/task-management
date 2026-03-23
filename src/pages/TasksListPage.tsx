import TaskCard from "../entities/task/ui/TaskCard";
import { useGetTasksQuery } from "../shared/api/baseApi";

export default function TasksListPage() {
    const { data: tasks, isLoading, error } = useGetTasksQuery({});
    console.log(tasks?.data);
    if (isLoading) return <div>Loading...</div>
     if (error) return <div>Ошибка при загрузке задач</div>
    return <div>{tasks?.data?.map((task) => <TaskCard key={task.id} task={task} />)}</div>
}