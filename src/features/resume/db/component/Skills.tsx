"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { skillSchema, SkillsValues } from "../../schema/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorFormType } from "../../type/resumeType";
import { Textarea } from "@/components/ui/textarea";

const Skills = ({ formData, setFormData }: EditorFormType) => {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: formData.skills || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setFormData({
        ...formData,
        skills: values.skills
          ?.filter((skill) => skill !== undefined)
          ?.map((skill) => skill?.trim())
          ?.filter((skill) => skill !== ""),
      });
    });
    return unsubscribe;
  }, [form, formData, setFormData]);
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="space-y-1 6 text-center">
        <h2 className="text-2xl font-semibold sr-only">Skills</h2>
        <p className="text-sm text-muted-foreground">What are you good at?</p>
      </div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g. React.Js, Next.Js, Tailwind"
                  onChange={(e) => {
                    const skills = e.target.value.split(",");
                    field.onChange(skills);
                  }}
                ></Textarea>
              </FormControl>
              <FormDescription>
                Separate each skill with a comma.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};

export default Skills;
