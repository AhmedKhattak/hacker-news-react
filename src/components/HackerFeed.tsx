import React, { useEffect, useState, useRef } from "react";
import styles from "./control.module.css";
import {HNData} from '../hooks/useMainData'
import ContentList from "./ContentList";
import {
  useLocation,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { Item } from "../Interfaces/Item";
import LoadingBar from "react-top-loading-bar";
import { delay } from "../utils/delay";

interface HackerFeedProps {
  hnData: HNData
}

export default function HackerData({hnData}: HackerFeedProps) {
  const PAGE_SIZE = 10;

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [isloading, setisLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hnSlice, setHnSlice] = useState<Item[] | undefined>(undefined);

  const location = useLocation();

  const hnPath =
    location.pathname === "/jobs" ? "job" : location.pathname.substr(1);

  const decrement = () => {
    if (!isloading && page > 1) {
      setPage(page - 1);
    }
  };

  const increment = () => {
    if (!isloading && page < totalPages) {
      setPage(page + 1);
    }
  };

  // run each time page changes our next/prev button is pressed
  useEffect(() => {
    setHnSlice(Array(10).fill({}))

    // get array for each page
    // TODO: Need to learn more typescript !
    //@ts-ignore
    const arr: number[] = hnData[hnPath] ?? [];
    // get total pages for each array based on page size
    // round to next number if not an integer
    const totalPages = Math.ceil(arr.length / PAGE_SIZE);
    // set total pages
    setTotalPages(totalPages);

    // based on current page get the array slice
    setisLoading(true);

    setError(null);
    //https://stackoverflow.com/a/42761393

    // if(hnPath !== previousPath) {
    //   items = arr.slice((1 - 1) * PAGE_SIZE, page * PAGE_SIZE);
    // } else {
    const items = arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    Promise.all(
      items.map((x) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${x}.json`
        ).then((x) => x.json())
      )
    )
      .then((x) => {
        console.log(x);
        setHnSlice(x);
        setisLoading(false);
      })
      .catch((err) => {
        setError(err);
        setisLoading(false);
      });

    console.log("yes its called");
  }, [page, hnPath, hnData]);

  return (
    <>
      <div className={styles.contentControl}>
        <button onClick={decrement}>&lt; prev</button>{" "}
        <span>
          {page} / {totalPages}
        </span>{" "}
        <button onClick={increment}>next &gt; </button>
      </div>
      {error && <h1 className={styles.contentControl}>Oopsie Errror</h1>}

      <ContentList isLoading={isloading} data={hnSlice ?? Array(10).fill({})} />
    </>
  );
}
