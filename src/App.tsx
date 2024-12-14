import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ElementPage } from "./ElementPage";
import ElementsPage from "./ElementsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./HomePage";
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserDashboardPage from './ProfilePage';
import ConfigurationPage from "./ConfigurationPage";
import ConfigurationsPage from "./ConfigurationsPage";
import ConfigurationElementsTable from "./ConfigurationElementsTable";
import EditConfigurationElement from "./EditConfigurationElement";

function App() {
  return (
    <BrowserRouter basename="/PlaneConfigurationSystem">
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;