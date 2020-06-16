import React, { useEffect, useState } from "react";
import styles from "./item-container.module.css";
import { useParams, Link } from "react-router-dom";
import { Item } from "../Interfaces/Item";
import fromUnixTime from "date-fns/fromUnixTime";
import Skeleton from "react-loading-skeleton";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { host } from "../utils/host";
import Comments from "../components/Comment";
import CommentsList from "../components/CommentsList";

export default function ItemComments() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [item, setItem] = useState<Item | null>(null);

  const { id } = useParams();

  useEffect(() => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then((x) => {
        if (x.status !== 200) {
          throw new Error("Well an error occurred");
        }
        return x.json();
      })
      .then((x) => {
        const item: Item = x;
        setItem(item);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(true);
        setError(err);
      });
  }, [id]);

  const timeAgo = formatDistanceToNow(fromUnixTime(item?.time ?? 0));

  const showCommentCount = () => {
    if (item?.kids?.length === undefined || item.kids.length === 0) {
      return <p>No Comments Yet</p>
    } else {
      return <>{item?.kids?.length} top level comments</>;
     
    }
  };

  return (
    <>
      {error !== null ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <h2>An Error Occurred. Please Retry Again.</h2>
        </div>
      ) : (
        <div className={styles.itemCommentContainer}>
          <div className={styles.itemCommentHead}>
            <p>
              {isLoading ? (
                <Skeleton height={40} width={500} />
              ) : (
                <>
                  <span className={styles.heading}>
                    <a
                      href={item?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.title}
                    </a>
                  </span>

                  <span> &nbsp; {`(${host(item?.url)})`}</span>
                </>
              )}
            </p>
            <p>
              {isLoading ? (
                <Skeleton width={200} height={20} />
              ) : (
                <>
                  {item?.score} points | by{" "}
                  <Link style={{ color: "#828282" }} to={`/user/${item?.by}`}>
                    {item?.by}
                  </Link>{" "}
                  {timeAgo} ago
                </>
              )}
            </p>
          </div>

          <div className={styles.itemComments}>
              <p>{isLoading ? <Skeleton width={150} /> : <>{showCommentCount()}</>}</p>
            <hr />

            {item?.kids?.length === undefined || item.kids.length === 0 ? (
              <></>
            ) : (
              <CommentsList kids={item?.kids ?? []} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
