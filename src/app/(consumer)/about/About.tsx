import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Award, TrendingUp, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About CamJobFindr</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connecting talented professionals with their dream careers since 2015.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            At CamJobFindr, we&apos;re on a mission to transform how people find
            jobs and how companies find talent. We believe that the right job
            can change a person&apos;s life, and the right talent can transform
            a business.
          </p>
          <p className="text-muted-foreground">
            We&apos;re building tools that make the job search process more
            transparent, efficient, and human. Our platform uses cutting-edge
            technology to match candidates with opportunities where they&apos;ll
            thrive.
          </p>
        </div>
        <div>
          <Image
            src="/opengraph_image.jpg"
            alt="Team collaboration"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-muted rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-4xl font-bold mb-2">2M+</h3>
                <p className="text-muted-foreground">Active Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Building className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-4xl font-bold mb-2">50K+</h3>
                <p className="text-muted-foreground">Partner Companies</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-4xl font-bold mb-2">500K+</h3>
                <p className="text-muted-foreground">Successful Placements</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-4xl font-bold mb-2">95%</h3>
                <p className="text-muted-foreground">Satisfaction Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Transparency</h3>
            <p className="text-muted-foreground">
              We believe in clear, honest communication with our users and
              partners. No hidden fees, no misleading information.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Innovation</h3>
            <p className="text-muted-foreground">
              We&apos;re constantly improving our platform with new features and
              technologies to make job searching easier and more effective.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Inclusivity</h3>
            <p className="text-muted-foreground">
              We&apos;re committed to creating a platform that serves everyone,
              regardless of background, experience level, or career path.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Whether you&apos;re looking for your next career move or searching for
          top talent, CamJobFindr is here to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link href="/">Find Jobs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
