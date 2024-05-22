import Assets from 'imports/assets.import';
import React from 'react';
import { checkIfValidImage, filenameFromURL, useSetState } from 'utils/functions.utils';
import { fileUpload } from 'utils/s3';
import CustomModal from '../modal/modal.component';
import './file_upload.ui.scss';

interface fileUploadProps {
  label: string;
  handleView?: any;
  name: string;
  onChange: any;
  multiple?: boolean;
  url: string;
}
export default function FileUpload(props: fileUploadProps) {
  const { label, name, onChange, multiple = false, url } = props;
  const [state, setState] = useSetState({
    view: false,
    fileName: '',
  });
  const handleFileUpload = async (e) => {
    try {
      const cb = (value) => {
        console.log(value);
      };
      setState({ fileName: e.target.files[0].name });
      const url = await fileUpload(e.target.files[0], cb);
      onChange(url);
    } catch (err) {
      console.log('Error', err);
    }
  };

  const handleView = () => {
    setState({ view: !state.view });
  };
  return (
    <div className="file_upload_container">
      <div className="file_upload_wrapper">
        <div className="label_container">
          <div className="label caption2">{label}</div>
        </div>
        <div className="file_upload_input_container">
          <div className="file_upload_input_wrapper">
            <div className="file_upload_input_left_container">
              <div className="file_upload_logo_container">
                <img src={checkIfValidImage(url) ? url : Assets.image} alt="" className="file_upload_logo" />
              </div>
              <div className="file_upload_button_container">
                <input
                  className="upload_button_input"
                  type="file"
                  onChange={handleFileUpload}
                  name={name}
                  multiple={multiple}
                  accept="application/pdf,image/png,image/jpg"
                />
                <button className="file_upload_button">Choose file</button>
              </div>
              <div className="file_upload_message_container">
                <div className="file_upload_message caption2">
                  {state.fileName
                    ? state.fileName
                    : 'Only PDF, JPG, PNG file supported'}
                </div>
              </div>
            </div>
            <div className="file_upload_input_right_container">
              <div className="file_upload_view_container">
                <div className="action_button_container">
                  {
                    url && checkIfValidImage(url) ?
                    <div className="action_btn_wrapper" onClick={handleView}>
                      <div className={`action_btn`}>
                        <img
                          src={Assets.view}
                          width={18}
                          height={18}
                          alt="view"
                        />
                      </div>
                    </div>
                    : url ?
                    <a href={url} download={filenameFromURL(url)}>
                      <div className="action_btn_wrapper">
                        <div className={`action_btn`}>
                          <img
                            src={Assets.download}
                            width={18}
                            height={18}
                            alt="view"
                          />
                        </div>
                      </div>
                    </a>
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomModal open={state.view} onClose={handleView}>
        {url ? (
          <div className="view_file_container">
            <img src={url} alt="upload image" className="view_file" />
          </div>
        ) : (
          <div className="view_file_error_container">
            <div className="view_file_error">No file chosen</div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
