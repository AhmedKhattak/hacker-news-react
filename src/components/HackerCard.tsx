import React from 'react'
import styles from './hackercard.module.css'
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Item } from '../Interfaces/Item';
import { host } from "../utils/host";

interface HackerCardProps {
    x: Item
    path: string,
    timeAgo: string
    isLoading: boolean
}


export default function HackerCard({x,path, timeAgo, isLoading}: HackerCardProps){
    
    return (
        <div key={x.id} className={styles.hackerCard}>
        <div>{x.score ?? <Skeleton width={30} height={30} />} </div>
        <div style={{width: '100%'}}>
          <p style={{ marginBottom: "7px" , width: '100%'}}>
            {isLoading ? (
              <Skeleton className={styles.skeletonTopLine} />
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
          <p style={{ color: "#828282", marginTop: "7px", width: '100%' }}>
            {isLoading ? (
              <Skeleton className={styles.skeletonBottomLine} />
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
    )
}