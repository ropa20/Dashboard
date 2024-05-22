import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import { useSetState } from 'utils/functions.utils';
import Assets from 'imports/assets.import';
import './check_box.scss';

interface ICheckBoxProps {
    onPress?: any;
    checked?: boolean;
    selected?: any;
    multiple?: boolean;
}

const CheckBox = (props: ICheckBoxProps) => {
    // Redux
    const testState = useSelector((state: any) => state.test);

    // State
    const [state, setState] = useSetState({ checked: false });

    //Hooks
    useEffect(() => { }, []);

    // Network req
    const testReq = async () => { };

    //Logic
    const testLogic = () => { };

    return (
        <div>
            <div className="checked_icon_wrapper">
                {props.checked ? (
                    <img
                        src={Assets.checked}
                        height={20}
                        width={20}
                        className="checked-icon"
                        alt=""
                    />
                ) : (
                    <img
                        src={Assets.uncheck}
                        height={20}
                        width={20}
                        className="checked-icon"
                        alt=""
                    />
                )}
            </div>
            {/* // ) : (
      //   <div className="checkbox"></div>
      // )} */}
        </div>
    );
};

export default CheckBox;