import { TablePagination } from "@mui/material";

export default function TasksPagination({
  totalCount,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
}: {
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
}) {
  return (
    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      onPageChange={(_, newPage) => setPage(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(Number.parseInt(e.target.value, 10));
        setPage(0);
      }}
      rowsPerPageOptions={[6, 9, 12]}
      labelRowsPerPage="На странице"
      sx={{ mt: 2, borderTop: 1, borderColor: "divider" }}
    />
  );
}
