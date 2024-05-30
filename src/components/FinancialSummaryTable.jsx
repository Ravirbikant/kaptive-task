// src/components/FinancialSummaryTable.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
        <TableCell style={{ width: "50px" }}>
          <DragIndicatorIcon style={{ cursor: "move" }} />
        </TableCell>
        <TableCell style={{ minWidth: "200px" }}>{row.Overhead}</TableCell>
        {months.map((month) => (
          <TableCell key={month} align="right" style={{ minWidth: "200px" }}>
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
    draggedRowIndex,
  ]);

  return (
    <TableContainer
      component={Paper}
      onScroll={onScroll}
      style={{
        overflowY: "scroll",
        height: "500px",
        position: "relative",
      }}
      ref={containerRef}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "50px" }}>Drag</TableCell>
            <TableCell style={{ width: "200px" }}>Overhead</TableCell>
            {months.map((month) => (
              <TableCell key={month} align="right" style={{ width: "200px" }}>
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
