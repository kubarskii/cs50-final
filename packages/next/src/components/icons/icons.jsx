import React from "react";
import SearchSVG from "../../assets/img/search.svg";
import CrossSVG from "../../assets/img/cross.svg";
import LogoutSVG from "../../assets/img/logout.svg";
import BackSVG from "../../assets/img/arrow-left.svg";

export function SearchIcon() {
  const url = SearchSVG.src;
  return <img src={url} />;
}

export function CrossIcon() {
  const url = CrossSVG.src;
  return <img src={url} />;
}

export function LogoutIcon() {
  const url = LogoutSVG.src;
  return <img src={url} />;
}

export function BackIcon() {
  const url = BackSVG.src;
  return <img src={url} />;
}