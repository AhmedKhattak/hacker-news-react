import React from "react";
import NavBar from "../components/NavBar";
import HackerData from "../components/HackerData";
import {  Switch, Route, Redirect, useParams } from "react-router-dom";


export default function Home() {
  
  
  return (
   
    <>
      <NavBar />
        {/* set default route using redirect component */}
        <Switch>
          <Route exact path="/">
           <Redirect to='/top'/>
          </Route>
        <Route path='/:shit'>
      
          <HackerData/>
        </Route>

      </Switch>
     
    </>
  );
}
