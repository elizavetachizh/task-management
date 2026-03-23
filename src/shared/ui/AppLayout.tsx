import { AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return <div>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">Task Management</Typography>
            </Toolbar>
        </AppBar>
        <Outlet />
    </div>
}