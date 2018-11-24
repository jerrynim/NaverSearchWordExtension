/*global chrome*/
import React, { Component } from "react";
import "./App.css";
import Item from "./components/Item";

class App extends Component {
  state = {
    rankItems: [],
    curTime: "",
    selected: "실시간 검색어",
    i: 0
  };

  _apiCall = () => {
    return fetch("http://rank.search.naver.com/rank.js")
      .then(response => response.json())
      .then(json => json.data[0].data)
      .catch(err => console.log(err));
  }; //naver실시간 검색어 json으로 request

  _getRanks = async () => {
    const rankItems = await this._apiCall();
    await this.setState({
      rankItems: rankItems
    });
    console.log(this.state);
    console.log("state에 저장됨");
  }; //jsonn의 request 대기후 state에 저장

  componentDidMount() {
    this._getRanks(); //state에 json 저장
    console.log("마운트됨");

    setInterval(() => {
      const { i } = this.state;
      this.setState({
        curTime: new Date().toLocaleString()
      });
      console.log(this.state.i);
      if (i === 0) {
        document.getElementsByClassName("Item_box")[i].className = "example1";
        this.setState({ i: i + 1 });
      } else {
        document.getElementsByClassName("example1")[0].className = "Item_box";
        if (i < 10) {
          document.getElementsByClassName("Item_box")[i].className = "example1";
          this.setState({ i: i + 1 });
        } else {
          this.setState({ i: 0 });
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  _goToUrl = id => {
    let Sitem = id.target.innerText;
    function getCurrentTab(callback) {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        tabs => {
          callback(tabs[0]);
        }
      );
    }

    getCurrentTab(tab => {
      chrome.runtime.sendMessage(
        { type: "ClickedItem", tabId: tab.id, item: Sitem },
        response => {
          if (response) {
            console.log("Clicked massage Passing");
          }
        }
      );
    });
  }; //아이템 클릭시 링크이동 메시지 패싱

  _goToNaver = () => {
    chrome.tabs.update({
      url: "https://search.naver.com"
    });
  }; //네이버 메인으로의 메시지 패싱

  render() {
    const { rankItems } = this.state;
    const { _goToUrl, _goToNaver } = this;
    return (
      <div className="wrapper">
        <div className="naver" onClick={_goToNaver} />
        <select className="selectbox">
          <option>실시간 검색</option>
          <option>게임</option>
          <option>영화</option>
          <option>신발</option>
        </select>

        <main className="box">
          <ItemList rankItems={rankItems} onClick={_goToUrl} />
        </main>
        <div>
          <span className="clock">{this.state.curTime}</span>
          <span className="font-naver"> 네이버 검색어 </span>
        </div>
      </div>
    );
  }
}

class ItemList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.rankItems !== nextProps.rankItems;
  }

  render() {
    const { rankItems, onClick } = this.props;
    const rankList = rankItems
      .filter(item => item.rank <= 10)
      .map(item => (
        <Item
          keyword={item.keyword}
          rank={item.rank}
          onClick={onClick}
          key={item.rank}
        />
      )); //10개의 아이템 생t

    return <div>{rankList}</div>;
  }
}

export default App;
