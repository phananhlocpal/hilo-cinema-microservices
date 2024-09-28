import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Movies from '../components/movie'
import Theaters from '../components/theater'
import Actors from './actor';
import Rooms from '../../sales/roomSeat';
const Stock = () => {
  let { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={path} component={Movies} />
        <Route path={`${path}/movie`} component={Movies} />
        <Route path={`${path}/theater`} component={Theaters} />
        {/* <Route path={`${path}/category`} component={Categories} />
        <Route path={`${path}/producer`} component={Producers} /> */}
        <Route path={`${path}/actor`} component={Actors} />
        <Route path={`${path}/room`} component={Rooms}></Route>
      </Switch>
    </div>
  );
};

export default Stock;
