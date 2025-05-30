"use client";

import { useForm } from "react-hook-form";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AdditionalI {
  firstName: string;
  lastName: string;
  customName: string;
  customBio: string;
}

const AdditionalUpdate = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdditionalI>();

  const { isLoaded, isSignedIn, user } = useUser();

  const onSubmit = (data: AdditionalI) => {
    try {
      user?.update({
        firstName: data.firstName,
        lastName: data.lastName,
        unsafeMetadata: {
          customName: data.customName,
          customBio: data.customBio,
        },
      });

      router.push("/view");
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="mx-10">
      <h1 className="py-4 text-2xl font-bold">Update Additional Information</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            defaultValue={user.firstName as string}
            {...register("firstName", {
              required: true,
            })}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {errors.firstName && (
            <span className="text-sm text-red-600">This field is required</span>
          )}
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            defaultValue={user.lastName as string}
            {...register("lastName", {
              required: true,
            })}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {errors.lastName && (
            <span className="text-sm text-red-600">This field is required</span>
          )}
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="customName"
          >
            Custom Name
          </label>
          <input
            defaultValue={user.unsafeMetadata.customName as string}
            {...register("customName", {
              required: true,
            })}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {errors.customName && (
            <span className="text-sm text-red-600">This field is required</span>
          )}
        </div>
        <div className="mt-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-700"
            htmlFor="customBio"
          >
            Custom Bio
          </label>
          <textarea
            rows={6}
            defaultValue={user.unsafeMetadata.customBio as string}
            {...register("customBio", {
              required: true,
            })}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          ></textarea>
          {errors.customBio && (
            <span className="text-sm text-red-600">This field is required</span>
          )}
        </div>

        <button
          type="submit"
          className="my-4 bg-purple-500 px-8 py-2 text-lg font-semibold text-white transition-all hover:bg-purple-700"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default AdditionalUpdate;
