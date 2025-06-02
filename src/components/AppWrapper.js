import React from 'react';
import { useParams } from 'react-router-dom';
import { useObject } from 'react-firebase-hooks/database';
import { getDatabase, ref } from 'firebase/database';
import Loader from './Loader';
import PropTypes from 'prop-types';

function AppWrapper({ children, user, authenticate, ...rest }) {
  const { restaurantId } = useParams();
  const database = getDatabase();
  // useObject will initially return [undefined, true, undefined]
  const [burgersSnapshot, loading, error] = useObject(
    ref(database, `${restaurantId}/burgers`)
  );

  // AppWrapper все еще принимает user и authenticate как пропсы,
  // так как он оборачивается в SignIn на админ-маршруте,
  // и эти пропсы нужно передать в дочерний элемент (App)
  //const { user, authenticate } = props;

  // Определяем значение для пропса burgers, которое всегда будет объектом
  // Если загрузка завершена и есть данные (которые являются объектом), используем их.
  // В противном случае (во время загрузки, при ошибке, или если данных нет/они не объект), используем пустой объект {}.
  let burgersToPass = {};
  if (!loading && !error && burgersSnapshot && burgersSnapshot.val() !== null && typeof burgersSnapshot.val() === 'object') {
    burgersToPass = burgersSnapshot.val();
  }


  // --- Обработка состояний ---

  if (error) {
    console.error("Ошибка загрузки бургеров из Firebase:", error);
    return <div>Error loading data. Please try again later.</div>;
  }

  if (loading) {
    // While loading, render the Loader.
    // Pass burgersToPass (which is {}) to Loader as well for consistency, though Loader might not use it.
     return <Loader user={user} authenticate={authenticate} burgers={burgersToPass} {...rest} />;
  }

  // If loading is complete and there's no error, clone and render the child element.
  // Pass the burgers data (burgersToPass, which now contains loaded data or {})
  const childElement = React.Children.only(children);

  const elementToReturn = React.cloneElement(childElement, {
     burgers: burgersToPass, // Pass burgers (guaranteed to be an object)
     user: user,
     authenticate: authenticate,
     logout: rest.logout, // Explicitly pass logout from rest props if it exists
     ...rest // Pass other props (like match)
  });

  return elementToReturn;
}

AppWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
  authenticate: PropTypes.func,
  // logout might come as a prop if AppWrapper is wrapped by SignIn
  logout: PropTypes.func, // Keep logout as optional in AppWrapper's propTypes
};

export default AppWrapper;