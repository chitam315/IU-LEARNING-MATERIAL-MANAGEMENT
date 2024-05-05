import React from "react";
import "./style.scss";
import { useAuth } from "../components/AuthContext";

import { useAsync } from "../hooks/useAsync";
import { useForm } from "../hooks/useForm";
import { minMax, regexp, required } from "../utils/validate";
import {Login} from "./login.jsx";
import { AdminIndex } from "./adminIndex";


function index() {
  const { user, login } = useAuth();
  const { execute: loginService, loading } = useAsync(login);
  const rules = {
    username: [required(), minMax(6)],
    password: [required(), minMax(6)],
  };

  const form = useForm(rules);
  const onLogin = (ev) => {
    ev.preventDefault();
    if (form.validate()) {
      loginService(form.values);
    }
  };

  if (user) {
    return <AdminIndex user={user}/>;
  } 

  return (
    <Login form={form} onLogin={onLogin} loading={loading}/>
  );
}

export default index;
