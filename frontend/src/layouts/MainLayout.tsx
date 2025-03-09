import {
  CloudOutlined,
  CreditCardOutlined,
  ProfileOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const menuItems = [
  { icon: <ProfileOutlined />, label: "Faturalar", to: "/invoices" },
  {
    icon: <CreditCardOutlined />,
    label: "Ödeme Yöntemleri",
    to: "/payment-methods",
  },
  { icon: <CloudOutlined />, label: "Hizmetler", to: "/services" },
  { icon: <SettingOutlined />, label: "Ayarlar", to: "/settings" },
];

export default function MainLayout() {
  const location = useLocation();
  const [title, setTitle] = useState(menuItems[0].label);

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.to === location.pathname);
    setTitle(currentItem ? currentItem.label : "Invoices");
  }, [location]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible theme="light" style={{ padding: "1em 0" }}>
        <Menu
          theme="light"
          mode="inline"
          items={menuItems.map((item) => ({
            key: item.to,
            icon: item.icon,
            label: <Link to={item.to}>{item.label}</Link>,
          }))}
          selectedKeys={[location.pathname]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", padding: "2em", height: "auto" }}>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
        </Header>
        <Content style={{ margin: "1em", padding: "1em" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
