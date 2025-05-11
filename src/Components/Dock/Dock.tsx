/*
  jsrepo 1.38.0
  Installed from https://reactbits.dev/ts/tailwind/
  2-19-2025
*/

"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

type WithHoverProps = {
  isHovered?: MotionValue<number>;
};

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);
  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)} onBlur={() => isHovered.set(0)}
      onTouchStart={() => isHovered.set(1)}
      onTouchEnd={(e) => {
        // For touch devices, we handle the click during touch end
        isHovered.set(0);
        if (onClick) {
          // Use a flag to prevent double-triggering with onClick
          (e.currentTarget as any)._touchHandled = true;
          setTimeout(() => {
            onClick();
          }, 10);
        }
      }}
      onClick={(e) => {
        // Only execute onClick if it wasn't handled by touch
        const target = e.currentTarget as any;
        if (onClick && !target._touchHandled) {
          onClick();
        }
        // Reset the flag
        target._touchHandled = false;
      }}
      className={`relative inline-flex items-center justify-center rounded-full bg-[#060606] border-neutral-700 border-2 shadow-md touch-manipulation ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement<WithHoverProps>, { isHovered })
      )}
    </motion.div>
  );
}

type DockLabelProps = WithHoverProps & {
  className?: string;
  children: React.ReactNode;
};

function DockLabel({ children, className = "", ...rest }: DockLabelProps) {
  const { isHovered } = rest as { isHovered: MotionValue<number> };
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-8 sm:-top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060606] px-2 py-1 text-xs text-white backdrop-blur-sm shadow-md`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = WithHoverProps & {
  className?: string;
  children: React.ReactNode;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);
  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-auto sm:mx-2 flex max-w-full items-center"
    >
      <motion.div onMouseMove={({ pageX }) => {
        isHovered.set(1);
        mouseX.set(pageX);
      }} onTouchMove={(e) => {
        const { touches } = e;
        if (touches.length > 0) {
          isHovered.set(1);
          mouseX.set(touches[0].pageX);
        }
        // Prevent default to avoid scrolling issues on iOS
        e.preventDefault();
      }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        onTouchEnd={(e) => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-1 sm:gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-2 sm:px-4`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
