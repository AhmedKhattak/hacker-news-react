import React from "react";
import styles from "./contentlist.module.css";
import { Item } from "../../Interfaces/Item";
import { useLocation } from "react-router-dom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import fromUnixTime from "date-fns/fromUnixTime";
import HackerCard from "../hackerCard/HackerCard";
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
