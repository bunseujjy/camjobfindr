"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { educationSchema, EducationValues } from "../../schema/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorFormType } from "../../type/resumeType";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Education = ({ formData, setFormData }: EditorFormType) => {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: formData.education || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setFormData({
        ...formData,
        education: values.education?.filter((exp) => exp !== undefined) || [],
      });
    });
    return unsubscribe;
  }, [form, formData, setFormData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1 6 text-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-sm text-muted-foreground">
          Add as many educations as you can.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-3">
          <div className="flex justify-center mb-3">
            <Button
              type="button"
              onClick={() =>
                append({
                  degree: "",
                  school: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              Add Education
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((data, index) => (
              <EducationItem
                key={data.id}
                index={index}
                form={form}
                remove={remove}
              />
            ))}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Education;

interface EducationProps {
  index: number;
  form: UseFormReturn<EducationValues>;
  remove: (index: number) => void;
}

function EducationItem({ index, form, remove }: EducationProps) {
  return (
    <div className="border rounded-md shadow-md overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-semibold sr-only">Education {index + 1}</h1>
      </div>
      <div className="p-4 space-y-4">
        <FormField
          control={form.control}
          name={`education.${index}.degree`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`education.${index}.school`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>School</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-3">
          <div className="w-[50%]">
            <FormField
              control={form.control}
              name={`education.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value?.slice(0, 10)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-[50%]">
            {" "}
            <FormField
              control={form.control}
              name={`education.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value?.slice(0, 10)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="button" onClick={() => remove(index)} className="mt-2">
          Remove
        </Button>
      </div>
    </div>
  );
}
