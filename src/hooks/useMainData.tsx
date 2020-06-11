import React, { useEffect, useState } from "react";
import { delay } from "../utils/delay";

export interface HNData {
    
      ask: number[] | null;
      show: number[] | null;
      job: number[] | null;
      new: number[] | null;
      top: number[] | null;
   
  }

export default function useMainData() {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hnData, setHnData] = useState<HNData>({
    ask: null,
    job: null,
    show: null,
    top: null,
    new: null,
  });

  // get main data first
  useEffect(() => {
    setError(null);
    setIsLoading(true);
    
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

        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    get();
  }, []);

  return {
      error,
      setError,
      isLoading,
      setIsLoading,
      hnData,
      setHnData
  };
}
