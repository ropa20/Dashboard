import React from 'react';
import { Link } from 'react-router-dom';
import './table.component.scss';
import loader from 'assets/videos/loader.gif';
import Assets from 'imports/assets.import';
import NavButton from 'common_components/ui/nav_button/nav_button.ui';
import Divider from 'common_components/ui/divider/divider.ui';
import { getNestedObjectValue} from 'utils/functions.utils';
import moment from "moment";
import Functions from 'utils/functions.utils';

interface tableProps {
  data?: any;
  totalDocs?: number;
  loading?: boolean;
  theads: { head: string; key: string; width?: number, type?: string; isNested?: boolean }[];
  link: string;
  actions?: { icon: string; onClick: any, text?: string, textBackground?: string, hideIcon?: boolean }[];
  imageKey?: string;
  loadMore?: any;
}
export default function Table(props: tableProps) {
  const { theads, data, actions, loading, totalDocs = 0, imageKey = "", loadMore } = props;

  const driverStatus = (item: any, head: any) => {
    if (item[head.key] && item[head.key] === "active") {
      return <img src={Assets.active} />;
    } else if (item[head.key] && item[head.key] === "in_active") {
      return <img src={Assets.inactive} />;
    } else if (item[head.key] && item[head.key] === "in_break") {
      return <img src={Assets.break_icon} />;
    } else {
      return <img src={Assets.inactive} />;
    }
  };


  return (
    <div className="table_container">
      <div className="table_wrapper">
        <div className="table_head">
          <div className="table_row">
            {theads?.map(head => (
              <div style={{ width: head.width }} className="table_cell table_head_text">
                {head.head}
              </div>
            ))}
            <div className="table_cell"></div>
          </div>
        </div>
        <div className="table_body">
          {data?.map((item: any, index: number) => (
            <div className="table_row">
              {theads?.map((head, index) =>
                index === 0 ? (
                  <div className="table_cell">
                    <div className="table_cell_image_wrapper">
                      <div className="table_cell_image_container">
                        {/* <img
                          src={
                            item[imageKey] ||
                            'https://www.gstatic.com/webp/gallery/4.sm.jpg'
                          }
                          className="table_cell_image"
                        /> */}
                      </div>
                      <div className="body1">
                        {head.isNested ? (
                          getNestedObjectValue(item, head.key)
                        ) : head.type === "statuscheck" ? (
                          item[head.key] === "active" ? (
                            <img src={Assets.active} />
                          ) : item[head.key] === "in_active" ? (
                            <img src={Assets.inactive} />
                          ) : (
                            <img src={Assets.break_icon} />
                          )
                        ) : head.type === "date" ? (
                          moment(item[head.key]).format("DD-MM-YYYY, h:mma")
                        ) : (
                          item[head.key]
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="table_cell body1">
                    {head.isNested
                      ? getNestedObjectValue(item, head.key) ? getNestedObjectValue(item, head.key) : '---'
                      : // : !item[head.key] ? null
                      item[head.key] && head.type === "date"
                      ? moment(item[head.key]).format("DD-MM-YYYY, h:mma")
                      : item[head.key] && head.type === "datetime"
                      ? moment(item[head.key]).format("DD-MM-YYYY, h:mma")
                      : item[head.key] && head.type === "min"
                      ? Functions.timeConvert(item[head.key])
                      : item[head.key] && head.type === "statuscheck"
                      ? driverStatus(item, head)
                      : item[head.key]
                      ? item[head.key]
                      : "---"}
                  </div>
                )
              )}
              <div className="table_cell">
                <div className="action_wrapper">
                  {actions?.map(({ icon, onClick, text, textBackground, hideIcon }) => (
                    <div className="action_button_container">
                      <div className="action_btn_wrapper" onClick={() => onClick(item)}>
                        {!hideIcon && (
                          <div className={`action_btn`}>
                            <img src={Assets[icon]} width={25} height={25} alt="view" />
                          </div>
                        )}
                        {text && (
                          <div style={{ backgroundColor: textBackground }} className="action_btn_text">
                            {text}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {loading ? <div className="no_data_found">Loading</div> : data?.length === 0 && <div className="no_data_found">No data found</div>}
      {totalDocs > data?.length && data?.length ? (
        <div onClick={loadMore} className="load_more">
          Load More
        </div>
      ) : null}
    </div>
  );
}
