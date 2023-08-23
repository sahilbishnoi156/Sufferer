import React from "react";
import QuoteItem from "./QuoteItem";
export default function Quotes({ allPosts, section, likedPosts, setAllPosts }) {
  return (
    <>
      <div
        id="quote-area"
        className="flex items-center justify-center flex-col gap-6 mt-10"
      >
        {likedPosts.length > 0 ? (
          allPosts.map((post) => {
            if (likedPosts?.includes(`${post._id}`)) {
              return (
                <QuoteItem
                  key={post._id}
                  creator={post.creator}
                  date={post.date || ""}
                  id={post._id}
                  setPosts={setAllPosts}
                  posts={allPosts}
                  post={post}
                  section={section}
                />
              );
            } else {
              return null;
            }
          })
        ) : (
          <div className="text-white">No Liked Posts</div>
        )}
      </div>
    </>
  );
}
