import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {Input} from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectGroup } from '@radix-ui/react-select'
import { State } from 'country-state-city'
import useFetch from '@/hooks/use-fetch'
import { getCompanies } from '@/api/apiCompnay'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import { Navigate } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { addNewJob } from '@/api/apiJobs'
import { useNavigate } from 'react-router-dom'
import AddCompanyDrawer from '@/components/add-company-drawer'


const schema = z.object({
  title:z.string().min(1,{message : "Title is required"}),
  description:z.string().min(1,{message : "Description is required"}),
  location:z.string().min(1,{message : "Location is required"}),
  company_id:z.string().min(1,{message : "Company is required"}),
  requirements:z.string().min(1,{message : "Requirements are required"}),
})

const PostJob = () => {

  const{user, isLoaded} = useUser()
  const navigate = useNavigate();

 const {register, control, handleSubmit, formState : {errors}} = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      location: '',
      company_id: '',
      requirements: ''
    },
  })

  const { fn: fnCompanies, data: companies, loading:loadingCompanies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {loading: loadingCreateJob, error: errorCreateJob, fn: fnCreateJob, data: dataCreateJob} = useFetch( addNewJob);

   

  const onSubmit = async (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen : true,
    }).then(() => {
      alert("Job posted successfully!");
    }).catch((error) => {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    });
  }

  useEffect(() => {
    if(dataCreateJob?.length >0) navigate('/jobs')

  },[loadingCreateJob])
  if(!isLoaded || loadingCompanies) {
    return <BarLoader className='mb-4' width = {"100%"} color="#36d7b7"/>
  }

  if(user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="jobs" />
  }


  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
        <Input placeholder="Job Title" {...register("title")}></Input>
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea
          placeholder="Job Description"
          {...register("description")}
        ></Textarea>
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(State.getStatesOfCountry("IN") || []).map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select
                className="w-full"
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(companies || []).map(({ name, id }) => (
                      <SelectItem key={id} value={String(id)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

         <AddCompanyDrawer fetchCompanies = {fnCompanies}/>

        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}

        {loadingCreateJob && <BarLoader className='mb-4' width = {"100%"} color="#36d7b7"/>}

        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default PostJob
