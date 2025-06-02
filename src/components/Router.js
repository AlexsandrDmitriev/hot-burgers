import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './Landing';
import NotFound from './NotFound';
import SignIn from './Auth/SignIn'; // SignIn нужен для админ-маршрута
import AppWrapper from './AppWrapper'; // AppWrapper нужен для обоих маршрутов
import RestaurantView from './RestaurantView'; // RestaurantView для публичного маршрута
import App from './App'; // App для админ-маршрута (теперь это админ-компонент)


const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Landing} />

      {/* Админ-маршрут ресторана */}
            <Route
         path='/restaurant/:restaurantId/admin'
         // Используем render prop для SignIn, который оборачивает AppWrapper,
         // который оборачивает App (наш админ-компонент)
         render={(props) => (
           <SignIn>
             <AppWrapper {...props}>
               <App {...props} />
             </AppWrapper>
           </SignIn>
         )}
      />

      {/* Публичный маршрут ресторана */}
      <Route
         path='/restaurant/:restaurantId'
         // Используем render prop для передачи AppWrapper как родителя RestaurantView
         render={(props) => (
           <AppWrapper {...props}>
             <RestaurantView {...props} />
           </AppWrapper>
         )}
       />

      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;