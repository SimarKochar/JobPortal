import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { applyToJob } from '@/api/apiApplication';
import { BarLoader } from 'react-spinners';
import useFetch from '@/hooks/use-fetch';

const schema = z.object({
    experience:z.number().min(0, "Experience must be at least 0 years").int(),
    skills: z.string().min(1, "Skills are required"),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {message : "Education level is required"}),
    resume: z.any().refine(file => file[0] && (file[0].type === "application/pdf"|| file[0].type === "application/msword"),{message:"Only PDF or WORD documents are allowed"} ),

})

const ApplyJobDrawer = ({user, job, applied = false, fetchJob}) => {

   const {register, handleSubmit, control, formState:{errors}, reset} =  useForm({
        resolver: zodResolver(schema),
    });
    const{loading: loadingApply, error: errorApply, fn: fnApply} = useFetch(applyToJob)

   const onSubmit = async (data) => {
    fnApply({
      ...data,
      candidate_id: user.id,
      job_id: job.id,
      name:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username ||
        user.emailAddress,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
      alert("Application submitted successfully!");
    });
   }
  return (
    <div>
      <Drawer open={applied ? false : undefined}>
        <DrawerTrigger>
          <Button
            size="lg"
            variant={job?.isOpen && !applied ? "blue" : "destructive"}
            disabled={!job?.isOpen || applied}
          >
            {job?.isOpen
              ? applied
                ? "Already Applied"
                : "Apply Now"
              : "Job Closed"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Apply for {job?.title} at {job?.company?.name}
            </DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4 pb-0"
          >
            <Input
              type="number"
              placeholder="Years of Experience"
              className="flex-1"
              {...register("experience", { valueAsNumber: true })}
            ></Input>

            {errors.experience && (
              <p className="text-red-500 text-sm">
                {errors.experience.message}
              </p>
            )}
            <Input
              type="text"
              placeholder="Skills (comma separated)"
              className="flex-1"
              {...register("skills")}
            ></Input>
            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.skills.message}</p>
            )}

            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} {...field}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Graduate" id="graduate" />
                    <Label htmlFor="graduate">Graduate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Post Graduate" id="post-graduate" />
                    <Label htmlFor="post-graduate">Post-Graduate</Label>
                  </div>
                </RadioGroup>
              )}
            ></Controller>
            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.education.message}</p>
            )}

            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              placeholder="Upload Resume"
              className="flex-1 file:text-gray-500"
              {...register("resume")}
            ></Input>
            {errors.resume && (
              <p className="text-red-500 text-sm">{errors.resume.message}</p>
            )}
            {errorApply?.message && (
              <p className="text-red-500 text-sm">{errorApply?.message}</p>
            )}
            {loadingApply && <BarLoader width={"100%"} color='#36d7b7'></BarLoader>}
            <Button type="submit" variant="blue" size="lg">
              Apply
            </Button>
          </form>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default ApplyJobDrawer

