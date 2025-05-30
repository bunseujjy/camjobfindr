"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  generalInfoSchema,
  GeneralInfoValues,
} from "../../schema/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormType } from "../../type/resumeType";

const GeneralForm = ({ formData, setFormData }: EditorFormType) => {
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: formData.title || "",
      description: formData.description || "",
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
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1 6 text-center">
        <h2 className="text-2xl font-semibold">General Info</h2>
        <p className="text-sm text-muted-foreground">
          This will not appear on your resume.
        </p>
      </div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Title of your resume" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Description of your rusume" />
              </FormControl>
              <FormDescription>
                Describe what this resume is for.
              </FormDescription>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};

export default GeneralForm;
