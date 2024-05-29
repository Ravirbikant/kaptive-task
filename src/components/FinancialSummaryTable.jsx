import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";

import FinancialData from "../data/financialData.json";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const FinancialSummaryTable = () => {
  const [rows, setRows] = useState(FinancialData.Sheet1);

  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Overhead</TableCell>
            {months.map((month) => (
              <TableCell key={month} align="right">
                {month}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.Overhead}>
              <TableCell component="th" scope="row">
                {row.Overhead}
              </TableCell>
              {months.map((month) => (
                <TableCell key={month} align="right">
                  {row[month]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            {months.map((month) => {
              const total = rows.reduce((sum, row) => sum + row[month], 0);
              return (
                <TableCell key={month} align="right">
                  {total.toLocaleString()}
                </TableCell>
              );
            })}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default FinancialSummaryTable;
