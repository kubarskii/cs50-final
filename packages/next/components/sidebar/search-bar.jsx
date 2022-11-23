import React from "react";
import styles from "./sidebar.module.css";
import { UserService } from "../../services/user.service";
import debounce from "../../utils/debounce";
import { PORT } from "../../constants";
import { CrossIcon, SearchIcon } from "../icons/icons";

export default function SearchBar(props) {
  const { token } = props;
  const [searchString, setSearchString] = React.useState("");
  const [searchActive, setSearchActive] = React.useState(false);

  const onChange = async (e) => {
    const search = e.target.value;
    setSearchString(search);
    if (search.length > 0) {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
    console.log(searchActive);
    // debouncer();
  };

  async function fetchUsers() {
    const { hostname, protocol } = window.location;
    if (searchString >= 2) {
      const resp = await UserService.findUser(
        token,
        searchString,
        `${protocol}//${hostname}:${PORT}`
      );
      return resp;
    }
  }

  const debouncer = React.useMemo(() => debounce(fetchUsers, 300), [token]);

  //   const handler = React.useMemo(() => debounce(onChange, 300), [token]);

  // TODO
  const clear = () => {
    setSearchString("");
    setSearchActive(false);
  };

  return (
    <div className={styles.searchBarWrapper}>
      <div
        className={[
          searchActive ? styles.active : "",
          styles.searchBar,
        ].join(" ")}
      >
        <span className={styles.searchIconSpan}>
          <SearchIcon />
        </span>

        <input
          value={searchString}
          type="text"
          placeholder="Search"
          onChange={(e) => onChange(e)}
        />

        {searchActive && (
          <button className={styles.clearSearchBarButton} onClick={clear}>
            <CrossIcon />
          </button>
        )}
      </div>
    </div>
  );
}
