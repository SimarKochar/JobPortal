import useFetch from '@/hooks/use-fetch'
import React from 'react'
import {getSavedJobs} from '@/api/apiJobs'
import {useUser} from '@clerk/clerk-react'
import BarLoader from "react-spinners/BarLoader";
import {useEffect} from 'react'
import JobCard from '@/components/job-card'

const SavedJob = () => {
  const {isLoaded} = useUser()

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs)

  useEffect(() => {
    if (isLoaded) fnSavedJobs()
  }, [isLoaded])

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }



  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="grid mt-8 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length ? (
            savedJobs.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  saveInit={true}
                  onJobSaved={fnSavedJobs}
                  
                />
              );
            })
          ) : (
            <div>No Saved Jobs found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SavedJob
