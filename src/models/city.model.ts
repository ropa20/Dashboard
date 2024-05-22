import instance from "utils/axios.utils";

const city = {
  createCity: (data) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "city/create_city";
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

  getManyCity: (data:any) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "city/get_many_city";
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

  getCity: (data:any) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "city/get_city";
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

  getCityWithoutPagination: (body:any) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "city/get_all_cities";
      instance().post(url,body).then(res=>{
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

  editCity: (data:any) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "city/edit_city";
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
  deleteCity: (data:any) => {
    let promise = new Promise((resolve, reject)=>{
      let url = "city/delete_city";
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
};

export default city;