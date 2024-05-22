import axios from 'axios';
import { instance } from 'utils/axios.utils';
import { nanoid, Options } from 'utils/functions.utils';

export const fileUpload = (file: any, cb) => {
  const fileName = file.name;
  const fileNameArr = fileName.split('.');
  const fileExtension = fileNameArr[fileNameArr.length - 1];
  const newFileName = `${nanoid()}.${fileExtension}`;
  const response = new Promise((resolve, reject) => {
    if (file === null) {
      reject(new Error('No file selected.'));
    }
    const body = {
      file_name: newFileName,
      file_type: file.type,
    };
    instance()
      .post('auth/sign_s3', body)
      .then((res) => {
        console.log(res.data.signedRequest)
        axios
          .put(res.data.signedRequest, file, Options(cb))
          .then(() => {
            resolve(res.data.url);
          })
          .catch(() => {
            reject(new Error('Image upload failed'));
          });
      })
      .catch((err) => {
        reject(new Error('Could not get signed URL'));
      });
  });
  return response;
};
