"use client";

import type React from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Briefcase } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeroProps {
  language: "en" | "kh";
}

const translations = {
  en: {
    title: "Find Your Dream Job in Cambodia",
    subtitle: "Discover thousands of job opportunities with top companies",
    searchPlaceholder: "Job title or keyword",
    locationPlaceholder: "Select Location",
    categoryPlaceholder: "Select Category",
    searchButton: "Search Jobs",
    statsJobs: "Active Jobs",
    statsCompanies: "Companies",
    statsHired: "People Hired",
  },
  kh: {
    title: "ស្វែងរកការងារក្តីស្រមៃរបស់អ្នកនៅកម្ពុជា",
    subtitle: "ស្វែងរកឱកាសការងាររាប់ពាន់ជាមួយក្រុមហ៊ុនឈានមុខ",
    searchPlaceholder: "មុខតំណែង ឬ ពាក្យគន្លឹះ",
    locationPlaceholder: "ជ្រើសរើសទីតាំង",
    categoryPlaceholder: "ជ្រើសរើសប្រភេទ",
    searchButton: "ស្វែងរកការងារ",
    statsJobs: "ការងារសកម្ម",
    statsCompanies: "ក្រុមហ៊ុន",
    statsHired: "អ្នកត្រូវបានជ្រើសរើស",
  },
};

const locations = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Sihanoukville",
  "Kampot",
];

const categories = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Hospitality",
  "Manufacturing",
  "Sales",
  "Marketing",
];

export default function Hero({ language = "en" }: HeroProps) {
  const t = translations[language];
  const router = useRouter();

  // State for search inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { number: "10,000+", label: t.statsJobs },
    { number: "1,000+", label: t.statsCompanies },
    { number: "50,000+", label: t.statsHired },
  ];

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    if (category) {
      // Map category to job type if needed
      // This assumes your job search page uses "jobType" as the parameter
      params.set("jobType", category);
    }

    // Navigate to the job search page with query parameters
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/job-hero.jpg"
          alt="Professional workplace background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
        <BackgroundBeams className="absolute inset-0 opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
          >
            {t.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-200 mb-12"
          >
            {t.subtitle}
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 md:p-6 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t.searchPlaceholder}
                  className="pl-10 bg-white/80 border-white/20 focus:bg-white transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white/80 border-white/20 focus:bg-white transition-colors">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.locationPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc.toLowerCase()}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/80 border-white/20 focus:bg-white transition-colors">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.categoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="md:col-span-4 bg-primary hover:bg-primary/90"
              >
                <Search className="h-4 w-4 mr-2" />
                {t.searchButton}
              </Button>
            </div>
          </motion.form>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6"
              >
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
