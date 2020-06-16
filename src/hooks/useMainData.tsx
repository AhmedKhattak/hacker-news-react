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
    
    
    
     // today i learned fetch does not throw an error on 404 responses
     Promise.all([
          fetch(
            `https://hacker-news.firebaseio.com/v0/askstories.json`
          ),
          fetch(
            `https://hacker-news.firebaseio.com/v0/jobstories.json`
          ),
          fetch(
            `https://hacker-news.firebaseio.com/v0/showstories.json`
          ),
          fetch(
            `https://hacker-news.firebaseio.com/v0/topstories.json`
          ),
          fetch(
            `https://hacker-news.firebaseio.com/v0/newstories.json`
          ),
        ]).then(res => {
            const err = res.find(x => x.status !== 200)
            if(err) { throw new Error('One of the responses is not 200' + err.json) }
            
            return Promise.all(res.map(x => x.json()))
           
      
        }).then(res => {
            setHnData({
                ask: res[0],
                job:  res[1],
                show:  res[2],
                top:  res[3],
                new:  res[4],
              });
              setIsLoading(false);
        })
        .catch(err => {
            setError(err);
            setIsLoading(false);
        })

        
     
    
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
