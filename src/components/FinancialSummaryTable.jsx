import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import financialData from "../data/financialData.json";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const conversionRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.75,
};

const FinancialSummaryTable = () => {
  const [currency, setCurrency] = useState("USD");
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [rows, setRows] = useState(financialData.Sheet1);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleDecimalPlacesChange = (event) => {
    setDecimalPlaces(event.target.value);
  };

  const formatValue = (value, rate) => {
    return `${currencySymbols[currency]} ${(value * rate).toFixed(
      decimalPlaces
    )}`;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedRows = Array.from(rows);
    const [removed] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, removed);
    setRows(reorderedRows);
  };

  return (
    <Paper style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Currency</InputLabel>
          <Select value={currency} onChange={handleCurrencyChange}>
            {Object.keys(currencySymbols).map((cur) => (
              <MenuItem key={cur} value={cur}>
                {cur}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Decimal Places</InputLabel>
          <Select value={decimalPlaces} onChange={handleDecimalPlacesChange}>
            {[0, 1, 2].map((dp) => (
              <MenuItem key={dp} value={dp}>
                {dp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TableContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="table-body">
            {(provided) => (
              <Table {...provided.droppableProps} ref={provided.innerRef}>
                <TableHead>
                  <TableRow>
                    <TableCell>Overhead</TableCell>
                    {Array.from({ length: 12 }, (_, i) => (
                      <TableCell key={i}>
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <Draggable
                      key={row.Overhead}
                      draggableId={row.Overhead}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TableCell>{row.Overhead}</TableCell>
                          {Object.keys(row)
                            .slice(1)
                            .map((month) => (
                              <TableCell key={month}>
                                {formatValue(
                                  row[month],
                                  conversionRates[currency]
                                )}
                              </TableCell>
                            ))}
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </TableContainer>
    </Paper>
  );
};

export default FinancialSummaryTable;
