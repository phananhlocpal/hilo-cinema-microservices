import React from 'react'
import Rooms from './roomSeat'
import Ticket from './ticket'
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import InvoicePage from './Invoice/Index';
import SchedulePage from './Schedule/Index';

function Sales() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                {/* <Route exact path={path} component={Rooms} /> */}
                <Route path={`${path}/room`} component={Rooms} />
                <Route path={`${path}/schedule`} component={SchedulePage} />
                <Route path={`${path}/invoice`} component={InvoicePage} />
                {/* <Route path={`${path}/category`} component={Categories} />
      <Route path={`${path}/producer`} component={Producers} /> */}
                <Route path={`${path}/ticket`} component={Ticket} />
            </Switch>
        </div>
    )
}

export default Sales