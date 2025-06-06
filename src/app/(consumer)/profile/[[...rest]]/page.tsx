import { UserProfile } from "@clerk/nextjs";

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

const UserProfilePage = () => (
  <UserProfile path="/profile" routing="path">
    {/* You can also pass the content as direct children */}
    <UserProfile.Page label="Terms" labelIcon={<DotIcon />} url="terms">
      <div>
        <h1>Custom Terms Page</h1>
        <p>This is the content of the custom terms page.</p>
      </div>
    </UserProfile.Page>
  </UserProfile>
);

export default UserProfilePage;
