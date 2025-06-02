import React from 'react';
import PropTypes from 'prop-types';
import Loader from './Loader';
import { getDatabase, ref } from 'firebase/database'; // Импортируем функции Realtime Database
import { getAuth, GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Импортируем функции Auth
import { useAuthState } from 'react-firebase-hooks/auth'; // Импортируем useAuthState hook
import { useObject } from 'react-firebase-hooks/database'; // Импортируем useObject hook для данных

// Функциональный компонент AppWrapper
const AppWrapper = ({ children, match }) => { // Принимаем children и match из react-router
  const { restaurantId } = match.params;
  const auth = getAuth();
  const database = getDatabase();

  // Состояние аутентификации через useAuthState
  const [user, loadingAuth, errorAuth] = useAuthState(auth);

  // Состояние данных о бургерах через useObject
  // useObject возвращает snapshot, loading, error
  const [snapshot, loadingData, errorData] = useObject(ref(database, `${restaurantId}/burgers`));
  const burgers = snapshot ? snapshot.val() : null; // Извлекаем данные из snapshot

  // Методы аутентификации
  const authenticate = async () => {
    console.log('Authenticating...');
    const authProvider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, authProvider);
    } catch (error) {
      console.error('GitHub Auth Error:', error);
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  // Обработка состояний загрузки и ошибок
  if (loadingAuth || loadingData) {
    return <Loader />;
  }

  if (errorAuth || errorData) {
    console.error('Error loading data or auth state:', errorAuth || errorData);
    return <p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>;
  }

  // Когда данные загружены и нет ошибок, рендерим дочерний компонент
  // Передаем дочернему компоненту данные (burgers) и состояние аутентификации (user, authenticate, logout)
  // React.Children.only ожидает один дочерний элемент
  // Клонируем дочерний элемент, чтобы передать ему нужные пропсы
  // Убедимся, что burgers - это объект, даже если данные из Firebase null (пусто)
  const dataProps = {
    burgers: burgers || {}, // Передаем объект бургеров (пустой или с данными)
    user: user, // Передаем объект пользователя (или null)
    authenticate: authenticate, // Передаем функцию аутентификации
    logout: logout, // Передаем функцию выхода
    match: match // Также передаем match пропсы, если они нужны дочерним элементам
  };

  // Убеждаемся, что есть ровно один дочерний элемент и клонируем его с добавленными пропсами
  if (React.Children.count(children) !== 1) {
      console.error('AppWrapper expects exactly one child.', children);
      return <p>Component configuration error.</p>; // Или другой способ обработки ошибки
  }

  return React.cloneElement(React.Children.only(children), dataProps);
};

AppWrapper.propTypes = {
  children: PropTypes.element.isRequired, // AppWrapper ожидает ровно один React элемент как дочерний
  match: PropTypes.object.isRequired // match пропс от react-router
};

export default AppWrapper;