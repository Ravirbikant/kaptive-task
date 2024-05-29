import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import FinancialData from "../data/financialData.json";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import "./styles.css";
import { RadioButtonUncheckedSharp } from "@mui/icons-material";

const conversionRates = {
  EUR: 0.85,
  GBP: 0.75,
  USD: 1,
};

const FinancialSummaryTable = () => {
  const data = [
    {
      Overhead: "Item 1",
      Jan: 567035172.9808396,
      Feb: 709704421.7821583,
      March: 943775905.6076958,
      April: 1700146.9885902232,
      May: 834902424.9488207,
      June: 832586982.1314108,
      July: 537888560.5971923,
      August: 617635903.8054163,
      September: 766114253.5959474,
      October: 855211514.2058038,
      November: 850249970.9165924,
      December: 947909624.3220406,
    },
    {
      Overhead: "Item 2",
      Jan: 567035172.9808396,
      Feb: 709704421.7821583,
      March: 943775905.6076958,
      April: 1700146.9885902232,
      May: 834902424.9488207,
      June: 832586982.1314108,
      July: 537888560.5971923,
      August: 617635903.8054163,
      September: 766114253.5959474,
      October: 855211514.2058038,
      November: 850249970.9165924,
      December: 947909624.3220406,
    },
    {
      Overhead: "Item 3",
      Jan: 567035172.9808396,
      Feb: 709704421.7821583,
      March: 943775905.6076958,
      April: 1700146.9885902232,
      May: 834902424.9488207,
      June: 832586982.1314108,
      July: 537888560.5971923,
      August: 617635903.8054163,
      September: 766114253.5959474,
      October: 855211514.2058038,
      November: 850249970.9165924,
      December: 947909624.3220406,
    },
    {
      Overhead: "Item 4",
      Jan: 567035172.9808396,
      Feb: 709704421.7821583,
      March: 943775905.6076958,
      April: 1700146.9885902232,
      May: 834902424.9488207,
      June: 832586982.1314108,
      July: 537888560.5971923,
      August: 617635903.8054163,
      September: 766114253.5959474,
      October: 855211514.2058038,
      November: 850249970.9165924,
      December: 947909624.3220406,
    },
    {
      Overhead: "Item 5",
      Jan: 567035172.9808396,
      Feb: 709704421.7821583,
      March: 943775905.6076958,
      April: 1700146.9885902232,
      May: 834902424.9488207,
      June: 832586982.1314108,
      July: 537888560.5971923,
      August: 617635903.8054163,
      September: 766114253.5959474,
      October: 855211514.2058038,
      November: 850249970.9165924,
      December: 947909624.3220406,
    },
  ];

  const [rows, setRows] = useState(FinancialData.Sheet1);
  // const [rows, setRows] = useState(data);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  // let draggedRowIndex = useRef();

  // const handleDragStart = (index) => (event) => {
  // setDraggedRowIndex(index);
  // event.dataTransfer.effectAllowed = "move";
  // event.dataTransfer.setData("text/plain", index);
  // };

  function handleDragStart(index, e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
    setDraggedRowIndex(index);
    // draggedRowIndex.current = index;
    console.log(draggedRowIndex);
  }

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
    // draggedRowIndex.current = null;
    console.log(draggedRowIndex);
    setOverIndex(null);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleDecimalPlacesChange = (event) => {
    setDecimalPlaces(parseInt(event.target.value));
  };

  const formatValue = (value) => {
    const convertedValue = value * conversionRates[currency];
    return convertedValue.toFixed(decimalPlaces);
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
    <TableRow>
      <TableCell style={{ width: "30px" }}></TableCell>
      <TableCell style={{ width: "150px" }}>
        <p>Overhead</p>
      </TableCell>
      {Object.keys(rows[0])
        .filter((key) => key !== "Overhead")
        .map((month) => (
          <TableCell key={month} style={{ width: "150px" }}>
            <p>{month}</p>
          </TableCell>
        ))}
    </TableRow>
  );

  const rowContent = (index, data) => (
    <TableRow
      key={data.Overhead}
      draggable
      onDragStart={(e) => {
        handleDragStart(index, e);
      }}
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
            {formatValue(data[month])}
          </TableCell>
        ))}
    </TableRow>
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
          marginTop: "20px",
        }}
      >
        <FormControl
          sx={{ width: "70px", marginRight: "20px", border: "none" }}
        >
          <Select
            value={currency}
            onChange={handleCurrencyChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              background: "#d2ddf3",
              color: "rgb(7, 7, 154)",
              height: "40px",
            }}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
          </Select>
        </FormControl>

        <FormControl component="fieldset">
          <RadioGroup
            row
            value={decimalPlaces}
            onChange={handleDecimalPlacesChange}
          >
            <FormControlLabel value={0} control={<Radio />} label="0" />
            <FormControlLabel value={1} control={<Radio />} label="1" />
            <FormControlLabel value={2} control={<Radio />} label="2" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Paper style={{ height: "500px", width: "100%" }}>
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </Box>
  );
};

export default FinancialSummaryTable;
