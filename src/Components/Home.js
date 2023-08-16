"use client"
import React, { useEffect, useState } from "react";
import SideProfile from "./SideProfile";
import Loading from "./Loading";
import LoadingBar from "react-top-loading-bar";
import Quotes from "./Quotes";
import { useSession } from "next-auth/react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [progress, setProgress] = useState(0)
  const [dataLoading, setDataLoading] = useState(false);
  const { data: session, status } = useSession();
  const [dataLimit, setDataLimit] = useState(4);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchPosts = async () => {
    try {
      setProgress(30)
      setDataLoading(true);
      const response = await fetch(
        `/api/quote?sLimit=${0}&eLimit=${dataLimit}`
      );
      setProgress(50)
      const data = await response.json();
      setDataLoading(false);
      setAllPosts(data.quotes.reverse());
      setHasMoreData(data.totalQuotes > dataLimit);
      setProgress(100)
      return data;
    } catch (error) {
      setProgress(100)
      console.log("failed to get quotes", error);
    }
  };

  const fetchMoreData = async () => {
    const newStartLimit = dataLimit;
    const newEndLimit = dataLimit + 4;
    const response = await fetch(
      `/api/quote?sLimit=${newStartLimit}&eLimit=${newEndLimit}`
    );
    const data = await response.json();
    if (data.quotes.length > 0) {
      setAllPosts((prevPosts) => [...prevPosts, ...data.quotes.reverse()]);
      setDataLimit(newEndLimit);
    } else {
      setHasMoreData(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (status === "loading") {
    return <Loading/>
  }
  return (
    <>
      <div className="text-white box-border flex justify-end bg-black">
      <LoadingBar
            color="#f11946"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
      />
        <div className="w-full sm:pl-20 p-2" id="quotes-section">
          <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchMoreData}
            hasMore={hasMoreData}
            loader={
              <h4 className="w-full text-center text-white ">
                Loading ...
              </h4>
            }
          >
            <Quotes
              posts={allPosts}
              section={"Trending"}
              dataLoading={dataLoading}
            />
          </InfiniteScroll>
        </div>
        <div
          className="sm:block hidden"
          id="side-profile"
          style={{ minWidth: "30%" }}
        >
          <SideProfile session={session} />
        </div>
      </div>
    </>
  );
}