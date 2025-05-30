"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { summarySchema, SummaryValues } from "../../schema/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormType } from "../../type/resumeType";

const Summary = ({ formData, setFormData }: EditorFormType) => {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setFormData({ ...formData, ...values });
    });
    return unsubscribe;
  }, [form, formData, setFormData]);
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="space-y-1 6 text-center">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a short introduction for your resume.
        </p>
      </div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea {...field}></Textarea>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};

export default Summary;
