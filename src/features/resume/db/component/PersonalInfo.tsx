"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  personalInfoSchema,
  PersonalInfoValues,
} from "../../schema/resumeSchema";
import { Input } from "@/components/ui/input";
import { EditorFormType } from "../../type/resumeType";
import { Button } from "@/components/ui/button";

const PersonalInfo = ({ formData, setFormData }: EditorFormType) => {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      jobTitle: formData.jobTitle || "",
      city: formData.city || "",
      country: formData.country || "",
      phone: formData.phone || "",
      email: formData.email || "",
      photo: formData.photo instanceof File ? formData.photo : undefined,
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      // Skip validation if photo hasn't changed
      if (values.photo === formData.photo) {
        setFormData({ ...formData, ...values });
        return;
      }

      const isValid = await form.trigger();
      if (isValid) {
        setFormData({ ...formData, ...values });
      }
    });
    return unsubscribe;
  }, [form, formData, setFormData]);

  const photoInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1 6 text-center">
        <h2 className="text-2xl font-semibold">Personal Info</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself.</p>
      </div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="photo"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, ...fieldValues } }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    {...fieldValues}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      fieldValues.onChange(file);
                    }}
                    ref={photoInputRef}
                  />
                </FormControl>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    fieldValues.onChange(null);
                    if (photoInputRef.current) {
                      photoInputRef.current.value = "";
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <div className="w-[50%]">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-[50%]">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <div className="w-[50%]">
            {" "}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-[50%]">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-[50%]">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-[50%]">
            {" "}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default PersonalInfo;
