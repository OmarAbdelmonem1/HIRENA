import { useEffect, useState } from "react";
import { getMyProfile } from "./jobSeekerService";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>
        {profile.firstName} {profile.lastName}
      </h1>

      <p>{profile.email}</p>
      <p>{profile.currentJobTitle}</p>
      <p>{profile.bio}</p>
    </div>
  );
}

export default Profile;