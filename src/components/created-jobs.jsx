import React from 'react'
import { getMyJobs } from '@/api/apiJobs';
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/use-fetch'; 
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import JobCard from './job-card';


const CreatedJobs = () => {
    const {user} = useUser();

    const {
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs
    } = useFetch(getMyJobs, {
        recruiter_id : user.id
    })

    useEffect(() => {
     fnCreatedJobs();
    }, []);

    if (loadingCreatedJobs) {
      return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }
  return (
    <div>
        <div className="grid mt-8 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobSaved={fnCreatedJobs}
                  isMyJob
                />
              );
            })
          ) : (
            <div>No Jobs found</div>
          )}
        </div>
      
    </div>
  );
}

export default CreatedJobs
