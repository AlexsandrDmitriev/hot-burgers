import React from 'react';
import PropTypes from 'prop-types';
import AddBurgerForm from './AddBurgerForm';
import EditBurgerForm from './EditBurgerForm';

class MenuAdmin extends React.Component {
  state = {
    photo: '',
    user: ''
  };

  static propTypes = {
    burgers: PropTypes.object.isRequired, // Ожидаем объект
    addBurger: PropTypes.func,
    updateBurger: PropTypes.func,
    deleteBurger: PropTypes.func,
    loadSampleBurgers: PropTypes.func,
    // Возможно, restaurantId и user также нужны как пропсы для прав доступа
    restaurantId: PropTypes.string,
    user: PropTypes.object,
  };

  componentDidMount() {
    //firebase.auth().onAuthStateChanged(user => {
    //  if (user) {
    //    this.authHandler({ user });
    //  }
    //});
  }

  authHandler = async authData => {
    const { email, photoURL } = authData.user;
    this.setState({ user: email, photo: photoURL });
  };

  render() {
    // !!! ВАЖНОЕ ИЗМЕНЕНИЕ !!!
    // Добавляем проверку: если this.props.burgers undefined или null, используем пустой объект {}
    // Это предотвратит ошибку Object.keys() на undefined/null
    const burgers = this.props.burgers || {};
    const { user, photo } = this.state;
    const avatar = photo ? photo : '/images/avatar.png';
    return (
      <div className='menu-admin'>
        <h2>Menu management</h2>

        {/* Добавляем проверку, что burgers является объектом перед маппингом */}
        {typeof burgers === 'object' && Object.keys(burgers).map(key => {
          // Проверяем, что бургер не null (на случай удаления в Firebase)
          const burger = burgers[key];
          if (burger) {
            return (
              <EditBurgerForm
                key={key}
                index={key}
                burger={burger}
                updateBurger={this.props.updateBurger}
                deleteBurger={this.props.deleteBurger}
              />
            );
          }
          return null; // Пропускаем null элементы
        })}


        {/* AddBurgerForm и кнопка loadSampleBurgers */}
        {/* Передаем соответствующие методы управления бургерами как пропсы */}
        <AddBurgerForm addBurger={this.props.addBurger} />
        {/* Условное отображение кнопки загрузки тестовых бургеров,
            возможно, только если нет данных или пользователь админ.
            Сейчас просто отображаем, если передан пропс loadSampleBurgers.
        */}
        {this.props.loadSampleBurgers && (
           <button onClick={this.props.loadSampleBurgers}>
             Upload test burgers
           </button>
        )}

      </div>
    );
  }
}

export default MenuAdmin;
