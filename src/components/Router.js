import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './Landing';
import NotFound from './NotFound';
import SignIn from './Auth/SignIn';
import AppWrapper from './AppWrapper';
import RestaurantView from './RestaurantView';
import App from './App'; // Импортируем компонент App

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />

        <Route exact path="/restaurant/:restaurantId" render={props => 
          <AppWrapper {...props}>
            <RestaurantView {...props} />
          </AppWrapper>
        } />

        <Route path="/restaurant/:restaurantId/admin" render={props => {
          return (
            <SignIn>
              <AppWrapper {...props}>
                <App {...props} />
              </AppWrapper>
            </SignIn>
          );
        }} />

        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;