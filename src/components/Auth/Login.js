import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {
  static propTypes = {
    authenticate: PropTypes.func.isRequired // authenticate ожидается как обязательная функция-пропс
  };

  // Исправляем: используем стрелочную функцию для автоматической привязки 'this'
  authenticate = () => {
    this.props.authenticate(); // Теперь this.props будет доступен
  };

  render() {
    return (
      <div className='login-container'>
        <nav className='login'>
          <h2>Авторизация</h2>
          <p>Войдите с помощью Github для доступа к админке</p> {/* Обновленный текст */}
          {/* Убедитесь, что authenticate передается и является функцией */}
          <button className='github' onClick={this.authenticate}> {/* Используем привязанный метод */}
            Войти через Github {/* Обновленный текст кнопки */}
          </button>
        </nav>
      </div>
    );
  }
}

export default Login;