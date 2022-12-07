import React from "react";
import { useSelector } from "react-redux";
import { RoomItem } from "../room-item/room-item";
import SearchBar from "../sidebar/search-bar";
import { StatusBar } from "./user-search-status-bar";
import styles from "./user-search.module.css";

export function UserSearch() {
  const users = useSelector((state) => state.foundUsers.users);
  return (
    <div className={styles.userSearchBody}>
      <SearchBar token={123} />
      <StatusBar found={users.length}/>
      {users.map((elem) => (
        <RoomItem user={elem} key={elem.id} />
      ))}
    </div>
  );
}
