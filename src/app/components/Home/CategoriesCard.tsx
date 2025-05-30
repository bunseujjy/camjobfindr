"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  icon: LucideIcon;
  title: {
    en: string;
    kh: string;
  };
  description: {
    en: string;
    kh: string;
  };
  active: string;
  color: string;
  bgColor: string;
  language: "en" | "kh";
}

const CategoryCard = ({
  icon: Icon,
  title,
  description,
  active,
  color,
  bgColor,
  language,
}: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-lg border p-6 hover:shadow-lg transition-all duration-200"
    >
      <div
        className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative z-10">
        <div className={`inline-flex rounded-lg p-3 ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="mt-4 font-semibold">{title[language]}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {description[language]}
        </p>
        <p className="mt-2 text-sm font-medium">
          {active} {language === "en" ? "active jobs" : "ការងារសកម្ម"}
        </p>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
