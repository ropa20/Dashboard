import Assets from 'imports/assets.import';
import React from 'react';
import { Link } from 'react-router-dom';
import './nav_button.ui.scss'

interface navButtonProps {
  icon: string;
  link: string;
}
export default function NavButton(props: navButtonProps) {
  const { link, icon } = props;
  return (
    <div>
      <Link to={link} className="action_btn_wrapper">
        <div className={`action_btn`}>
          <img src={Assets[icon]} width={25} height={25} alt="view" />
        </div>
      </Link>
    </div>
  );
}
