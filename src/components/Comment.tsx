import React, { useState, useEffect, useCallback } from "react";
import { Item } from "../Interfaces/Item";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import fromUnixTime from "date-fns/fromUnixTime";
import { is, he } from "date-fns/locale";
import { Link } from "react-router-dom";
import { time } from "console";
import Skeleton from "react-loading-skeleton";
import  "./comment.module.css";
import styled from "styled-components";

interface CommentsProps {
  kids: number[];
  item: Item;
  isParentLoading?: boolean;
}

const ExpandMoreButton = styled.button`
  margin-right: "10px";
  background-color: white;
  color: rgb(130, 130, 130);
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  outline: none;
`;

export default function Comments({
  kids,
  item,
  isParentLoading = true,
}: CommentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState< Error | null>(null);
  const [comments, setComments] = useState<Item[] | null>(null);



  useEffect(() => {
    // // if we already loaded comments or collapse is true or there is no error don't make a network request
    
    if(isCollapsed || comments) { return }
    // if is collapses or has comments but no error 
    // then skip network call

    // other wise if it has error then make network call

    
    setIsLoading(true);
    setComments(Array(kids?.length ?? 10).fill({}));

    Promise.all(
      kids.map((x) =>
        fetch(` https://hacker-news.firebaseio.com/v0/item/${x}.json`)
      )
    )
      .then((res) => {
        const err = res.find((x) => x.status !== 200);
        if (err) {
          throw new Error("One of the responses is not 200" + err.json);
        }

        return Promise.all(res.map((x) => x.json()));
      })
      .then((x) => {
        console.log(x);
        console.log("isloading should be false now");
        setIsLoading(false);
        setComments(x);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  }, [isCollapsed, kids, comments, item, error]);

  // const viewMoreComments = useCallback(() => {
  //   setIsCollapsed((prev) => !prev);
  // }, []);

  const viewMoreComments = () => {
    setIsCollapsed(!isCollapsed);
    setError(null)
  };

  const timeAgo = formatDistanceToNow(fromUnixTime(item.time ?? 0));

  const expandMore = () => {
    console.log(
      Boolean(item.kids?.length !== undefined || item.kids?.length !== 0)
    );
    if (item.kids?.length !== undefined && item.kids?.length !== 0) {
      return (
        <ExpandMoreButton onClick={viewMoreComments}>
          {isCollapsed
            ? `+ View ${item.kids.length ?? 0} Comments`
            : `- Hide ${item.kids.length ?? 0} Comments`}
        </ExpandMoreButton>
      );
    }
  };

  return (
    <div style={{ marginLeft: "10px" }}>
      <p>
        {isParentLoading ? (
          <Skeleton width={150} />
        ) : (
          <>
            <Link
              style={{ color: "#828282", marginRight: "10px" }}
              to={`/user/${item.by}`}
            >
              {item.by}
            </Link>
            {timeAgo} ago
          </>
        )}
      </p>
      {isParentLoading ? (
        <Skeleton count={3} />
      ) : (
        <p
          style={{ color: "#34495e"}}
          dangerouslySetInnerHTML={{ __html: item.text ?? "" }}
        ></p>
      )}

      {/* render expand more button */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "stretch",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {expandMore()}
        <span style={{ background: "#cccc", height: "0.5px", flex: 1 }}></span>
      </div>

      <div style={{ display: isCollapsed ? "none" : "block" }}>
        {error !== null  ? (
          <p
            style={{
              display: isCollapsed ? "none" : "block",
              marginLeft: "10px",
            }}
          >
            Could not load comments. An Error Occurred. Please refresh the page.
          </p>
        ) : (
          <>
            {comments?.map((x) => {
              // recursively render the comment again (not really recursive just nested)
              return (
                <Comments
                  key={x.id}
                  kids={x.kids ?? []}
                  item={x}
                  isParentLoading={isLoading}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}


// // only updated if the flag is set
// export default React.memo(Comments,(prev, next) => {
//   return true
// })


// interface CommentState {
//   isCollapsed: boolean,
//   isLoading: boolean,
//   comments: Item[] | null,
//   error: {
//     error: Error | null,
//     shouldUpdate: boolean
//   }
// }

// export default class Comments extends React.PureComponent<CommentsProps, CommentState> {

//   constructor(props: CommentsProps) {
//     super(props);
//     this.state = {
//       isCollapsed: true,
//       isLoading: true,
//       error: {
//         error: null,
//         shouldUpdate: false
//       },
//       comments: null,
//     };
//   }

//   // just need to setup these things
//   componentDidMount(){
//     const {
//       error,
//       isCollapsed,
//       comments
//     } = this.state
//     const {
//      kids
//     } = this.props

//     if (!(error.error instanceof Error) && (isCollapsed || comments)) {
//       return;
//     }

//     this.setState({
//       isLoading: true,
//       comments: Array(kids?.length ?? 10).fill({})
//     })

   
   

//     Promise.all(
//       kids.map((x) =>
//         fetch(` https://hacker-news.firebaseio.com/v0/item/${x}.json`)
//       )
//     )
//       .then((res) => {
//         const err = res.find((x) => x.status !== 200);
//         if (err) {
//           throw new Error("One of the responses is not 200" + err.json);
//         }

//         return Promise.all(res.map((x) => x.json()));
//       })
//       .then((x) => {
//         console.log(x);
//         console.log("isloading should be false now");

//         this.setState({
//           isLoading: false,
//           comments: x
//         })
       
//       })
//       .catch((err) => {
//         this.setState({
//           isLoading: false,
//           error: err
//         })
       
//       });
//   }

//   // shouldComponentUpdate(nextProps: {}, nextState: CommentState){
//   //   console.log(nextProps)
//   //   return nextState.error.shouldUpdate
//   // }

//   componentDidUpdate(){

//     const {
//       error,
//       isCollapsed,
//       comments
//     } = this.state
//     const {
//      kids
//     } = this.props

//     if (!(error.error instanceof Error) && (isCollapsed || comments)) {
//       return;
//     }

//     this.setState({
//       isLoading: true,
//       comments: Array(kids?.length ?? 10).fill({})
//     })

    
   

//     Promise.all(
//       kids.map((x) =>
//         fetch(` https://hacker-news.firebaseio.com/v0/item/${x}.json`)
//       )
//     )
//       .then((res) => {
//         const err = res.find((x) => x.status !== 200);
//         if (err) {
//           throw new Error("One of the responses is not 200" + err.json);
//         }

//         return Promise.all(res.map((x) => x.json()));
//       })
//       .then((x) => {
//         console.log(x);
//         console.log("isloading should be false now");

//         this.setState({
//           isLoading: false,
//           comments: x
//         })
       
//       })
//       .catch((err) => {
//         this.setState({
//           isLoading: false,
//           error: err
//         })
       
//       });
//   }

//   viewMoreComments = () => {
//     this.setState(prev => {
//       return {
//         ...prev,
//         isCollapsed: !prev.isCollapsed,
//         error: {
//           error: null,
//           shouldUpdate: true
//         }
//       }
//     })
//   }

//   expandMore = () => {
//     const {item} = this.props
//     const {isCollapsed} = this.state
//     console.log(
//       Boolean(item.kids?.length !== undefined || item.kids?.length !== 0)
//     );
//     if (item.kids?.length !== undefined && item.kids?.length !== 0) {
//       return (
//         <ExpandMoreButton onClick={this.viewMoreComments}>
//           {isCollapsed
//             ? `+ View ${item.kids.length ?? 0} Comments`
//             : `- Hide ${item.kids.length ?? 0} Comments`}
//         </ExpandMoreButton>
//       );
//     }
//   };

//   render() {
//     const {
//       isCollapsed,
//       comments,
//       error,
//       isLoading
      
//     } = this.state

//     const {
//       isParentLoading,
//       item,
      
//     } = this.props

//     const timeAgo = formatDistanceToNow(fromUnixTime(item.time ?? 0));

//     return (
//       <div style={{ marginLeft: "10px" }}>
//         <p>
//           {isParentLoading ? (
//             <Skeleton width={150} />
//           ) : (
//             <>
//               <Link
//                 style={{ color: "#828282", marginRight: "10px" }}
//                 to={`/user/${item.by}`}
//               >
//                 {item.by}
//               </Link>
//               {timeAgo} ago
//             </>
//           )}
//         </p>
//         {isParentLoading ? (
//           <Skeleton count={3} />
//         ) : (
//           <p
//             style={{ color: "#34495e" }}
//             dangerouslySetInnerHTML={{ __html: item.text ?? "" }}
//           ></p>
//         )}

//         {/* render expand more button */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "stretch",
//             alignItems: "center",
//             marginTop: "20px",
//           }}
//         >
//           {this.expandMore()}
//           <span
//             style={{ background: "#cccc", height: "0.5px", flex: 1 }}
//           ></span>
//         </div>

//         <div style={{ display: isCollapsed ? "none" : "block" }}>
//           {error.error !== null ? (
//             <p
//               style={{
//                 display: isCollapsed ? "none" : "block",
//                 marginLeft: "10px",
//               }}
//             >
//               Could not load comments. An Error Occurred. Please refresh the
//               page.
//             </p>
//           ) : (
//             <>
//               {comments?.map((x) => {
//                 // recursively render the comment again (not really recursive just nested)
//                 return (
//                   <Comments
//                     key={x.id}
//                     kids={x.kids ?? []}
//                     item={x}
//                     isParentLoading={isLoading}
//                   />
//                 );
//               })}
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }
// }
