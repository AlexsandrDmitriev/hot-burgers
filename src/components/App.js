import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import MenuAdmin from './MenuAdmin';
import Burger from './Burger';
import sampleBurgers from '../sample-burgers';
import { getDatabase, ref, set, remove } from 'firebase/database'; // Импортируем нужные функции Firebase


class App extends React.Component {
  state = {
    // state is now managed by AppWrapper for burgers, and SignIn for user auth state
  };

  static propTypes = {
    match: PropTypes.object.isRequired,
    user: PropTypes.object,
    authenticate: PropTypes.func,
    // !!! ВАЖНОЕ ИЗМЕНЕНИЕ !!!
    // Делаем logout необязательным в propTypes App
    logout: PropTypes.func, // Убрано .isRequired
    burgers: PropTypes.object, // Убрано .isRequired
  };

  // Методы управления бургерами, взаимодействующие с Firebase
  addBurger = (burger) => {
    console.log("addBurger called in App", burger);
    const database = getDatabase();
    const { restaurantId } = this.props.match.params;
    // Генерируем уникальный ключ для нового бургера
    const newBurgerKey = `burger${Date.now()}`;
    // Устанавливаем данные нового бургера в Firebase по сгенерированному ключу
    set(ref(database, `${restaurantId}/burgers/${newBurgerKey}`), burger)
      .then(() => {
        console.log("Burger successfully added to Firebase!");
      })
      .catch((error) => {
        console.error("Error adding burger to Firebase:", error);
      });
  };

  updateBurger = (key, updatedBurger) => {
    console.log("updateBurger called in App", key, updatedBurger);
    const database = getDatabase();
    const { restaurantId } = this.props.match.params;
    // Обновляем данные существующего бургера в Firebase по его ключу
    set(ref(database, `${restaurantId}/burgers/${key}`), updatedBurger)
      .then(() => {
        console.log("Urger has been successfully updated in Firebase!");
      })
      .catch((error) => {
        console.error("Error updating burger in Firebase:", error);
      });
  };

  deleteBurger = (key) => {
    console.log("deleteBurger called in App", key);
    const database = getDatabase();
    const { restaurantId } = this.props.match.params;
    // Удаляем бургер из Firebase по его ключу
    remove(ref(database, `${restaurantId}/burgers/${key}`))
      .then(() => {
        console.log("Burger successfully removed from Firebase!");
      })
      .catch((error) => {
        console.error("Error deleting burger from Firebase:", error);
      });
  };

  loadSampleBurgers = () => {
    console.log("loadSampleBurgers called in App");
    const database = getDatabase();
    const { restaurantId } = this.props.match.params;
    // Устанавливаем тестовые бургеры в Firebase
    set(ref(database, `${restaurantId}/burgers`), sampleBurgers)
      .then(() => {
        console.log("Test burgers successfully uploaded to Firebase!");
      })
      .catch((error) => {
        console.error("Error uploading test burgers to Firebase:", error);
      });
  };


  render() {
    const { user, logout, burgers } = this.props;
    const { restaurantId } = this.props.match.params;

    // Ensure burgers is an object, even if coming from AppWrapper as undefined/null
    // (Хотя AppWrapper теперь должен гарантировать, что это объект, оставляем для надежности)
    const burgersData = burgers || {};

    const hasBurgers = typeof burgersData === 'object' && Object.keys(burgersData).length > 0;

    
    return (
      <div className='burger-paradise admin-layout'>
        {/* Левая колонка: Меню бургеров */}
        <div className='menu'>
          <Header title={restaurantId} />
          <ul className='burgers'>
            {hasBurgers ? (
              Object.keys(burgersData).map(key => { // Используем burgersData
                 const burger = burgersData[key]; // Используем burgersData
                 if (burger) {
                   return (
                     <Burger
                       key={key}
                       index={key}
                       details={burger}
                       // Здесь не передаем addToOrder
                     />
                   );
                 }
                 return null;
               })
            ) : (
               <p>Loading menu or menu is empty...</p>
            )}
          </ul>
        </div>

        {/* Правая колонка: Панель администратора и кнопка выхода */}
        <div className='admin-panel-container'> {/* Новый контейнер для всей правой части */}
           {/* Кнопка выхода, размещаем ее вверху */}
           {user && logout && (
             <button className='logout-button' onClick={logout}>Logout from admin panel</button>
           )}
           <div className='admin-panel-content'>
             <MenuAdmin
               burgers={burgersData} // Передаем burgersData (объект)
               addBurger={this.addBurger}
               updateBurger={this.updateBurger}
               deleteBurger={this.deleteBurger}
               loadSampleBurgers={this.loadSampleBurgers}
               restaurantId={restaurantId}
               user={user}
             />
           </div>
        </div>

      </div>
    );
  }
}

export default App;