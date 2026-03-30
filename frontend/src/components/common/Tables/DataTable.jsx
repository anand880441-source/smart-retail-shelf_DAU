import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const DataTable = ({ columns, rows, getRowColor, getStatusChip }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#F3F4F6' }}>
            {columns.map((col) => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx} sx={getRowColor ? { bgcolor: getRowColor(row) } : {}}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row[col.key], row) : 
                   getStatusChip && col.key === 'status' ? getStatusChip(row[col.key]) :
                   row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;