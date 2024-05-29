import React, { useState, useMemo, useRef, useEffect } from "react";
import { throttle } from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const FinancialSummaryTable = () => {
  const rowHeight = 40;
  const gap = 10;
  const isVirtualizationEnabled = true;

  // Generate dummy children data
  const children = Array.from(
    { length: 1000 },
    (_, index) => `Row ${index + 1}`
  );

  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

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
      return children.map((child, index) => (
        <TableRow key={index}>
          <TableCell>{child}</TableCell>
        </TableRow>
      ));
    }

    const startIndex = Math.max(
      Math.floor(scrollPosition / (rowHeight + gap)) - 2,
      0
    );
    const endIndex = Math.min(
      Math.ceil((scrollPosition + containerHeight) / (rowHeight + gap)) + 2,
      children.length
    );

    return children.slice(startIndex, endIndex).map((child, index) => (
      <TableRow
        key={startIndex + index}
        style={{
          position: "absolute",
          top: (startIndex + index) * (rowHeight + gap),
          height: rowHeight,
          left: 0,
          right: 0,
          lineHeight: `${rowHeight}px`,
        }}
      >
        <TableCell>{child}</TableCell>
      </TableRow>
    ));
  }, [
    children,
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
        height: "400px", // Fixed height for demonstration
      }}
      ref={containerRef}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Row</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <div
            style={{
              height: children.length * (rowHeight + gap),
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
