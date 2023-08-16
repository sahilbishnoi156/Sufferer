"use client";
import Search from "@/Components/Search";
import { useEffect, useState } from "react";
import Skeleton from "../../Components/Skeleton";
import UserIds from "../../Components/UserIds";
import LoadingBar from "react-top-loading-bar";

export default function page() {
  const [dataLoading, setDataLoading] = useState(false);
  const [allUsers, setUsers] = useState([]);
  const [progress, setProgress] = useState(0)
  const [searchProg, setSearchProg] = useState(false);

  const fetchUsers = async () => {
    try {
      setProgress(30)
      setSearchProg(false);
      setDataLoading(true);
      const response = await fetch("/api/users/allUsers");
      setProgress(60)
      const data = await response.json();
      Array.isArray(data) ? setUsers(data) : setUsers([data])
      setDataLoading(false);
      setProgress(100)
    } catch (error) {
      console.log("failed to get quotes", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="h-screen w-full sm:w-2/3 p-4 sm:p-8 flex flex-col sm:gap-12 gap-10 text-white sm:ml-28">
      <LoadingBar
            color="#f11946"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
      />
      <div>
        <Search setDataLoading={setDataLoading} setSearchProg={setSearchProg} setUsers={setUsers} fetchUsers={fetchUsers} />
      </div>
      <div className="flex flex-col gap-8">
        <div className="text-xl">{searchProg ? "Results":"People You May Know"}</div>
        {dataLoading ? (
          <Skeleton type="sideProfile" />
        ) : (
          <>
            {allUsers.slice(0,5).map((user) => {
              return (
                <UserIds
                  heading="People You May Know"
                  key={user._id}
                  username={user.username}
                  user_image={user.image}
                  userId={user._id}
                  given_name={user.given_name}
                  family_name={user.family_name}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}