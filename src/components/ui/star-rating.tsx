"use client";

import type React from "react";
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  totalStars?: number;
  initialRating?: number;
  onChange?: (rating: number) => void;
  size?: number;
  color?: string;
  borderColor?: string;
  placeholder?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  totalStars = 5,
  initialRating = 0,
  onChange,
  size = 24,
  color = "gold",
  borderColor = "#e4e5e9",
  placeholder = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleMouseMove = (
    e: React.MouseEvent<SVGSVGElement>,
    index: number
  ) => {
    if (placeholder) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    setHover(index + (percent > 0.5 ? 1 : 0.5));
  };

  const handleMouseLeave = () => {
    if (placeholder) return;
    setHover(0);
  };

  const handleClick = (index: number) => {
    const newRating = placeholder ? index + 1 : hover || index + 1;
    setRating(newRating);
    onChange?.(newRating);
    if (placeholder) {
      setHover(newRating);
      setRating(initialRating);
    }
  };

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const filled = (placeholder ? rating : hover || rating) - index;
        return (
          <div key={index} className="relative inline-block">
            <Star
              size={size}
              className="cursor-pointer absolute top-0 left-0"
              fill={borderColor}
              stroke={borderColor}
              strokeWidth={1}
            />
            <Star
              size={size}
              onClick={() => handleClick(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              className="cursor-pointer relative"
              fill={filled > 0 ? color : "transparent"}
              stroke={filled > 0 ? color : "transparent"}
              strokeWidth={1}
              style={{
                clipPath:
                  filled >= 1 ? "none" : `inset(0 ${100 - filled * 100}% 0 0)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
