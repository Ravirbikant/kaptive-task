import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const handleDragStart = (index) => (event) => {};

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
    setOverIndex(index);
  };

  const handleDrop = (index) => (event) => {};

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
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
  const gap = 10;
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
      console.log(containerRef.current.clientHeight);
      setContainerHeight(containerRef.current.clientHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const visibleChildren = useMemo(() => {
    if (!isVirtualizationEnabled) {
      return rows.map((row) => (
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
        draggable
        onDragStart={handleDragStart(index)}
        onDragOver={handleDragOver(index)}
        onDrop={handleDrop(index)}
        key={startIndex + index}
        style={{
          cursor: "move",
          backgroundColor: draggedRowIndex === index ? "green" : "inherit",
          position: "absolute",
          top: (startIndex + index) * (rowHeight + gap),
          height: rowHeight,
          left: 0,
          right: 0,
          lineHeight: `${rowHeight}px`,
        }}
      >
        <TableCell component="th" scope="row">
          {row.Overhead}
        </TableCell>
        {months.map((month) => (
          <TableCell key={month} align="right">
            {row[month]}
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
  ]);

  return (
    <TableContainer
      component={Paper}
      onScroll={onScroll}
      style={{
        overflowY: "scroll",
        height: "500px", // Fixed height for demonstration
      }}
      ref={containerRef}
    >
      <Table stickyHeader aria-label="sticky table">
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
  );
};

export default FinancialSummaryTable;
