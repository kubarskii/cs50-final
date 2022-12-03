import React from "react";
import styles from "./sidebar.module.css";
import { UserService } from "../../services/user.service";
import debounce from "../../utils/debounce";
import { CrossIcon, SearchIcon } from "../icons/icons";
import { PORT } from "../../../constants";
import { setUsers } from "../../store/slices/found-users.slice";
import { useDispatch } from "react-redux";

export default function SearchBar(props) {
  const { token } = props;
  const [searchString, setSearchString] = React.useState("");
  const [searchActive, setSearchActive] = React.useState(false);
  
  const debouncer = () => debounce(fetchUsers, 500)()
  const dispatch = useDispatch();

  const onChange = (e) => {
    const search = e.target.value;
    setSearchString(search);

    if (search.length > 0) {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
    debouncer();
  };

  async function fetchUsers() {
    const { hostname, protocol } = window.location;
    if (searchString.length >= 2) {
      const resp = await UserService.findUser(
        token,
        searchString,
        `${protocol}//${hostname}:${PORT}`
      );
      dispatch(setUsers(resp))
    }
  }

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
          onChange={onChange}
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
