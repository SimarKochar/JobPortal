import { getApplications } from '@/api/apiApplication'
import useFetch from '@/hooks/use-fetch'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { useUser } from '@clerk/clerk-react'
import ApplicationCard from "@/components/applicationCard";

const CreatedApplications = () => {
    const { user, isLoaded } = useUser();
    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications
    } = useFetch(getApplications,{
        user_id:user.id
    })

    useEffect(()=>{
     fnApplications()
    },[])

    if (!isLoaded) {
      return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }
  return (
    <div className="flex flex-col gap-2">
      {(applications || []).map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          isCandidate
        />
      ))}
      
    </div>
  );
}

export default CreatedApplications
