// https://github.com/HackerNews/API
// https://transform.tools/json-to-typescript
// The Item objects covers all possible data objects returned from hacker news feeds
export  interface Item {
    id: number;
    deleted?: boolean;
    type?: string;
    by?: string;
    time?: number;
    text?: string;
    dead?: boolean;
    parent: number;
    poll: number;
    kids?: number[];
    url?: string;
    score?: number;
    title?: string;
    parts:number[];
    descendants?: number;
}
  