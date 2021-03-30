import {
  DesktopOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// const { SubMenu } = Menu;

export default class Nav extends Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div style={{ width: 256 }}>
        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="todo" icon={<PieChartOutlined />}>
            <Link to="/todo">Todo</Link>
          </Menu.Item>
          <Menu.Item key="search" icon={<DesktopOutlined />}>
            <Link to="/search">Search</Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
