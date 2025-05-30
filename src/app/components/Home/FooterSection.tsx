import React from "react";

const FooterSection = () => {
  return (
    <div className="w-full h-[500px] bg-[url(/job-section.avif)] bg-no-repeat bg-cover bg-center relative">
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="container mx-auto px-4 text-center h-full flex flex-col items-center justify-center relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Find The Perfect Job
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-6">
          on CamJobFindr That is Superb For You
        </h2>
        <p className="max-w-2xl mx-auto text-white/90 mb-8">
          &#34;Choose a job you love, and you will never have to work a day in
          your life.&#34; – Confucius
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-md transition-colors">
            Upload Resume
          </button>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-md transition-colors">
            Join Our Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
