"use client";

import React from "react";
import { Categories } from "@/lib/data";
import CategoryCard from "./CategoriesCard";
import { CategoriesSectionProps } from "./types";

const ExploreSection = ({ language }: CategoriesSectionProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <div className="w-[50%] text-center">
            <h1 className="text-lg md:text-xl lg:text-2xl xl:text-4xl font-bold">
              Explore Best Categories
            </h1>
            <p className="text-center py-4">
              Discover a wide range of job categories tailored to your skills
              and interests. Whether you&#39;re seeking opportunities in
              technology, healthcare, finance, or creative industries, our
              platform connects you with employers across diverse sectors. Start
              exploring now to find the perfect match for your career
              aspirations.
            </p>
          </div>
        </div>

        {/* Categories Section  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
          {Categories.map((category) => (
            <CategoryCard
              key={category.title.en}
              {...category}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
