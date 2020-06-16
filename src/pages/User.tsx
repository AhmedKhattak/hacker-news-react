import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import { useParams } from "react-router-dom";
import { User as UserInterface } from "../Interfaces/User";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import fromUnixTime from "date-fns/fromUnixTime";
import Skeleton from "react-loading-skeleton";

export default function User() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<UserInterface | null>(null);
  console.log(id);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
      .then((x) => {
        if (x.status !== 200) {
          throw new Error("Well an error occured");
        }
        return x.json();
      })
      .then((x) => {
        const user: UserInterface = x;
        setUser(user);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(true);
        setError(err);
      });
  }, [id]);

  const timeAgo = formatDistanceToNow(fromUnixTime(user?.created ?? 0));
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
        <div className={styles.userContainer}>
          <div>
            
            <p> {isLoading ? <Skeleton width={150} height={30} /> : <strong>User: {id}</strong> } </p>
            <p>
              {isLoading ? (
                <Skeleton width={130} />
              ) : (
                <>
                  {" "}
                  Created: {timeAgo} ago <br /> Karma: {user?.karma}{" "}
                </>
              )}
            </p>

            <p>
              {isLoading ? (
                <Skeleton width={150} />
              ) : (
                <>
                  <a
                    href={`https://news.ycombinator.com/submitted?id=${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    submissions
                  </a>{" "}
                  |{" "}
                  <a
                    href={`https://news.ycombinator.com/threads?id=${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    comments
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
