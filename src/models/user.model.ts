import instance from 'utils/axios.utils';
import Functions from 'utils/functions.utils';

const auth = {
  loginUser: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post('auth/user_login', body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  createUser: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post('auth/user_signup', body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getUserList: (body: any) => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post('auth/user_list', body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getUser: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = 'auth/view_user';
      instance()
        .get(url, { params: body })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  editUser: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = `auth/edit_user`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  deleteUser: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = `auth/delete_user`;
      instance()
        .post(url, body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  logoutUser: () => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post('auth/logout')
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  dashboard: (body:any) => {
    let promise = new Promise((resolve, reject) => {
      instance()
        .post('auth/dashboard',body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getAllUser: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = 'auth/get_all_users';
      instance()
        .post(url,body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  forgotPassword: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = 'auth/forget_password';
      instance()
        .post(url,body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  resetPassword: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = 'auth/reset_password';
      instance()
        .post(url,body)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  
};

export default auth;
