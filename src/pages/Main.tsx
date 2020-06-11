import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import HackerFeed from "../components/HackerFeed";
import { Switch, Route, Redirect, useParams, Link, useLocation } from "react-router-dom";
import useMainData from "../hooks/useMainData";
import { isError } from "util";
import ContentList from "../components/ContentList";

export default function Home() {
  // custom hook !
  const { error, hnData, isLoading } = useMainData();
  const location = useLocation()

  console.log('rendered')
 
  console.log(hnData);

  return (
    <>
      <NavBar />
      
      {error && <h1>FUCK</h1>}

     
        <Switch>
          <Route exact path="/">
            <Redirect to="/top" />
          </Route>

          <Route   paths={["/top", "/new", "/jobs", "/ask","/show"]}>
          {/* always remount when params change  */}
           <HackerFeed key={location.pathname} hnData={hnData}/>
        </Route>

          <Route exact path="/user/:id">
          {/* always remount when params change  */}
          <h1 style={{marginTop: '60px'}}>user/id</h1>
        </Route>

        <Route exact path="/item/:id">
          {/* always remount when params change  */}
          <h1 style={{marginTop: '60px'}}>item/id
           <Link to='/user/24243'>shee</Link>
          </h1>
          
        </Route>

       

        <Route path='*'>
          <h1  style={{marginTop: '60px'}}>404</h1>
        </Route>
       
        </Switch>
      
    </>
  );
}
