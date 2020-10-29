import React from 'react';
import PropTypes from 'prop-types';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';

class ViewIcon extends React.Component {
  render() {
    const { color = 'primary', type, size, ...props } = this.props;
    let buttonSize = 'default';

    if (size === 'sm') {
      buttonSize = 'small';
    } else if (size === 'lg') {
      buttonSize = 'large';
    }

    return <Button type={color} htmlType={type} size={buttonSize} icon={<EyeOutlined />} shape="circle" {...props} />;
  }
}

ViewIcon.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string
};

export default ViewIcon;
