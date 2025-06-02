import React from 'react';
import { render } from 'react-dom';
import Router from './components/Router';
import './css/style.css';

// Импорт файла base.js для инициализации Firebase
import './base';

render(<Router />, document.querySelector('#root'));
