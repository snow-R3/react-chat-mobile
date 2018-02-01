import React, { Component } from 'react';
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile';
// import io from 'socket.io-client';
import { connect } from 'react-redux';

import { getMsgList, sendMsg, recvMsg, readMsg } from '../../redux/chat.redux';
import { getChatId } from '../../util';

@connect(
  state => state,
  {getMsgList, sendMsg, recvMsg, readMsg}
)
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      showEmoji: false
    }
  }

  componentDidMount() {
    if (!this.props.chat.chatmsg.length) {
      this.props.getMsgList();
  		this.props.recvMsg();
    }
  }

  componentWillUnmount() {
		const to = this.props.match.params.user
		this.props.readMsg(to)
	}

  fixCarousel() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 0)
  }

  handleSubmit() {
    const from = this.props.user._id;
    const to = this.props.match.params.user;
    const msg = this.state.text;
    this.props.sendMsg({from, to, msg});
    this.setState({text: ''});
  }

  render () {
    // console.log(this.props)
    const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ 🤘 👌 👈 👉 👆 👇 ✋  🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 👁 👀 '
    										.split(' ') // 分开，也可以 split(/\s+/g)
    										.filter(v=>v) // 去掉多个空格产生的空字符串
    										.map(v=>({text:v}))

    const userid = this.props.match.params.user;
    const Item = List.Item;
    const users = this.props.chat.users;
    if (!users[userid]) {
      return null;
    }
    const chatid = getChatId(userid, this.props.user._id)
		const chatmsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)
    return (
      <div id='chat-page'>
        <NavBar
          mode='dark'
          icon={<Icon type='left'></Icon>}
          onLeftClick={() => {
            this.props.history.goBack();
          }}
        >
          {users[userid].name}
        </NavBar>

        {chatmsgs.map(v => {
          const avatar = require(`../img/${users[v.from].avatar}.png`)
          return v.from === userid ? (
            <List key={v._id}>
              <Item
                thumb={avatar}
              >{v.content}</Item>
            </List>
          ) : (
            <List key={v._id}>
              <Item
                extra={<img src={avatar} alt="avatar"/>}
                className='chat-me'
              >{v.content}</Item>
            </List>
          )

        })}
        <div className="stick-footer">
          <List>
            <InputItem
              placeholder="Please enter"
              value={this.state.text}
              onChange={
                v => { this.setState({text: v}) }
              }
              extra={
                <div>
                  <span
                    role="img"
                    aria-label="Smile"
                    style={{marginRight: 15}}
                    onClick={() => {
                      this.setState({showEmoji: !this.state.showEmoji})
                      this.fixCarousel();
                    }}
                  >😃</span>
                  <span onClick={() => this.handleSubmit()}>Send</span>
                </div>
              }
            ></InputItem>
          </List>
          {this.state.showEmoji ?
            <Grid
              data={emoji}
              columnNum={9}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={el => {
                this.setState({
                  text: this.state.text + el.text
                })
              }}
            /> : null
          }

        </div>
      </div>
    )
  }
}

export default Chat;
