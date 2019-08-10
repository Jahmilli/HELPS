import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import StudentRegistrationPage from './studentRegistrationPage';

import Callback from './Callback';
import Auth from '../../logic/functions/core/Auth';

interface RoutingProps {
    auth: Auth;
}

const PrivateRoute = ({ component: Component, auth, ...rest }: any) => (
    <Route
        {...rest}
        render={(props) => auth.isAuthenticated() === true
          ? <Component auth={auth} {...props} />
          : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
      />
);

const Routing: React.FunctionComponent<RoutingProps> = ({auth}) => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact={true} render={() => <HomePage auth={auth} />} />
                <Route path="/login" render={() => <LoginPage auth={auth} />} />
                <Route path="/studentRegistration" render={() => <StudentRegistrationPage auth={auth} /> } />
                <Route path="/callback" render={() => <Callback auth={auth} />} />
                <PrivateRoute auth={auth} path="/home" component={HomePage} />
            </Switch>
        </Router>
    );
}

export default Routing;