// src/Routes.ts
export const ROUTES = {
	HOME: "/",
	ELEMENTS: "/configuration-elements",
	LOGIN: "/login", // Страница авторизации
	REGISTER: "/register", // Страница регистрации
	USER_DASHBOARD: "/account", // Личный кабинет пользователя
	USER_APPLICATIONS: "/my-configurations", // Страница заявок пользователя
	CONFIGURATION: "/configuration",
	CONFIGURATIONS: "/configurations",
	ELEMENTS_TABLE: "/edit-configuration-elements",
	EDIT_ELEMENT: "/edit-configuration-element",
	CREATE_ELEMENT: "/create-configuration-element",
	PAGE_403: "/403",
	PAGE_404: "/404"
  };
  
  export type RouteKeyType = keyof typeof ROUTES;
  
  export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
	HOME: "Главная",
	ELEMENTS: "Элементы конфигурации",
	LOGIN: "Вход", // Подпись для страницы авторизации
	REGISTER: "Регистрация", // Подпись для страницы регистрации
	USER_DASHBOARD: "Личный кабинет", // Подпись для личного кабинета
	USER_APPLICATIONS: "Мои заявки", // Подпись для страницы с заявками пользователя
	CONFIGURATION: "Текущая конфигурация",
	CONFIGURATIONS: "Конфигурации",
	ELEMENTS_TABLE: "Элементы конфигурации",
	EDIT_ELEMENT: "Редактирование элемента",
	CREATE_ELEMENT: "Создание элемента",
	PAGE_403: "403",
	PAGE_404: "404"
  };
  