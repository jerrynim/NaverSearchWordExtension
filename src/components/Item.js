import React, { Component } from "react";
import "../App.css";

class Item extends Component {
  render() {
    const { rank, keyword } = this.props;
    const { onClick } = this.props;
    return (
      <div>
        <div className="Item_box">
          <b className="Rank_style">{rank}</b>
          <span className="keyword_style" onClick={onClick}>
            {keyword}
          </span>
        </div>
      </div>
    );
  }
}

export default Item;
