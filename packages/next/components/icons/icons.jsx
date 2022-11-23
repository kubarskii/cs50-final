import React from "react";
import SearchSVG from "../../assets/img/search.svg";
import CrossSVG from "../../assets/img/cross.svg";

export function SearchIcon() {
  const url = SearchSVG.src;
  return <img src={url} />;
}

export function CrossIcon() {
  const url = CrossSVG.src;
  return <img src={url} />;
}
