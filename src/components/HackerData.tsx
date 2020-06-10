import React, { useEffect, useState, useRef } from "react";
import styles from "./control.module.css";
import ContentList from "./ContentList";
import { useLocation, Switch, Route, Redirect, useHistory } from "react-router-dom";
import { Item } from "../Interfaces/Item";
import LoadingBar from 'react-top-loading-bar'

// custom hook for getting previous value 
function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function HackerData() {
  const PAGE_SIZE = 10;
  const initialPage = 1
  const [page, setPage] = useState(1);
  
  const [totalPages, setTotalPages] = useState(1);
  const [isloading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory()

  const [hnData, setHnData] = useState({
    ask: null,
    job: null,
    show: null,
    new: null,
    top: null,
  });

  const ffs: Item[] = []
  const [hnSlice, setHnSlice] = useState(ffs);

  const location = useLocation();
  
  
  
  const hnPath =
    location.pathname === "/jobs" ? "job" : location.pathname.substr(1);
  
    const previousPath = usePrevious(hnPath)

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

 
 
 

 
  // get all the data once and then just use that
  // run once on mount only
  useEffect(() => {
    setError(null)
    setisLoading(true);
    const get = async () => {
      try {
        const res = await Promise.all([
          fetch(
            `https://hacker-news.firebaseio.com/v0/askstories.json`
          ).then((x) => x.json()),
          fetch(
            `https://hacker-news.firebaseio.com/v0/jobstories.json`
          ).then((x) => x.json()),
          fetch(
            `https://hacker-news.firebaseio.com/v0/showstories.json`
          ).then((x) => x.json()),
          fetch(
            `https://hacker-news.firebaseio.com/v0/topstories.json`
          ).then((x) => x.json()),
          fetch(
            `https://hacker-news.firebaseio.com/v0/newstories.json`
          ).then((x) => x.json()),
        ]);

        setHnData({
          ask: res[0],
          job: res[1],
          show: res[2],
          top: res[3],
          new: res[4],
        });

        setisLoading(false);
      } catch (err) {
        setError(err);
        setisLoading(false)
      } 
    };

    get();
  }, []);

  // run each time page changes our next/prev button is pressed
  useEffect(() => {
    
    console.log(hnPath)
    console.log(previousPath)
   
    
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
    
  
    
    setError(null)
    //https://stackoverflow.com/a/42761393
    let items = null 
    if(hnPath !== previousPath) {
      items = arr.slice((1 - 1) * PAGE_SIZE, page * PAGE_SIZE);
    } else {
      items = arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
    Promise.all(
      items.map((x) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${x}.json`
        ).then((x) => x.json())
      )
    ).then((x) => {
      console.log(x);
      setHnSlice(x)
      setisLoading(false);
      
    }).catch(err => {
      setError(err);
      setisLoading(false)
     
    })
    
  }, [page, hnData, hnPath,previousPath]);

  return (
    <>
   
      <div className={styles.contentControl}>
        <button onClick={decrement}>&lt; prev</button>{" "}
        <span>
          {page} / {totalPages}
        </span>{" "}
        <button onClick={increment}>next &gt; </button>
      </div>
      {error && <h1  className={styles.contentControl}>Oopsie Errror</h1>}                    

      {isloading ? (
        <h1 className={styles.contentControl}>Loading...</h1>
      ) : (
        <ContentList data={hnSlice} />
      )}
    </>
  );
}
