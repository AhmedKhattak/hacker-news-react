import React, { useState, useEffect } from "react";
import { Item } from "../../Interfaces/Item";
import Comments from "./Comment";

interface CommentsListProps {
  kids: number[];
}

export default function CommentsList({ kids }: CommentsListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [comments, setComments] = useState<Item[] | null>(null);

  useEffect(() => {
    console.log(kids.length)
    setIsLoading(true);
    setComments(Array(kids.length ?? 10).fill({}))
    setError(null);
    Promise.all(
      kids.map((x) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${x}.json`)
      )
    )
      .then((res) => {
        const err = res.find((x) => x.status !== 200);
        if (err) {
          throw new Error("One of the responses is not 200" + err.json);
        }

        return Promise.all(res.map((x) => x.json()));
      })
      .then((x) => {
        console.log(x);
        setComments(x);
        setIsLoading(false)
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  }, [kids]);

  return (
    <div>
     
      
        {comments?.map((x) => {
          return <Comments key={x.id} kids={x.kids ?? []} item={x} isParentLoading={isLoading} />;
        })}
     
    </div>
  );
}
