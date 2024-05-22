import React from 'react';
import { fileUpload } from 'utils/s3';
import Button from '../button/button.ui';
import './upload_button.ui.scss';

interface uploadButtonProps {
  onChange: any;
  name: string;
  loading?: boolean;
  buttonLabel: string;
  isMultiple?: boolean;
  className?: string;
  accept?: string;
}

const UploadButton = (props: uploadButtonProps) => {
  const { onChange, className, name, loading, buttonLabel, isMultiple, accept } = props;
  const handleFileUpload = async (e) => {
    try {
      const cb = (value) => {
        console.log(value);
      };
      const url = await fileUpload(e.target.files[0], cb);
      onChange(url);
    } catch (err) {
      console.log('Error', err);
    }
  };
  return (
    <div className={`upload_button_container ${className}`}>
      <div className="upload_button_wrap">
        <>
          <input
            className="upload_button_input"
            type="file"
            onChange={handleFileUpload}
            name={name}
            multiple={isMultiple}
            accept={accept || "application/pdf,image/png,image/jpg"}
          />
          <Button value={buttonLabel} loading={loading} />
        </>
      </div>
    </div>
  );
};

UploadButton.defaultProps = {
  isMultiple: false,
  loading: false,
  className: '',
};

export default UploadButton;
