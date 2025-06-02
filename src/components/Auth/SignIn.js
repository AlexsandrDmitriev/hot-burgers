import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import React from 'react'; // Импортируем React для React.Children.only

import Login from './Login';

// Функциональный компонент SignIn
function SignIn({ authenticate, logout, children }) { // Включаем все ожидаемые пропсы
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth); // Получаем состояние пользователя, загрузки и ошибки

  // Обработка ошибок аутентификации
  if (error) {
    console.error('Firebase Auth Error:', error);
    return <p>Authentication Error: {error.message}</p>; // Отображаем сообщение об ошибке
  }

  // Состояние загрузки (например, при первом чеке состояния аутентификации)
  if (loading) {
    return <p>Loading authentication state...</p>; // Показываем статус загрузки
  }

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    // Передаем authenticate пропсу Login компоненту
    return <Login authenticate={authenticate} />;
  }

  // Пользователь авторизован, рендерим обернутое содержимое (AppWrapper)
  // Используем React.Children.only, так как ожидается только один дочерний элемент
  return React.Children.only(children);
}

// propTypes (опционально для функциональных компонентов с React 18+, но полезно для документации и проверок)
// Если вы используете более старую версию React или хотите строгую проверку пропсов:
/*
SignIn.propTypes = {
  authenticate: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired, // Ожидаем любой узел React в качестве дочернего элемента
};
*/

export default SignIn; // Единственный экспорт по умолчанию