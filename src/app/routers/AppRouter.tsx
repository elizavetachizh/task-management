import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "../../shared/config/routes";
import TasksListPage from "../../pages/TasksListPage";
import TaskDetailsPage from "../../pages/TaskDetailsPage";
import AppLayout from "../../shared/ui/AppLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.home} element={<AppLayout />}>
          <Route index element={<TasksListPage />} />
          <Route path={ROUTES.taskDetails} element={<TaskDetailsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
