import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ElementPage } from "./ElementPage";
import ElementsPage from "./ElementsPage";
import ForbiddenPage from "./403Page";
import NotFoundPage from "./404Page";
import { ROUTES } from "./Routes";
import { HomePage } from "./HomePage";
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserDashboardPage from './ProfilePage';
import ConfigurationPage from "./ConfigurationPage";
import ConfigurationsPage from "./ConfigurationsPage";
import ConfigurationElementsTable from "./ConfigurationElementsTable";
import EditConfigurationElement from "./EditConfigurationElement";
import CreateConfigurationElementPage from "./CreateConfigurationElementPage";

function App() {
  return (
    
    <BrowserRouter basename="/PlaneConfigurationSystem">
      <style>
        {`
          .btn-primary {
            background-color: #000000;
            border-color: #000000;
          }
          .btn-primary:hover {
            background-color: #333333;
            border-color: #333333;
          }
          .btn-primary:active {
            background-color: #FFFFFF;
            border-color: #000000;
          }
        `}
      </style>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ELEMENTS} element={<ElementsPage />} />
        <Route path={`${ROUTES.ELEMENTS}/:id`} element={<ElementPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboardPage />} />
        <Route path={`${ROUTES.CONFIGURATION}/:id`} element={<ConfigurationPage />} />
        <Route path={ROUTES.CONFIGURATIONS} element={<ConfigurationsPage />} />
        <Route path={ROUTES.ELEMENTS_TABLE} element={<ConfigurationElementsTable />} />
        <Route path={`${ROUTES.ELEMENTS_TABLE}/:id`} element={<EditConfigurationElement />} />
        <Route path={ROUTES.CREATE_ELEMENT} element={<CreateConfigurationElementPage />} />
        {/* Страницы ошибок */}
        <Route path={ROUTES.PAGE_403} element={<ForbiddenPage />} />
        <Route path={ROUTES.PAGE_404} element={<NotFoundPage />} />
        
        {/* Страница по умолчанию для несуществующих маршрутов */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
