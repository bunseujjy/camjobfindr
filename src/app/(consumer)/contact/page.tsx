import React, { Suspense } from "react";
import Contact from "./Contact";

const ContactPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Contact />
    </Suspense>
  );
};

export default ContactPage;
