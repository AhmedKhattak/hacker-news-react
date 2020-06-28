import React from "react";
import NavBar from "../components/navbar/NavBar";
import HackerFeed from "../components/hackerFeed/HackerFeed";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import useMainData from "../hooks/useMainData";
import User from "../components/user/User";
import ItemComments from "../components/articleItem/ItemComment";

export default function Home() {
  // custom hook !
  const { error, hnData } = useMainData();
  const location = useLocation();

  console.log("rendered");

  console.log(hnData);

  return (
    <>
      <NavBar />

      {error !== null ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <h2>An Error Occurred Please Retry Again.</h2>
        </div>
      ) : (
        <>
          <Switch>
            <Route exact path="/">
              <Redirect to="/top" />
            </Route>

            <Route path="/user/:id">
              <User />
            </Route>

            <Route path="/item/:id">
                <ItemComments/>
            </Route>

            <Route paths={["/top", "/new", "/jobs", "/ask", "/show"]}>
              {/* always remount when params change by using different key prop on each path change !
                  This is to reset the counter */}
              {/* https://stackoverflow.com/a/39150493 */}
              <HackerFeed key={location.pathname} hnData={hnData} />
            </Route>

            {/* <Route path='*'>
          <h1  style={{marginTop: '60px'}}>404</h1>
        </Route> */}
          </Switch>
        </>
      )}
    </>
  );
}
