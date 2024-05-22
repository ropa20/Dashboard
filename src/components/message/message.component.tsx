import React, { useEffect, useRef, useCallback } from "react";
import { useLongPress, LongPressDetectEvents } from "use-long-press";
import moment from "moment";
import uuid from 'react-uuid';
import { useSetState } from "utils/functions.utils";
import Profile from '../../assets/images/dp.jpeg';
import SendMsgIcon from '../../assets/images/send_msg.png';
import MenuIcon from '../../assets/images/menu.png';
import CloseIcon from '../../assets/images/close.png';
import Logout from '../../assets/images/logout.png';
import Block from '../../assets/images/blocked.png';
import Trash from '../../assets/images/trash.png';
import Tick from '../../assets/images/tick.png';
import './message.component.scss';

interface messageProps {
  messages: any,
  user_id: any,
  sendMessageOnPressEnter: any,
  sendMessage: any,
  user: any,
  type: string,
  conversation: any,
  clearMessages: any,
}

const style = {
  paddingTop: "1px solid #c9c9c7"
}

const Message = (props: messageProps) => {

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const {
    messages,
    user_id,
    sendMessageOnPressEnter,
    sendMessage,
    user,
    type,
    conversation,
    clearMessages
  } = props;
    const [state, setState] = useSetState({ messages: [], message: "", openSettings: false, groupInfo: false, enabled: true, showCheckBox: false, selectedMessages: [] });

  const callback = useCallback(() => {
    setState({ showCheckBox: true });
  }, []);

  const longPress = useLongPress(state.enabled ? callback : null, {
    // onStart: () => console.log("Press started"),
    // onFinish: () => console.log("Long press finished"),
    // onCancel: () => console.log("Press cancelled"),
    //onMove: () => console.log("Detected mouse or touch movement"),
    threshold: 800,
    captureEvent: true,
    cancelOnMovement: false,
    detect: LongPressDetectEvents.BOTH
  });

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setState({ openSettings: false });
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

  // scroll to top
  useEffect(() => {
    const objDiv: any = document.getElementById("scrollable_div");
    if(objDiv)
      objDiv.scrollTop = objDiv.scrollHeight;
  },[props]);

  const send = (e) => {
    setState({ message: e.target.value });
  }

  const onEnterClick = (e) => {
    if(e.key == "Enter") {
      sendMessageOnPressEnter(e, state.message);
      setState({ message: "" });
    }
  }

  const openSettings = () => {
    setState({ openSettings: !state.openSettings })
  }

  const groupInfo = () => {
    setState({ groupInfo: !state.groupInfo, openSettings: !state.openSettings });
  }

  const selectMessages = () => {
    setState({ showCheckBox: !state.showCheckBox, openSettings: false })
  }

  const addMessage = (id) => {
    const index = state.selectedMessages.indexOf(id);
    if(index > -1) {
      const array = state.selectedMessages;
      array.splice(index, 1);
      setState({ selectedMessages: array });
    } else {
      setState({ selectedMessages: [...state.selectedMessages, ...[id]] });
    }
  }

  const deleteMessages = () => {
    clearMessages(state.selectedMessages)
    setState({ selectedMessages: [], showCheckBox: false });
  }

  const deleteAllMessages = () => {
    clearMessages(false);
    setState({ openSettings: !state.openSettings });
  }

  return (
    <div className="message_component">
      <div className="message_container">
        <div className="message_component_wrapper">
          <div className="messages">
            <div className="message_conversation_header">
              <div className="personal_details">
                <div className="profile">
                  <img src={Profile} alt="conv_head_profile" className="profile_pic"/>
                </div>
                <div className="profile_details">
                  <div className="profile_name">{type === "group" ? conversation.name : user.first_name }</div>
                </div>
              </div>
              <div className="profile_actions">
                <img src={MenuIcon} alt="profile_view" className="menu_icon" onClick={() => openSettings()} />
                {state.openSettings &&
                  <div className="profile_action_container" ref={wrapperRef}>
                    <div className="profile_action_items">
                      <div className="action_option" onClick={() => groupInfo()}>{type === "group" ? `Group Info` : `Contact Info`}</div>
                      <div className="action_option" onClick={() => selectMessages()}>Select Messages</div>
                      <div className="action_option" onClick={() => deleteAllMessages()}>Clear Messages</div>
                      <div className="action_option">Mute Conversation</div>
                      <div className="action_option">Select Messages</div>
                      {type === "group" &&
                      <div className="action_option">Exit Group</div>}
                    </div>
                  </div>}
              </div>
            </div>
            {messages.length > 0
            ? <div className="message_lists" id="scrollable_div">
                {messages.map((msg, index) =>
                  msg.user === user_id
                    ? <div className="send_message_container" key={uuid()}>
                      <div className="message_content" {...longPress}>
                        <div className="message_text" onClick={() => state.showCheckBox ? addMessage(msg._id) : null }>{msg.text}</div>
                        {state.showCheckBox &&
                        <div className="check_box">
                          <div
                            className={`tick_image_container ${state.selectedMessages.indexOf(msg._id) !== -1 && "background_blue"}`}
                            onClick={() => state.showCheckBox ? addMessage(msg._id) : null }
                          >
                            {state.selectedMessages.indexOf(msg._id) !== -1 &&
                              <img src={Tick} className="tick_icon" alt="tick_icon_select_message" />}
                          </div>
                        </div>}
                      </div>
                    </div>
                    : <div className="received_message_container" key={uuid()}>
                      <div className="message_content" {...longPress}>
                        {state.showCheckBox &&
                        <div className="check_box">
                          <div
                            className={`tick_image_container ${state.selectedMessages.indexOf(msg._id) !== -1 && "background_blue"}`}
                            onClick={() => state.showCheckBox ? addMessage(msg._id) : null }
                          >
                            {state.selectedMessages.indexOf(msg._id) !== -1 &&
                              <img src={Tick} className="tick_icon" alt="tick_icon_select_message" />}
                          </div>
                        </div>}
                        <div className="message_text" onClick={() => state.showCheckBox ? addMessage(msg._id) : null }>{msg.text}</div>
                      </div>
                    </div>
                )}  
              </div>
            : <div className="empty_message">
              <div className="warning_text">
                <div className="empty_warning">No messages found</div>
              </div>
            </div>}
          </div>
          {state.showCheckBox ?
          <div className="delete_message_container">
            <div className="delete_message_content">
              <div className="delete_message">
                <div className="cancel_delete_container">
                  <img src={CloseIcon} alt="cancel_delete_icon" className="cancel_delete_icon" onClick={() => setState({ showCheckBox: false, selectedMessages: [] })}  />
                  <div className="selected_count">{state.selectedMessages.length} &nbsp; Selected</div>
                </div>
                <div className="delete_message_icon">
                  <img src={Trash} alt="trash_icon_for_delete_message" className="delete_icon" onClick={() => deleteMessages()} />
                </div>
              </div>
            </div>
          </div>
          : <div className="text_input_container">
              <div className="text_box">
                <input placeholder="Type a message.." ref={input => input && input.focus()}  value={state.message} onKeyDown={(e) => onEnterClick(e)} onChange={(e) => send(e)} />
              </div>
              <div className="submit_btn">
                <div className="send_msg_btn" onClick={(e) => { setState({ message: "" }); sendMessage(state.message)}}>
                  <img alt="send_msg_icon" src={SendMsgIcon} className="send_msg_icon" />
                </div>
              </div>
            </div>}
        </div>
        {state.groupInfo &&
          <div className="group_info fade" id="contact_info">
            <div className="group_info_container">
              <div className="group_info_header_container">
                <img src={CloseIcon} alt="close_group_info" onClick={() => setState({ groupInfo: false })} className="group_info_close_icon" />
                <div className="group_info_head">Contact Info</div>
              </div>
              <div className="contact_info_body">
                <div className="contact_container">
                  <div className="contact_details">
                    <div className="profile_img">
                      <img src={Profile} alt="contact_info_profile" className="contact_info_profile" />
                    </div>
                    <div className="profile_name_details">
                      <div className="profile_name">{type === "group" ? conversation.name : user.first_name }</div>
                      <div className="profile_created_at">{type === "group" ? `Created At ${moment(conversation.created_at).format('DD-MM-YYYY HH:MM a')}` : `Last Message ${moment(conversation.modified_at).format('DD-MM-YYYY HH:MM a')}` }</div>
                    </div>
                  </div>
                  {type === "group" ?
                    <div className="group_members_list_container">
                      <div className="group_members">
                        <div className="members_head">Members</div>
                        <div className="member_details_container">
                          {conversation.members.map((member, index: number) =>
                            <div className="member_details" key={uuid()} style={{paddingBottom: index === conversation.members.length - 1 ? '1em' : "none"}}>
                              {console.log("member", member)}
                              <div className="member_profile">
                                <img src={Profile} className="member_pic" alt="member_profile" />
                              </div>
                              <div className="member_detail" style={{ borderTop: index === 0 ? "1px solid #c9c9c7" : "none", borderBottom: index === conversation.members.length - 1 ? 'none' : "1px solid #c9c9c7" }}>
                                <div className="member_name">{member.user?.first_name}</div>
                                <div className="added_at">Joined At {moment(member.created_at).format('DD-MM-YYYY HH:MM a')}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="leave_group_container">
                        <div className="leave_group_btn_container">
                          <img src={Logout} alt="leave_group_icon" className="leave_group_icon" />
                          <div className="leave_group_btn_text">Exit Group</div>
                        </div>
                      </div>
                    </div>
                  : <div className="private_contact_info">
                      <div className="private_button_container">
                        <div className="private_button_block">
                          <div className="private_button">
                            <img src={Block} alt="block_icon" className="block_icon private_button_icon" />
                            <div className="btn_text">Block</div>
                          </div>
                        </div>
                        <div className="private_button_block">
                          <div className="private_button">
                            <img src={Trash} alt="delete_icon" className="delete_icon private_button_icon" />
                            <div className="btn_text">Delete Chat</div>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )

}

export default Message;