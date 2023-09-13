import { TableCell, TableHead as MuiTableHead, TableRow } from '@mui/material';

interface Props {
  columns: readonly Column[]
}

function TableHead({ columns }: Props) {
  return (
    <MuiTableHead>
      <TableRow>
        {
          columns.map((column) => (
            <TableCell
              key={column.id}
              sx={{ backgroundColor: column.bg }}
              align={column.align}
              style={{ minWidth: column.minWidth }}
            >
              {column.label}
            </TableCell>
          ))
        }
      </TableRow>
    </MuiTableHead>
  )
}

export default TableHead;