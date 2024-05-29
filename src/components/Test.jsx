import React, { useState, useMemo, useRef, useEffect } from "react";
import { throttle } from "lodash";

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
      return children.map((child, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: index * (rowHeight + gap),
            height: rowHeight,
            left: 0,
            right: 0,
            // lineHeight: `${rowHeight}px`,
          }}
        >
          {child}
        </div>
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
      <div
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
        {child}
      </div>
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
    <div
      onScroll={onScroll}
      style={{
        overflowY: "scroll",
        position: "relative",
        height: "400px", // Fixed height for demonstration
        border: "1px solid #ccc", // Add border for visualization
      }}
      ref={containerRef}
    >
      <div
        style={{
          height: children.length * (rowHeight + gap), // Set height of virtualized window (Did not understood the use)
          position: "relative", // Ensure correct positioning of children
        }}
      >
        {visibleChildren}
      </div>
    </div>
  );
};

export default FinancialSummaryTable;
