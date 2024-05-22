import path from 'path/posix';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './history.component.scss';

interface historyProps {
  name?: string;
  path?: string;
}
export default function History(props: historyProps) {
  const { name, path } = props;
  const navigate = useNavigate();
  const pathArray = path ? path.split('/') : location.pathname.split('/');
  name && (pathArray[pathArray.length - 1] = name);
  return (
    <div className="view_dashboard_history_container">
      <div className="view_dashboard_history_wrapper">
        <div className="view_dashboard_back" onClick={() => navigate(-1)}>Back</div>
        {/* {pathArray.map(
          (path, index) =>
            path !== '' && (
              <div
                className="view_dashboard_history h5"
                onClick={() => {
                  navigate(-pathArray.length + index);
                }}>
                {path.charAt(0).toUpperCase() +
                  path.replace('_', ' ').substr(1)}
                {pathArray.length > index + 1 && (
                  <span className="gt_symbl">{'>'}</span>
                )}
              </div>
            ),
        )} */}
      </div>
    </div>
  );
}
