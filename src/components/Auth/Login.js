import React from 'react';
import PropTypes from 'prop-types';

const Login = props => { // Login - функциональный компонент
  return (
    <div className='login-container'>
      <nav className='login'>
        <h2>Авторизация</h2>
        <p>Войдите с помощью Github для доступа к админке</p> {/* Обновленный текст */}
        {/* Убедитесь, что authenticate передается и является функцией */}
        <button className='github' onClick={() => props.authenticate()}>
          Войти через Github {/* Обновленный текст кнопки */}
        </button>
      </nav>
    </div>
  );
};

Login.propTypes = {
  authenticate: PropTypes.func.isRequired
};

export default Login;