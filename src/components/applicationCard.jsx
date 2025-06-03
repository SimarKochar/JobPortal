import { updateApplications } from "@/api/apiApplication";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Boxes, Download, School, BriefcaseBusiness } from "lucide-react";
import { BarLoader } from "react-spinners";
import useFetch from "../hooks/use-fetch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const {loadind : loadingHiringStatus, fn: fnHiringStatus} = useFetch(updateApplications,{
     job_id: application.job_id,
  })

  const handleStatusChange = async (status) => {
    await fnHiringStatus(status);
  }
  return (
    <div>
      <Card>
        {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
        <CardHeader>
          <CardTitle className="flex justify-between font-bold">
            {isCandidate
              ? `${application?.job?.title} at ${application?.job?.company?.name}`
              : application?.name || application?.candidate_id || "No Name"}

            <Download
              size={18}
              className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
              onClick={handleDownload}
            ></Download>
          </CardTitle>
        </CardHeader>

        <CardContent className=" flex flex-col gap-4 flex-1">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex gap-2 items-center">
              <BriefcaseBusiness size={15}></BriefcaseBusiness>
              {application?.experience} years of experience
            </div>
            <div className="flex gap-2 items-center">
              <School size={15}></School>
              {application?.education}
            </div>
            <div className="flex gap-2 items-center">
              <Boxes size={15}></Boxes>
              {application?.skills}
            </div>
          </div>
          <hr />
        </CardContent>
        <CardFooter className="flex justify-between ">
          <span>{new Date(application?.created_at).toLocaleDateString()}</span>
          {isCandidate ? (
            <span className="capitalize font-bold">
              Status : {application?.status}
            </span>
          ) : (
            <Select onValueChange={handleStatusChange} defaultValue={application.status}>
              <SelectTrigger className="w-52px">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationCard;
