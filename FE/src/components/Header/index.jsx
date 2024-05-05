import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { PATH } from "../../config/PATH.JS";
// import { PATH } from "src/config/PATH.JS";
import {PATH} from "@/config/PATH.js"

// import Button from "../Button";
import "./style.scss";
import { useAuth } from "../AuthContext";
import { Button, Popover, Tag, Divider } from "antd";
import { AiOutlineUser } from "react-icons/ai";

import Notification from "../Notification/Notification";
import SearchFile from "../SearchFile/SearchFile";

function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth();
  const _logout = (ev) => {
    ev.preventDefault();
    logout();
  };

  const contentPopoverUser = (
    <div style={{ padding: '0px 10px', display: 'flex', flexDirection: 'column', gap: 15 }}>
      <Button type="dashed" onClick={() => navigate(PATH.user.changeInformation)}>Edit information</Button>
      <Button type="default" onClick={() => { navigate(PATH.user.changePassword)}}>Change password</Button>
      <Button danger type="dashed" onClick={_logout}>Log out</Button>
    </div>
  )
  if (user) {
    return (
      <header id="header">
        <div
          style={{
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            position: "absolute",
            top: 0,
            left: 20
          }}
        >
          {user && window.location.pathname == '/' && <SearchFile/>}
        </div>
        <NavLink to={PATH.index} >
          <img src="/img/logo.jpg" alt="" />
        </NavLink>
        <div className="right">
          {user && user?.role != 'admin' && <Notification/> }
          <Popover trigger='hover' content={contentPopoverUser} placement="bottom">
            <Tag style={{ fontSize: '15px', padding: 5, display: 'flex', gap: 10, fontWeight: 'bolder' }} bordered={false} color={user.role == 'student' ? 'processing' : 'success'} icon={<AiOutlineUser />}>{user.fullName}</Tag>
          </Popover>
        </div>
      </header>
    );
  }

  return (
    <header id="header">
      <NavLink to={PATH.index} >
        <img src="/img/logo.jpg" alt="" />
      </NavLink>
    </header>
  )

}

export default Header;
