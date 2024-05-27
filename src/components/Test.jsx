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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import data from "../data/financialData.json";

const FinancialSummaryTable = () => {
  const [rows, setRows] = useState([
    { id: "1", name: "Item 1", amount: "$100", date: "2023-01-01" },
    { id: "2", name: "Item 2", amount: "$200", date: "2023-02-01" },
    { id: "3", name: "Item 3", amount: "$300", date: "2023-03-01" },
    { id: "4", name: "Item 4", amount: "$400", date: "2023-04-01" },
    { id: "5", name: "Item 5", amount: "$500", date: "2023-05-01" },
  ]);

  console.log(data.Sheet1);

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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
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
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinancialSummaryTable;
