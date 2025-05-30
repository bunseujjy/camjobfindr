import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const ProcessSection = () => {
  return (
    <section className="bg-slate-200">
      <div className="container mx-auto text-center py-10">
        <h1 className="text-lg md:text-xl lg:text-2xl xl:text-4xl font-bold pb-4">
          Our Working Process
        </h1>
        <p>
          We follow a structured approach to ensure the success of every
          project:
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 px-4 py-10">
          <Card className="text-start shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-orange-400 text-lg md:text-xl lg:text-2xl xl:text-4xl">
                01.
              </CardTitle>
              <CardDescription className="text-blue-950 text-sm md:text-md lg:text-lg xl:text-xl font-semibold">
                Create An Account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Post A Job To Tell Us About Your Project. We&#39;ll Quickly
                Match You With The Right Freelancers Find Place Best. Nor again
                is there anyone who loves.
              </p>
            </CardContent>
          </Card>

          <Card className="text-start shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-orange-400 text-lg md:text-xl lg:text-2xl xl:text-4xl">
                02.
              </CardTitle>
              <CardDescription className="text-blue-950 text-sm md:text-md lg:text-lg xl:text-xl font-semibold">
                Search Jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Post A Job To Tell Us About Your Project. We&#39;ll Quickly
                Match You With The Right Freelancers Find Place Best. Nor again
                is there anyone who loves.
              </p>
            </CardContent>
          </Card>
          <Card className="text-start shadow-none bg-white">
            {" "}
            <CardHeader>
              <CardTitle className="text-orange-400 text-lg md:text-xl lg:text-2xl xl:text-4xl">
                03.
              </CardTitle>
              <CardDescription className="text-blue-950 text-sm md:text-md lg:text-lg xl:text-xl font-semibold">
                Save & Apply Jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Post A Job To Tell Us About Your Project. We&#39;ll Quickly
                Match You With The Right Freelancers Find Place Best. Nor again
                is there anyone who loves.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
