import React, { useEffect, useRef, useState } from "react";
import { useSetState } from "utils/functions.utils";
import connectSocket from "utils/socket.utils";
import './chat.screen.scss';
import Conversation from 'components/conversation/conversation.component';
import Message from 'components/message/message.component';
import Auth from 'models/auth.model';
import { useSelector } from 'react-redux';
import { setUser } from 'utils/redux.utils';

let socket: any;
const user_id = localStorage.getItem('user');

const Chat = (props: any) => {

  const user: any = useSelector((state: any) => state.user);
  console.log('user', user);
  const [state, setState] = useSetState({
    conversations: [],
    messages: [],
    message: "",
    selectedConversation: "",
    receiver: "",
    receivedConversations: "",
    receivedMessages: [],
    type: "",
    groupMessage: false,
    user: {},
    conversation: {}
  });

  useEffect(() => {
    // connect to socket
    connectToChat();

    socket.on("receive-message", msg => {
      setState({ conversations: msg.conversations, receivedConversations: msg.messages[0].conversation, receivedMessages: msg.messages  });
    });

    socket.on("receive-group-message", data => {
      setState({ groupMessage: true });
    });

    getUserDetail();
    
  },[]);

  useEffect(() => {
    if(state.groupMessage) {
      getConversationList(false);
      setState({ groupMessage: false });
    }
  }, [state.groupMessage]);

  useEffect(() => {
    if(state.selectedConversation.toString() === state.receivedConversations.toString()) {
      setState({ messages: state.receivedMessages })
    }
  }, [state.receivedMessages])

  const getUserDetail = async () => {
    const user: any = await Auth.getUser(user_id);
    setUser(user.data);
  }

  const connectToChat = () => {
    
    // connect socket server
    socket = connectSocket();

    // join chat
    socket.emit('join-chat', { user: user_id });
    socket.on('user-connected', data => {
      console.log("user connected...")

      // get conversation messages
      getConversationList(true);

    })
  };

  const getConversationList = async(start) => {
    socket.emit("get-conversations", { user: user_id, conversation: state.selectedConversation ? state.selectedConversation : false });
    socket.on("conversation-lists", conv => {
      if(start) {
        setState({ conversations: conv.conv });
      } else {
        if(conv.msg) {
          setState({ conversations: conv.conv, receivedMessages: conv.msg, receivedConversations: conv.conversation  });
        } else {
          setState({ conversations: conv.conv  });
        }
      }
    })
  }

  const getMessages = async (conv) => {
    let receiver = conv.members.find(member => member.user._id !== user_id);
    setState({ selectedConversation: conv._id, receiver_id: receiver.user._id, type: conv.type });
    socket.emit("join-room", { conversation: conv._id, user: user_id });
    socket.on("conversation-message", (message) => {
      setState({ messages: message, user: receiver.user, conversation: conv })
    })
  }

  const sendMessage = (msg) => {
    if(msg.length > 0) {
      let req = {
        conversation: state.selectedConversation,
        text: msg,
        user: user_id,
        receiver: state.receiver_id,
        type: state.type
      }
      socket.emit("send_message", req, async(data) => {
        getConversationList(false);
        setState({ message: "" });
      });
    }
  }

  const setMessage = (msg) => {
    setState({ message: msg });
  }

  const sendMessageOnPressEnter = (e, msg) => {
    if (e.key === 'Enter') {
      if(msg.length > 0) {
        let req = {
          conversation: state.selectedConversation,
          text: msg,
          user: user_id,
          receiver: state.receiver_id,
          type: state.type
        }
        socket.emit("send_message", req, async (data) => {
          getConversationList(false);
          setState({ message: "" });
        });
      }
    }
  }

  const clearMessages = (messages) => {
    if(messages) {
      let data = {
        messages,
        user: user_id
      }
      socket.emit("delete_messages", data, async (msg) => {
        getConversationList(false);
      })
    } else {
      let data = {
        conversation: state.selectedConversation,
        user: user_id
      }
      socket.emit("clear_messages", data, async (res) => {
        getConversationList(false);
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    props.history.push('/login');
  }

  return (
    <div className="chat_screen_container">
      <div className="chat_container">
        <div className="chat_wrapper">
          <div className="conversation_wrapper">
            <Conversation
              conversations={state.conversations}
              user_id={user_id}
              getMessages={getMessages}
              selectedConversation={state.selectedConversation}
              logout={logout}
              user={user}
            />
          </div>
          <div className="message_wrapper">
            { state.selectedConversation &&
              <Message
                messages={state.selectedConversation.toString() === state.receivedConversations.toString() ? state.receivedMessages : state.messages }
                clearMessages={clearMessages}
                type={state.type}
                user={state.user}
                user_id={user_id}
                sendMessageOnPressEnter={sendMessageOnPressEnter}
                sendMessage={sendMessage}
                conversation={state.conversation}
              />}
          </div>
        </div>
      </div>
    </div>
  )
};

export default Chat;