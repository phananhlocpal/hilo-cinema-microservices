import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Employees from './components/employees'
import Customers from './components/customers'
const Users = () => {
  let { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={path} component={Users} />
        <Route path={`${path}/customer`} component={Customers} />
        <Route path={`${path}/employee`} component={Employees} />
      </Switch>
    </div>
  );
};

export default Users;
