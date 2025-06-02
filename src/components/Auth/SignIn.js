import React from 'react';
import PropTypes from 'prop-types';
// Убедимся, что импорт firebase/app присутствует, если он нужен
// import firebase from 'firebase/app'; // Если firebase.auth() используется, убедиться, что это именованный импорт
import { getAuth, GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Импортируем getAuth, провайдера, signInWithPopup и signOut
import { useAuthState } from 'react-firebase-hooks/auth'; // Импортируем useAuthState
import { getApp } from 'firebase/app'; // Возможно, понадобится getApp для получения инстанса приложения

class SignIn extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired, // SignIn ожидает один дочерний элемент
  };

  // Используем useAuthState для получения состояния пользователя
  // Нельзя использовать хуки в классовых компонентах напрямую.
  // Придется либо получать user через контекст, либо передавать его пропсом
  // или сделать SignIn функциональным компонентом.
  // Поскольку AppWrapper уже получает user через пропсы от SignIn,
  // и SignIn оборачивает AppWrapper (который оборачивает children),
  // мы можем получать user и authenticate/logout как пропсы в дочерних элементах (AppWrapper -> App).

  authenticate = async () => {
    try {
      // Получаем инстанс Firebase Auth
      const auth = getAuth(getApp()); // Получаем инстанс auth, используя инстанс Firebase App
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // После успешной аутентификации useAuthState в родительском компоненте
      // (AppWrapper, который получает user от useAuthState, если он был функциональным,
      // или AppWrapper, получающий user от SignIn, если SignIn управляет auth state)
      // обновит состояние и передаст пользователя вниз.
    } catch (error) {
      console.error('GitHub authentication error:', error);
      // Обработка ошибок аутентификации
      // Например, можно показать сообщение пользователю
    }
  };

  // Метод для выхода
  logout = async () => {
    try {
      const auth = getAuth(getApp());
      await signOut(auth);
      // После успешного выхода useAuthState обновит состояние
    } catch (error) {
      console.error('Exit error:', error);
    }
  };


  render() {
    // user и loading/error теперь должны приходить как пропсы в AppWrapper,
    // если AppWrapper использует useAuthState, или если SignIn их предоставляет.
    // Если SignIn является классовым и не использует хуки,
    // нам нужно получать user другим способом (например, через onAuthStateChanged)
    // и передавать его в state SignIn, а затем передавать этот state вниз.

    // Давайте предположим, что SignIn является источником состояния аутентификации
    // и будет передавать user, authenticate и logout своим дочерним элементам.
    // Для этого нам нужно будет использовать state в SignIn или переделать его в функциональный компонент с useAuthState.

    // Для простоты и чтобы соответствовать предыдущему flow, где SignIn передавал authenticate,
    // давайте добавим состояние user в SignIn, используя слушателя onAuthStateChanged,
    // или, что проще, переделаем SignIn в функциональный компонент с useAuthState.

    // Переделаем SignIn в функциональный компонент для использования useAuthState
    const { children } = this.props; // Получаем children как пропс


    // Поскольку мы переделаем SignIn в функциональный компонент ниже,
    // этот render метод классового компонента будет заменен.
    // Для классового компонента, если мы не используем useAuthState,
    // нам нужно вручную слушать onAuthStateChanged.

     // ... Код рендеринга для классового компонента, который будет заменен ...
     // Этот код не будет выполняться после переделки в функциональный компонент
    return null; // Заглушка
  }
}

// === Переделываем SignIn в функциональный компонент с useAuthState ===
function SignInFunctional({ children }) {
   const auth = getAuth(getApp()); // Получаем инстанс auth
   const [user, loading, error] = useAuthState(auth); // Используем хук для получения состояния аутентификации

   // Функция аутентификации
   const authenticate = async () => {
     try {
       const provider = new GithubAuthProvider();
       await signInWithPopup(auth, provider);
     } catch (error) {
       console.error('GitHub authentication error:', error);
     }
   };

   // Функция выхода
   const logout = async () => {
     try {
       await signOut(auth);
     } catch (error) {
       console.error('Exit error:', error);
     }
   };

   // Если пользователь авторизован, рендерим дочерний элемент (AppWrapper)
   // и передаем ему user, authenticate и logout
   if (user) {
     // Клонируем дочерний элемент и добавляем пропсы
     return React.cloneElement(React.Children.only(children), {
       user: user,
       authenticate: authenticate,
       logout: logout // Передаем функцию выхода
     });
   }

   // Если пользователь не авторизован и не загружается, отображаем форму входа
   // Если loading true, можно отобразить Loader, но AppWrapper уже имеет Loader.
   // Поэтому SignIn просто рендерит свою форму входа, когда user === null
   // AppWrapper внутри будет обрабатывать состояние загрузки данных бургеров.

   // Проверяем, есть ли ошибки при загрузке состояния аутентификации
   if (error) {
     console.error("Error loading authentication state:", error);
     return <div>Error loading authentication state.</div>;
   }


   // Если не авторизован и нет ошибок, отображаем форму входа
   return (
     <div className='login'>
       <h2>Authorization</h2>
       <p>Enter your Github account login and password</p>
       <button onClick={authenticate} className='github'>
       Login via Github
       </button>
     </div>
   );
}

SignInFunctional.propTypes = {
  children: PropTypes.element.isRequired, // SignInFunctional ожидает один дочерний элемент
};


// Экспортируем функциональный компонент
export default SignInFunctional;