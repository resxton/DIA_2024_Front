import { Middleware } from 'redux';

const loggerMiddleware: Middleware = store => next => action => {
  // Логирование информации о действии
  console.log('Dispatching action:', action);
  console.log('State before action:', store.getState());

  // Передача действия дальше по цепочке middleware
  const result = next(action);

  // Логирование состояния после действия
  console.log('State after action:', store.getState());

  return result;
};

export default loggerMiddleware;
