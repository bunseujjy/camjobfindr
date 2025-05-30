"use client";

import { Button } from "@/components/ui/button";

import { Circle, Square, Squircle } from "lucide-react";
import React from "react";

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};
interface BorderPickerProps {
  border: string | undefined;
  onChange: (border: string) => void;
}

const borderStyles = Object.values(BorderStyles)
const BorderPicker = ({ border, onChange }: BorderPickerProps) => {
  function handleClick() {
    const currentIndex = border ? borderStyles.indexOf(border) : 0;
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    onChange(borderStyles[nextIndex]);
  }

  const Icon =
    border === "square" ? Square : border === "circle" ? Circle : Squircle;
  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border styles"
      onClick={handleClick}
    >
      <Icon />
    </Button>
  );
};

export default BorderPicker;
