import React, { useEffect, useRef, useState } from "react";
import { useSetState } from "utils/functions.utils";
import Profile from '../../assets/images/dp.jpeg';
import moment from "moment";
import uuid from 'react-uuid';
import MenuIcon from '../../assets/images/menu.png';
import Logout from '../../assets/images/logout.png';
import './conversation.component.scss';

interface convProps {
  conversations: any[],
  selectedConversation: string,
  getMessages: any,
  user_id: any,
  logout: any,
  user: any
}

const Conversation = (props: convProps) => {

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const [state, setState] = useSetState({ openHeadMenu: false });
  const { conversations, selectedConversation, getMessages, user_id, logout, user } = props;

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setState({ openHeadMenu: false });
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div className="conversation_component">
      <div className="conversation_container">
        <div className="conversation_component_wrapper">
          <div className="user_profile_header_container">
            <div className="user_profile_header_wrapper">
              <div className="user_profile">
                <img src={Profile} alt="user_profile_for_conversation" className="user_profile_pic" />
                <div className="profile_name">{user.username}</div>
              </div>
              <div className="conversation_action_container">
                <div className="action_content">
                  <img src={MenuIcon} alt="conversation_menu" className="menu_icon" onClick={() => setState({ openHeadMenu: true })} />
                  {state.openHeadMenu &&
                  <div className="action_wrap" ref={wrapperRef}>
                    <div className="action_item_container" onClick={logout}>
                      <div className="action_name">Logout</div>
                      <img src={Logout} alt="logout" className="menu_icons" />
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
          { conversations.length > 0 ?
            <div className="chats">
              {conversations.map((conv, index) =>
                <div className={`conversation ${conv._id === selectedConversation && "conversation_border"}`} onClick={() => getMessages(conv)} key={uuid()}>
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
            : <div className="empty_conversation">Conversations not found</div>}
        </div>
      </div>
    </div>
  )
}

export default Conversation;