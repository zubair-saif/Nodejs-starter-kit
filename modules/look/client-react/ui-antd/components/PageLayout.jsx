import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { ArrowUpOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, BackTop, Button, Tooltip } from 'antd';
import { enquireScreen } from 'enquire-js';

import NavBar from './NavBar';
import Footer from './Footer';

import styles from '../styles/index.less';

const layoutTypes = [
  {
    type: null,
    outerClassName: 'content-layout',
    innerClassName: null
  },
  {
    type: 'home',
    outerClassName: 'home-content-layout',
    innerClassName: null
  },
  {
    type: 'forms',
    outerClassName: 'form-layout-outer',
    innerClassName: 'form-content-layout'
  }
];

const { Content } = Layout;
let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class PageLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '/',
      isMobile,
      show: true //!location.port, ToDo - find a better approach this
    };
  }

  componentDidMount() {
    // 适配手机屏幕;
    enquireScreen(b => {
      this.setState({ isMobile: !!b });
    });
    // ToDo - find a better approach for below statement
    // if (true) {

    setTimeout(() => {
      this.setState({
        show: true
      });
    }, 500);
    // }
  }
  render() {
    const { children, navBar, type } = this.props;
    const contentStyle = layoutTypes.filter(item => item.type === type);

    const renderContent = () => {
      return (
        <Content
          id="content"
          className={(contentStyle.length !== 0 && contentStyle[0].outerClassName) || 'content-layout'}
        >
          {children}
        </Content>
      );
    };
    return (
      <Layout id="page-layout" className="hideOverflow">
        {navBar !== false && <NavBar isMobile={this.state.isMobile} />}
        {__SERVER__ && __DEV__ && (
          <Helmet>
            <style type="text/css">{styles._getCss()}</style>
          </Helmet>
        )}
        {renderContent()}
        <Tooltip title="Install app" placement="right">
          <Button
            shape="circle"
            id="install-button"
            // style={{ display: 'none' }}
            size="large"
            type="primary"
            icon={<PlusOutlined />}
          />
        </Tooltip>
        <BackTop>
          <Tooltip placement="left" title="Back to Top" autoAdjustOverflow={true}>
            <Button icon={<ArrowUpOutlined />} type="primary" shape="circle" size="large" />
          </Tooltip>
        </BackTop>
        <Footer />
      </Layout>
    );
  }
}

PageLayout.propTypes = {
  children: PropTypes.node,
  navBar: PropTypes.bool,
  type: PropTypes.string
};

export default PageLayout;
