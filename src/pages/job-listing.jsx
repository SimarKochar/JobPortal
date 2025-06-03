import React from 'react'
import useFetch from '../hooks/use-fetch'
import { useEffect } from 'react'
import { getJobs } from '../api/apiJobs'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-react';
import BarLoader from "react-spinners/BarLoader";
import JobCard from '../components/job-card'
import { getCompanies } from '@/api/apiCompnay'
import {Input} from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { SelectGroup } from '@radix-ui/react-select'
import { State } from "country-state-city";


const JobListing = () => {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const{isLoaded} = useUser();

  const {fn: fnJobs, data: jobs, loading: loadingJobs} =  useFetch(getJobs, {location, company_id, searchQuery});
   
  const {
    fn: fnCompanies,
    data: companies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  

  useEffect(() => {
    if(isLoaded) fnJobs();
  }, [isLoaded, searchQuery, location, company_id]);

   const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if( query) {
      setSearchQuery(query);
    }
   }

   const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
   };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  console.log("Jobs:", jobs);

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Add filters here */}

      <form
        onSubmit={handleSearch}
        className="h-14 flex w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Searxh Jobs by Title.."
          name="search-query"
          className="h-full flex-1 px-3 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          {" "}
          Search
        </Button>
      </form>

      <div className='flex flex-col sm:flex-row gap-2 '>
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
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

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(companies || []).map(({ name, id }) => (
                <SelectItem key={name} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={clearFilters} variant="destructive" className="sm:w-1/2">Clear Filters</Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="grid mt-8 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  saveInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobListing
