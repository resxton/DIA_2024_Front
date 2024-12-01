import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ElementPage } from "./ElementPage";
import ElementsPage from "./ElementsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./HomePage";
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserDashboardPage from './ProfilePage';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;