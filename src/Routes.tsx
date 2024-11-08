export const ROUTES = {
	HOME: "/",
	ELEMENTS: "/configuration-elements",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
	HOME: "Главная",
	ELEMENTS: "Элементы конфигурации",
  };