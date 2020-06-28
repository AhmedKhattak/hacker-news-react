import React from "react";
import styles from "./contentlist.module.css";
import styles2 from "./hackercard.module.css";
import { Item } from "../Interfaces/Item";
import { Link, useLocation } from "react-router-dom";
import { host } from "../utils/host";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import fromUnixTime from "date-fns/fromUnixTime";
import Skeleton from "react-loading-skeleton";
import HackerCard from "./HackerCard";
// import { useMediaQuery } from 'react-responsive'

interface ContentListProps {
  data: Item[];
  isLoading: boolean;
}

export default function ContentList(props: ContentListProps) {
  const path = useLocation().pathname
  return (
  
      <div className={styles.contentList}>
        {props.data.map((x) => {
          const timeAgo = formatDistanceToNow(fromUnixTime(x.time ?? 0));
          return <HackerCard x={x} timeAgo={timeAgo} path={path} isLoading={props.isLoading} key={x.id}/>
        })}
      </div>
    
  );
}
