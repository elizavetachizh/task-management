import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import type { Task } from "../model/types/task";

export default function TaskCard({ task }: { task: Task }) {

    return (
        <Card>
            <CardHeader title={task.title} />
            <CardContent>
                <Typography variant="body2">{task.description}</Typography>
                <Typography variant="body2">{task.status}</Typography>
                <Typography variant="body2">{task.priority}</Typography>
                <Typography variant="body2">{task.deadline}</Typography>
                <Typography variant="body2">{task.tags.join(', ')}</Typography>
            </CardContent>
        </Card>
    )
}