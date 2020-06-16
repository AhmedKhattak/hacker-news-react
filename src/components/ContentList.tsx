import React from "react";
import styles from "./contentlist.module.css";
import styles2 from "./hackercard.module.css";
import { Item } from "../Interfaces/Item";
import { Link, useLocation } from "react-router-dom";
import { host } from "../utils/host";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import fromUnixTime from "date-fns/fromUnixTime";
import Skeleton from "react-loading-skeleton";

interface ContentListProps {
  data: Item[];
  isLoading: boolean;
}

export default function ContentList(props: ContentListProps) {
  const path = useLocation().pathname
  return (
    <>
      <div className={styles.contentList}>
        {props.data.map((x) => {
          const timeAgo = formatDistanceToNow(fromUnixTime(x.time ?? 0));

          return (
            <div key={x.id} className={styles2.hackerCard}>
              <div>{x.score ?? <Skeleton width={30} height={30} />} </div>
              <div>
                <p style={{ marginBottom: "7px" }}>
                  {props.isLoading ? (
                    <Skeleton width={400} />
                  ) : (
                    <>
                      <span className="title">
                        <a
                          style={{ color: "#34495e", textDecoration: "none" }}
                          href={x.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {x.title}
                        </a>
                      </span>
                      <span style={{ fontSize: "15px", color: "#828282" }}>
                        {path === '/ask' ? `` : `(${host(x.url)})` } 
                      </span>
                    </>
                  )}
                </p>
                <p style={{ color: "#828282", marginTop: "7px" }}>
                  {props.isLoading ? (
                    <Skeleton width={300} />
                  ) : (
                    <>
                      by{" "}
                      <span>
                        <Link style={{ color: "#828282" }} to={`/user/${x.by}`}>
                          {x.by}
                        </Link>
                      </span>
                      <span>{timeAgo} ago</span>
                      <span>
                        |{" "}
                        <Link style={{ color: "#828282" }} to={`/item/${x.id}`}>
                          {x.kids?.length ?? 0} comments
                        </Link>{" "}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
