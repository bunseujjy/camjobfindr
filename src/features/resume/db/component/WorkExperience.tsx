"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import {
  workExperienceSchema,
  WorkExperienceValues,
} from "../../schema/resumeSchema";
import { EditorFormType } from "../../type/resumeType";
import { Textarea } from "@/components/ui/textarea";

const WorkExperience = ({ formData, setFormData }: EditorFormType) => {
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience: formData.workExperience || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setFormData({
        ...formData,
        workExperience:
          values.workExperience?.filter((exp) => exp !== undefined) || [],
      });
    });
    return unsubscribe;
  }, [form, formData, setFormData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="space-y-1 6 text-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-sm text-muted-foreground">
          Add work experiences as many as you like.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <div className="flex justify-center mb-3">
            <Button
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              Add work experience
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <WorkExperienceItem
                key={field.id}
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

export default WorkExperience;

interface WorkExperienceItemProps {
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

function WorkExperienceItem({ form, index, remove }: WorkExperienceItemProps) {
  return (
    <div className="border rounded-md shadow-md overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-semibold">Work Experience {index + 1}</h1>
        <FormField
          control={form.control}
          name={`workExperience.${index}.position`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`workExperience.${index}.company`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
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
              name={`workExperience.${index}.startDate`}
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
              name={`workExperience.${index}.endDate`}
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
        <FormDescription>
          Leave end date empty if you are currently here.
        </FormDescription>
        <FormField
          control={form.control}
          name={`workExperience.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={() => remove(index)} className="mt-2">
          Remove
        </Button>
      </div>
    </div>
  );
}
