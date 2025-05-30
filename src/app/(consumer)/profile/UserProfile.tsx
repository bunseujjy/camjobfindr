import { UserProfile } from "@clerk/nextjs";
import { BookOpen, FileText } from "lucide-react";

const ViewProfile = () => {
  return (
    <div className="container mx-auto">
      {/* Custom Resume Section */}
      <UserProfile.Page label="Resume" url="resume" labelIcon={<FileText />}>
        <div className="space-y-4 p-4">
          <h1 className="text-2xl font-bold">My Resume</h1>
          <div className="border rounded-lg p-4">
            {/* Your resume content goes here */}
            <p>Resume content will appear here</p>
          </div>
        </div>
      </UserProfile.Page>

      {/* Custom Terms Section */}
      <UserProfile.Page label="Terms" url="terms" labelIcon={<BookOpen />}>
        <div className="space-y-4 p-4">
          <h1 className="text-2xl font-bold">Terms & Conditions</h1>
          <div className="prose max-w-none">
            {/* Your terms content goes here */}
            <p>Terms and conditions content will appear here</p>
          </div>
        </div>
      </UserProfile.Page>
    </div>
  );
};

export default ViewProfile;
