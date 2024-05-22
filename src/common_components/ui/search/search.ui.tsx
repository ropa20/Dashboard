import React from 'react';
import search_icon from 'assets/icons/search.svg';
import './search.ui.scss';

interface searchProps {
  value: string;
  onChange: any;
}
function Search(props: searchProps) {
  const { value, onChange } = props;
  return (
    <div className="search_container">
      <div className="search_icon_wrapper">
        <img src={search_icon} className="search_icon" alt="search" />
      </div>
      <input
        className="search menu"
        placeholder="Search"
        value={value}
        onChange={(event: any) => onChange(event.target.value)}
      />
    </div>
  );
}

export default Search;
