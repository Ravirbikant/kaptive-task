import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import FinancialData from "../data/financialData.json";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import "./styles.css";

const conversionRates = {
  EUR: 0.85,
  GBP: 0.75,
  USD: 1,
};

let draggedRowIndex = null;

const FinancialSummaryTable = () => {
  const [rows, setRows] = useState(FinancialData.Sheet1);
  const [currency, setCurrency] = useState("USD");
  const [decimalPlaces, setDecimalPlaces] = useState(2);

  const handleDragStart = (index) => (event) => {
    draggedRowIndex = index;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    const newRows = [...rows];
    const draggedRow = newRows.splice(draggedRowIndex, 1)[0];
    newRows.splice(index, 0, draggedRow);
    setRows(newRows);
    draggedRowIndex = null;
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
      <Paper className="paperP" style={{ width: "100%" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                style={{
                  background: "#d2ddf3",
                  color: "white",
                  fontWeight: "bolder",
                }}
              >
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
            </TableHead>
            <TableBody>
              {rows.map((data, index) => (
                <TableRow
                  key={data.Overhead + index}
                  draggable
                  className="printableRow"
                  onDragStart={handleDragStart(index)}
                  onDragOver={handleDragOver(index)}
                  onDrop={handleDrop(index)}
                  style={{ cursor: "move" }}
                >
                  <TableCell
                    style={{
                      minWidth: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FinancialSummaryTable;
