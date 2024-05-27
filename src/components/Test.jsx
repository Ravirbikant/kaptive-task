import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import FinancialData from "../data/financialData.json";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const FinancialSummaryTable = () => {
  const [rows, setRows] = useState(FinancialData.Sheet1);

  const [draggedRowIndex, setDraggedRowIndex] = useState(null);

  const handleDragStart = (index) => (event) => {
    setDraggedRowIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", event.currentTarget);
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
    const newRows = [...rows];
    const draggedRow = newRows.splice(draggedRowIndex, 1)[0];
    newRows.splice(index, 0, draggedRow);
    setDraggedRowIndex(index);
    setRows(newRows);
  };

  const handleDrop = () => {
    setDraggedRowIndex(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="financial summary table">
        <TableHead>
          <TableRow>
            <TableCell>Move</TableCell>
            <TableCell>Overhead</TableCell>
            {Object.keys(rows[0])
              .filter((key) => key !== "Overhead")
              .map((month) => (
                <TableCell key={month}>{month}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((data, index) => (
            <TableRow
              key={data.Overhead}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop}
              style={{ cursor: "move" }}
            >
              <TableCell>
                <IconButton>
                  <DragIndicatorIcon />
                </IconButton>
              </TableCell>
              <TableCell>{data.Overhead}</TableCell>
              {Object.keys(data)
                .filter((key) => key !== "Overhead")
                .map((month) => (
                  <TableCell key={month}>{data[month]}</TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinancialSummaryTable;
