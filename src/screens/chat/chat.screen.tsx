import React, { useEffect, useRef, useState } from "react";
import { useSetState } from "utils/functions.utils";
import connectSocket from "utils/socket.utils";
import './chat.screen.scss';
import Profile from '../../assets/images/dp.jpeg';
import SendMsgIcon from '../../assets/images/send_msg.png';
import ChatModel from "models/chat.model";
import moment from "moment";
import uuid from 'react-uuid';
import { useSelector, useDispatch } from 'react-redux';
import { CONVERSATION } from '../../utils/types.utils';
let socket: any;
const user_id = localStorage.getItem('user');

function ChatScreen() {
  
  const chat = useSelector((state: any) => state.chat);
  // console.log("chat", chat);
  const [state, setState] = useSetState({ conversations: [], message: "", selectedConv: "", messages: [], to_user: "" });
  const dispatch = useDispatch();
  const messagesEndRef: any = useRef(null);

  useEffect(() => {

    connectToChat();

    socket.on("receive-message", msg => {
      console.log("msgggg", msg);
      console.log("lololololo", state);
      setState({ conversations: msg.conversations, messages: msg.messages });
    });

  },[]);

  useEffect(() => {
    console.log("state", state.selectedConv);
    // setState({ selectedConv: state.selectedConv });
  },[state]);

  const connectToChat = () => {
    
    // connect socket server
    socket = connectSocket();

    // join chat
    socket.emit('join-chat', { user: user_id });
    socket.on('user-connected', data => {
      console.log("user connected...")

      // get conversation messages
      getConversationList();

      // receiveMessage();
    })
  }

  const getConversationList = async() => {
    // console.log("user_id", user_id);
    // console.log("state.selectedConv", state.selectedConv);
    socket.emit("get-conversations", { user: user_id, conversation: state.selectedConv ? state.selectedConv : false });
    socket.on("conversation-lists", conv => {
      console.log("conv state", state);
      if(conv.msg && conv.msg.length > 0 && conv.msg[0].conversation == state.selectedConv) {
        setState({ conversations: conv.conv, messages: conv.msg });
      } else {
        setState({ conversations: conv.conv });
      }
    })
  }

  const getConversationApi = async() => {
    let conv: any = await ChatModel.getConversations({ user: user_id });
    setState({ conversations: conv.data });
  }

  const sendMessage = () => {
    if(state.message.length > 0) {
      let req = {
        conversation: chat.selectedConv,
        text: state.message,
        user: user_id,
        receiver: state.receiver_id
      }
      socket.emit("send_message", req);
      setState({ message: "" });
      getConversationList();
    }
  }

  const receiveMessage = (msg) => {
    // console.log("receive message", state);
    // console.log("msg", msg);
    // socket.on("receive-message", (msg) => {
      // if(msg.conversation === chat.selectedConv) {
        let message = state.messages;
        message.push(msg);
        setState({ messages: [...state.messages, ...[msg]] });
      // }
      getConversationList();
      // console.log("latest message", state.messages.length);
    // });
  }

  const getMessages = async (conv) => {
    let receiver = conv.members.find(member => member.user._id !== user_id);
    dispatch({ type: CONVERSATION, payload: { selectedConv: conv._id }});
    setState({ selectedConv: conv._id, receiver_id: receiver.user._id });
    socket.emit("join-room", { conversation: conv._id, user: user_id });
    socket.on("conversation-message", (message) => {
      setState({ messages: message })
      // console.log("message", message);
      // setMessages(message);
    })
  }

  console.log("state message", state)

  const onMsgType = (e) => {
    setState({ message: e.target.value })
  }

  const sendMessageOnPressEnter = (e) => {
    if (e.key === 'Enter') {
      if(state.message.length > 0) {
        let req = {
          conversation: chat.selectedConv,
          text: state.message,
          user: user_id,
          receiver: state.receiver_id
        }
        socket.emit("send_message", req);
        setState({ message: "" });
        getConversationList();
      }
    }
  }

  return (
    <div className="chat_screen">
      <div className="chat_container">
        <div className="chat_lists">
          <div className="chats">
            {state.conversations.map((conv, index) =>
              <div className={`conversation ${conv._id === state.selectedConv && "conversation_border"}`} onClick={() => getMessages(conv)} key={uuid()}>
                <div className="profile_picture">
                  <img alt="profile_pic" src={Profile} className="profile_pic" />
                </div>
                <div className="profile_name">
                  {conv.type === "private"
                  ?  <div className="profile_name_details">
                      <div className="name">{conv.members.findIndex(member => member.user._id === user_id) === 0 ? conv.members[1].user.first_name : conv.members[0].user.first_name }</div>
                      <div className="last_update">{conv?.last_message?.created_at ? moment(conv.last_message.created_at).format("hh:mm a") : null }</div>
                    </div>
                  : <div className="profile_name_details">
                      <div className="name">{conv.name}</div>
                      <div className="last_update">{conv?.last_message?.created_at ? moment(conv.last_message.created_at).format("hh:mm a") : null }</div>
                    </div>}
                  <div className="last_message">{conv?.last_message?.text ? conv.last_message.text : null}</div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="chat_contents">
          { chat.selectedConv &&
            <div className="message_content">
              {state.messages && state.messages.length > 0
              ? <div className="messages">
                  {/* <div className="_conversation_header">
                    <div className="profile">
                      <img src={Profile} alt="conv_head_profile" className="profile_head" />
                    </div>
                    <div className="profile_details">
                      
                    </div>
                  </div> */}
                  <div className="message_lists" ref={messagesEndRef} >
                    {state.messages.map((msg, index) =>
                      msg.user === user_id
                      ? <div className="send_message_container" key={uuid()}>
                          <div className="message_content">
                            <div className="message_text">{msg.text}</div>
                          </div>
                        </div>
                      : <div className="received_message_container" key={uuid()}>
                          <div className="message_content">
                            <div className="message_text">{msg.text}</div>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              : <div className="empty_message">
                  <div className="warning_text">
                    <div className="empty_warning">No messages found</div>
                  </div>
                </div>}
              <div className="text_input_container">
                <div className="text_box">
                  <input placeholder="Enter your text" value={state.message} onKeyDown={(e) => sendMessageOnPressEnter(e)} onChange={(e) => setState({ message: e.target.value })} />
                </div>
                <div className="submit_btn">
                  {/* <button onClick={() => sendMessage()}>Send</button> */}
                  <div className="send_msg_btn" onClick={(e) => sendMessage()}>
                    <img alt="send_msg_icon" src={SendMsgIcon} className="send_msg_icon" />
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>
  )

}

export default ChatScreen;