import React, { useEffect, useMemo, useRef, useState } from "react";
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import FinancialData from "../data/financialData.json";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { throttle } from "lodash";
import "./styles.css";

const FinancialSummaryTable = () => {
  const [rows, setRows] = useState(FinancialData.Sheet1);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [decimalPlaces, setDecimalPlaces] = useState(2);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleDecimalPlacesChange = (event) => {
    setDecimalPlaces(parseInt(event.target.value));
  };

  const handleDragStart = (index) => (event) => {
    setDraggedRowIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (index) => (event) => {
    const updatedRows = [...rows];
    const [draggedRow] = updatedRows.splice(draggedRowIndex, 1);
    updatedRows.splice(index, 0, draggedRow);
    setRows(updatedRows);
    setDraggedRowIndex(null);
    setOverIndex(null);
  };

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

  const rowHeight = 40;
  const gap = 0;
  const isVirtualizationEnabled = true;

  const containerRef = useRef(null);

  const onScroll = useMemo(
    () =>
      throttle(
        (e) => {
          setScrollPosition(e.target.scrollTop);
        },
        50,
        { leading: false }
      ),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(containerRef.current.clientHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatCurrency = (value) => {
    const options = {
      style: "currency",
      currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    };
    return new Intl.NumberFormat("en-US", options).format(value);
  };

  const visibleChildren = useMemo(() => {
    if (!isVirtualizationEnabled) {
      return rows.map((row, index) => (
        <TableRow
          key={row.Overhead}
          draggable
          onDragStart={handleDragStart(index)}
          onDragOver={handleDragOver(index)}
          onDrop={handleDrop(index)}
          style={{
            backgroundColor: draggedRowIndex === index ? "green" : "inherit",
          }}
        >
          <TableCell component="th" scope="row">
            <DragIndicatorIcon style={{ cursor: "move" }} />
          </TableCell>
          <TableCell>{row.Overhead}</TableCell>
          {months.map((month) => (
            <TableCell key={month} align="right">
              {formatCurrency(row[month])}
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    const startIndex = Math.max(
      Math.floor(scrollPosition / (rowHeight + gap)) - 2,
      0
    );
    const endIndex = Math.min(
      Math.ceil((scrollPosition + containerHeight) / (rowHeight + gap)) + 2,
      rows.length
    );

    return rows.slice(startIndex, endIndex).map((row, index) => (
      <TableRow
        key={row.Overhead}
        draggable
        onDragStart={handleDragStart(startIndex + index)}
        onDragOver={handleDragOver(startIndex + index)}
        onDrop={handleDrop(startIndex + index)}
        style={{
          backgroundColor:
            draggedRowIndex === startIndex + index ? "green" : "inherit",
          position: "absolute",
          top: (startIndex + index) * (rowHeight + gap),
          height: rowHeight,
          left: 0,
          right: 0,
          lineHeight: `${rowHeight}px`,
          display: "flex",
          width: "100%",
        }}
      >
        <TableCell
          style={{
            minWidth: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DragIndicatorIcon style={{ cursor: "move" }} />
        </TableCell>
        <TableCell
          style={{
            minWidth: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {row.Overhead}
        </TableCell>
        {months.map((month) => (
          <TableCell
            key={month}
            style={{
              minWidth: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {formatCurrency(row[month])}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [
    rows,
    containerHeight,
    rowHeight,
    scrollPosition,
    gap,
    isVirtualizationEnabled,
    draggedRowIndex,
    currency,
    decimalPlaces,
  ]);

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
              background: "lightGreen",
              color: "green",
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
        <TableContainer
          component={Paper}
          onScroll={onScroll}
          style={{
            overflowY: "scroll",
            height: "500px",
            position: "relative",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          ref={containerRef}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow style={{ background: "orange" }}>
                <TableCell
                  style={{
                    minWidth: "50px",
                    fontWeight: "bold",
                  }}
                ></TableCell>
                <TableCell
                  style={{
                    minWidth: "200px",
                    fontWeight: "bold",
                  }}
                >
                  <p>Overhead</p>
                </TableCell>
                {months.map((month) => (
                  <TableCell
                    key={month}
                    style={{
                      minWidth: "200px",
                      fontWeight: "bold",
                    }}
                  >
                    <p>{month}</p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              <div
                style={{
                  height: rows.length * (rowHeight + gap),
                  position: "relative",
                }}
              >
                {visibleChildren}
              </div>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FinancialSummaryTable;
