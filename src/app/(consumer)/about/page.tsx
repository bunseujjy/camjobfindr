"use client";

import React, { Suspense } from "react";
import About from "./About";

const AboutPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <About />
    </Suspense>
  );
};

export default AboutPage;
