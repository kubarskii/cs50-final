import React from "react";
import { UserSearch } from "../components/user-search/user-search";
import styles from "../components/sidebar/sidebar.module.css";

function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <aside className={styles.asideComponent}>
        <UserSearch />
      </aside>
    </div>
  );
}

export default TestPage;
