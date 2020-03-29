import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Layout, Drawer } from "antd";
import { List, Avatar, Input, Button } from "antd";

import Userlist from "./components/UserLilst";
import SideMenu from "./components/SideMenu";

import socketio from "socket.io-client";

import hal9000 from "./images/hal_9000.png";

const { Header, Content, Footer, Sider } = Layout;
const { TextArea } = Input;
const data = [
  {
    title: "Ant Design Title 1"
  },
  {
    title: "Ant Design Title 2"
  },
  {
    title: "Ant Design Title 3"
  },
  {
    title: "Ant Design Title 4"
  }
];
function App() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("pippo");
  const [ws, setWs] = useState({});
  const initSockeIO = useCallback(() => {
    console.log("in useEffect()");
    const socket = socketio("http://127.0.0.1:31337");
    socket.on("message", data => {
      console.log(data);
      setMessages(prevState => [...prevState, { ...data, kind: "user" }]);
    });
    socket.on("system-message", data => {
      console.log("MESSAGGIO DI SISTEMA: ", data);
      setMessages(prevState => [...prevState, { ...data, kind: "system" }]);
    });
    setWs(socket);
  });

  useEffect(initSockeIO, []);

  useEffect(() => {
    console.log("MESSAGES: ", messages);
  }, [messages]);

  useEffect(() => {
    console.log("NEW MESSAGE: ", newMessage);
  }, [newMessage]);

  return (
    <div className="App">
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" />
          <SideMenu />
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Drawer
                title="Basic Drawer"
                placement="right"
                closable={true}
                onClose={() => {
                  setDrawerVisible(false);
                }}
                visible={drawerVisible}
                getContainer={false}
                style={{ position: "absolute" }}
              >
                <Userlist></Userlist>
              </Drawer>
              <Button
                type="primary"
                onClick={() => {
                  setDrawerVisible(true);
                }}
              >
                Show Users
              </Button>
              <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        item.kind === "system" ? (
                          <Avatar src={hal9000} />
                        ) : (
                          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        )
                      }
                      title={item.sender}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
              <TextArea
                rows={4}
                value={newMessage}
                onChange={evt => {
                  setNewMessage(() => evt.target.value);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  console.log("ONCLICK", ws);
                  ws.emit("message", { sender: "pippo", content: newMessage });
                }}
              >
                Invia
              </Button>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
