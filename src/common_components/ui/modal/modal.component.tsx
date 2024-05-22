import React from 'react';
import Modal from 'react-responsive-modal';
import './modal.component.scss';
import 'react-responsive-modal/styles.css';
import ActionButton from 'common_components/ui/action_button/action_button.ui';

const CustomModal = (props: any) => {
  const { open, onClose, children, ...restProps } = props;
  return (
    <div className="custom_modal_container">
      <Modal
        open={open}
        onClose={() => onClose(false)}
        classNames={{ modal: 'custom_modal' }}
        closeIcon={<ActionButton icon="close" positon="top-right" animation />}
        {...restProps}>
        {children}
      </Modal>
    </div>
  );
};

export default CustomModal;
