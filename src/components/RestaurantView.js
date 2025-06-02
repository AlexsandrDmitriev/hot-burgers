import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Order from './Order';
import Burger from './Burger';

// Классовый компонент для публичного вида ресторана
class RestaurantView extends React.Component {
  // Определение начального состояния для корзины
  state = {
    order: {}
  };

  // Методы для управления корзиной
  addToOrder = (key) => {
    // 1. Создаем копию state
    const order = { ...this.state.order };
    // 2. Увеличиваем число бургеров в заказе или добавляем новый бургер со значением 1
    order[key] = order[key] + 1 || 1;
    // 3. Обновляем state
    this.setState({ order });
  };

  deleteFromOrder = (key) => {
    // 1. Создаем копию state
    const order = { ...this.state.order };
    // 2. Удаляем бургер из заказа
    delete order[key];
    // 3. Обновляем state
    this.setState({ order });
  };


  render() {
    // Получаем необходимые пропсы (теперь только burgers от AppWrapper)
    const { burgers } = this.props;

    const burgersData = burgers || {}; // Используем burgersData для надежности

    // Проверка на наличие данных (может быть пустым объектом {})
    const hasBurgers = typeof burgersData === 'object' && Object.keys(burgersData).length > 0;

    return (
      <div className='burger-paradise'> {/* Оставляем общую обертку */}
        <div className='menu'>
          <Header title='Hot Burgers' />
          <ul className='burgers'>
            {/* Отображаем ВСЕ бургеры, если они есть */}
            {hasBurgers ? (
              Object.keys(burgersData).map(key => { // Используем burgersData
                const burger = burgersData[key]; // Используем burgersData
                 if (burger) { // Проверяем, что бургер существует (не null после удаления в админке)
                   return (
                     <Burger
                       key={key}
                       index={key}
                       addToOrder={this.addToOrder} // Передаем локальный метод addToOrder
                       details={burger} // Передаем все детали бургера, включая статус
                     />
                   );
                 }
                 return null; // Если бургер был удален и стал null
              })
            ) : (
               // Сообщение, если меню пустое или еще загружается
               // Это сообщение будет отображаться и при loading=true в AppWrapper,
               // так как burgersData в этом случае будет {}
               <p>Loading menu or menu is empty...</p>
            )}
          </ul>
        </div>
        <Order
          // Передаем локальный метод deleteFromOrder
          deleteFromOrder={this.deleteFromOrder}
          burgers={burgersData} // Передаем burgersData (объект)
          // Передаем локальное состояние корзины
          order={this.state.order}
        />
        {/* Админка здесь не отображается */}
      </div>
    );
  }
}

// Добавляем propTypes для RestaurantView
RestaurantView.propTypes = {
    // !!! ВАЖНОЕ ИЗМЕНЕНИЕ !!!
    // Делаем burgers необязательным, так как AppWrapper передает его асинхронно
    burgers: PropTypes.object, // Убрано .isRequired
    // order, addToOrder, deleteFromOrder теперь управляются внутри компонента,
    // поэтому их propTypes здесь не нужны
};

export default RestaurantView;