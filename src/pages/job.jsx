import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch';
import { BarLoader } from 'react-spinners';
import { getSingleJob, updatingHiringStatus } from '../api/apiJobs';
import { useEffect } from 'react';
import { MapPinIcon, Briefcase, DoorClosed, DoorOpen } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import ApplyJobDrawer from '@/components/apply-job';
import ApplicationCard from '@/components/applicationCard';

const JobPage = () => {

  const { isLoaded, user } = useUser();

  const {id} = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob
  } = useFetch(getSingleJob, {
    job_id: id
  });

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updatingHiringStatus, {
    job_id: id,
  });

  const handleStatusChnage=(value)=>{
    const isOpen = value === "open";
    fnHiringStatus( isOpen).then(() => fnJob());
  }

  useEffect(() => {
    if(isLoaded){
      fnJob();
    }}, [isLoaded]
  );
  
  if(!isLoaded || loadingJob){
    return <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row items-center justify-between ">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} alt={job?.title} className="h-12" />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <MapPinIcon></MapPinIcon>
          {job?.location}
        </div>

        <div className="flex gap-2">
          <Briefcase></Briefcase> {job?.applications.length} Applicants
        </div>
        <div>
          {job?.isOpen ? (
            <>
              <DoorOpen></DoorOpen>Open
            </>
          ) : (
            <>
              <DoorClosed></DoorClosed>Closed
            </>
          )}
        </div>
      </div>

      {/* hiring status */}

      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChnage}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-900"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status" + (job?.isOpen ? "(open)" : "(closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        {" "}
        What we are looking for
      </h2>
      <MDEditor.Markdown source={job?.requirements} className="sm:text-lg" />

      {/* render application */}
      <div className='items-center flex flex-col gap-4'>
        {!job?.recruiter_id !== user?.id && (
          <ApplyJobDrawer
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={job?.applications?.find(
              (ap) => ap.candidate_id === user.id
            )}
          />
        )}
      </div>

      {
        job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl sm:text-3xl font-bold'>Applications</h2>
            { job?.applications?.map((application) => {
              return <ApplicationCard key={application.id} application={application}></ApplicationCard>
            })}
          </div>

        )
      }
    </div>
  );
}

export default JobPage
