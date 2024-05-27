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
import { TableVirtuoso } from "react-virtuoso";
import FinancialData from "../data/financialData.json";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import "./styles.css";

const FinancialSummaryTable = () => {
  const [rows, setRows] = useState(FinancialData.Sheet1);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleDragStart = (index) => (event) => {
    setDraggedRowIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const newRows = [...rows];
    const draggedRow = newRows.splice(draggedRowIndex, 1)[0];
    newRows.splice(index, 0, draggedRow);
    setRows(newRows);
    setDraggedRowIndex(null);
    setOverIndex(null);
  };

  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  const fixedHeaderContent = () => (
    <TableRow
      style={{ background: "#d2ddf3", color: "white", fontWeight: "bolder" }}
    >
      <TableCell style={{ width: "30px" }}></TableCell>
      <TableCell style={{ width: "150px" }}>Overhead</TableCell>
      {Object.keys(rows[0])
        .filter((key) => key !== "Overhead")
        .map((month) => (
          <TableCell key={month} style={{ width: "150px" }}>
            {month}
          </TableCell>
        ))}
    </TableRow>
  );

  const rowContent = (index, data) => (
    <TableRow
      key={data.Overhead}
      draggable
      className="test"
      onDragStart={handleDragStart(index)}
      onDragOver={handleDragOver(index)}
      onDrop={handleDrop(index)}
      style={{
        cursor: "move",
        backgroundColor: draggedRowIndex === index ? "green" : "inherit",
      }}
    >
      <TableCell
        style={{ minWidth: "30px", display: "flex", alignItems: "center" }}
      >
        <IconButton>
          <DragIndicatorIcon />
        </IconButton>
      </TableCell>
      <TableCell style={{ minWidth: "150px", fontWeight: "600" }}>
        {data.Overhead}
      </TableCell>
      {Object.keys(data)
        .filter((key) => key !== "Overhead")
        .map((month) => (
          <TableCell key={month} style={{ minWidth: "150px" }}>
            {data[month]}
          </TableCell>
        ))}
    </TableRow>
  );

  return (
    <Paper style={{ height: "500px", width: "100%" }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
};

export default FinancialSummaryTable;
