import { useState } from 'react';
import { Layout as AntLayout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  ExperimentOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = AntLayout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/settings', icon: <SettingOutlined />, label: '设置' },
  { key: '/lab', icon: <ExperimentOutlined />, label: '实验室' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0, bottom: 0, zIndex: 100 }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: '#fff',
          fontSize: collapsed ? 20 : 14,
          fontWeight: 700,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          <VideoCameraOutlined style={{ fontSize: 20, flexShrink: 0 }} />
          {!collapsed && 'LocalViralCast'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ marginTop: 8 }}
        />
      </Sider>
      <AntLayout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Content style={{
          margin: 24,
          padding: 24,
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          minHeight: 'calc(100vh - 48px)',
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
