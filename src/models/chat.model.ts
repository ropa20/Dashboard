import instance from "utils/axios.utils";

const ChatModel = {
  getAllUsers: () => {
    let promise = new Promise((resolve, reject)=>{
      let url = "chat/get_all_user_test";
      instance().post(url, {}).then(res=>{
        resolve(res.data)
      }).catch(error=>{
        if(error.response){
          reject(error.response.data.message)
        }else{
          reject(error)
        }
      })
    })
    return promise
  },

  getConversations: (data) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "chat/get_conversations";
      instance().post(url, data).then(res=>{
        resolve(res.data)
      }).catch(error=>{
        if(error.response){
          reject(error.response.data.message)
        }else{
          reject(error)
        }
      })
    })
    return promise
  },

  getMessages: (data) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "chat/get_messages";
      instance().post(url, data).then(res=>{
        resolve(res.data)
      }).catch(error=>{
        if(error.response){
          reject(error.response.data.message)
        }else{
          reject(error)
        }
      })
    })
    return promise
  }
};

export default ChatModel;