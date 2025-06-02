import React from 'react';
import PropTypes from 'prop-types';

class Burger extends React.Component {
  static propTypes = {
    details: PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      desc: PropTypes.string,
      status: PropTypes.string // Ожидаем prop status
    }),
    index: PropTypes.string,
    addToOrder: PropTypes.func // Этот пропс может отсутствовать в админке (в админ-интерфейсе App.js его не передает)
  };

  render() {
    const { image, name, price, desc, status } = this.props.details;
    const isAvailable = status === 'available';
    // Проверяем, был ли передан пропс addToOrder
    // Это наш индикатор того, находимся ли мы в публичном интерфейсе (true) или админке (false)
    const isInPublicInterface = typeof this.props.addToOrder === 'function';

    // Добавляем класс CSS к li элементу в зависимости от доступности.
    // Этот класс применяется, если бургер НЕ доступен (везде).
    const burgerClass = `menu-burger ${isAvailable ? '' : 'unavailable'}`;


    return (
      <li className={burgerClass}> {/* Применяем класс */}
        <div className='image-container'>
          <img src={image} alt={name} />
        </div>

        <div className='burger-details'>
          <h3 className='burger-name'>
            {name}
            <span className='price'>{price} </span>
          </h3>
          <p>{desc}</p>

          {/* Условное отображение:
              - Если в публичном интерфейсе, показываем кнопку "Заказать" с текстом по статусу.
              - Если в админке, показываем кнопку, но она всегда неактивна и текст зависит от статуса.
          */}
          {isInPublicInterface ? (
            // Публичный интерфейс: кнопка "Заказать" (активная или неактивная в зависимости от isAvailable)
            <button
              className='buttonOrder'
              disabled={!isAvailable} // Кнопка отключена, если недоступен
              onClick={() => this.props.addToOrder(this.props.index)}
            >
              {isAvailable ? 'Order' : 'Temporarily not available'} {/* Текст кнопки меняется */}
            </button>
          ) : (
            // Админ-интерфейс: отображаем кнопку, но она всегда неактивна.
            // Текст кнопки меняется в зависимости от isAvailable.
            // Если бургер доступен в админке, можно показать пустую кнопку
            // или текст "Доступно" или ничего. Давайте оставим текст "Доступно" или "Временно нет"
            // и всегда неактивную кнопку в админке для единообразия внешнего вида.
            // Или просто ничего не показывать, если доступен, и неактивную кнопку, если недоступен.
            // Второй вариант кажется чище.

            // Вариант 1: Всегда неактивная кнопка в админке с текстом по статусу.
            // <button
            //   className='buttonOrder' // Используем тот же класс
            //   disabled={true} // Всегда неактивна в админке
            // >
            //   {isAvailable ? 'Доступно' : 'Временно нет'}
            // </button>

            // Вариант 2: Неактивная кнопка "Временно нет" только для недоступных бургеров в админке.
            !isAvailable && (
              <button
                className='buttonOrder' // Используем тот же класс
                disabled={true} // Всегда неактивна
              >
                Temporarily not available
              </button>
            )
          )}
        </div>
      </li>
    );
  }
}

export default Burger;