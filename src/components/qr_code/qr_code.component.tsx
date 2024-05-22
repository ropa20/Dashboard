import Assets from "imports/assets.import";
import React, { forwardRef } from "react";
import { QRCode } from "react-qrcode-logo";
import "./qr_code.component.scss";

interface IQRPopup {
  text: string;
}

const QRCodeComponent = forwardRef((props: IQRPopup, ref: any) => {
  return (
    <div className="qr_code_container" ref={ref}>
      <div className="qr_code_wrapper">
        <QRCode
          bgColor="#FFFFFF"
          //   fgColor={'white'}
          ecLevel="L"
          size={320}
          style={{ width: 256 }}
          // logoImage={Assets.fullfily_logo}
          // logoWidth={80}
          // logoHeight={80}
          logoOpacity={1}
          value={props.text}
          qrStyle={"squares"}
          eyeRadius={[
            {
              outer: [10, 10, 0, 10],
              inner: [0, 10, 10, 10],
            },
            [10, 10, 10, 0],
            [10, 0, 10, 10],
          ]}
        />
      </div>
    </div>
  );
});
export default QRCodeComponent;
