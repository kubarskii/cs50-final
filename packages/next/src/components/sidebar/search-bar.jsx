import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import styles from "./sidebar.module.css";
import { UserService } from "../../services/user.service";
import debounce from "../../utils/debounce";
import { CrossIcon, SearchIcon } from "../icons/icons";
import { PORT } from "../../../constants";
import { setUsers, clearUsers } from "../../store/slices/found-users.slice";

export default function SearchBar(props) {
  const { token } = props;
  const [searchString, setSearchString] = React.useState("");
  const [searchActive, setSearchActive] = React.useState(false);

  const debouncer = useMemo(() => debounce(fetchUsers, 500), [false]);
  const dispatch = useDispatch();

  const onChange = (e) => {
    const search = e.target.value;
    setSearchString(search);

    if (search.length > 0) {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
    debouncer(search);
  };

  async function fetchUsers(search) {
    // Remove this mock
    const resp = {
      foundUsers: [
        {
          name: "foo",
          id: "2",
          surname: "bar",
          login: "foo",
        },
        {
          name: "bazz",
          id: "3",
          surname: "boba",
          login: "xephos",
        },
      ],
    };
    dispatch(setUsers(resp));
    // const { hostname, protocol } = window.location;
    // if (search.length >= 2) {
    //   const resp = await UserService.findUser(
    //     token,
    //     search,
    //     `${protocol}//${hostname}:${PORT}`
    //   );
    //   dispatch(setUsers(resp));
    // }
  }

  const clear = () => {
    setSearchString("");
    setSearchActive(false);
    dispatch(clearUsers());
  };

  return (
    <div className={styles.searchBarWrapper}>
      <div
        className={[searchActive ? styles.active : "", styles.searchBar].join(
          " "
        )}
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
          <button type="button" className={styles.clearSearchBarButton} onClick={clear}>
            <CrossIcon />
          </button>
        )}
      </div>
    </div>
  );
}
