import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ElementPage } from "./ElementPage";
import ElementsPage from "./ElementsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./HomePage";

function App() {
  return (
    <BrowserRouter basename="/PlaneConfigurationSystem">
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ELEMENTS} element={<ElementsPage />} />
        <Route path={`${ROUTES.ELEMENTS}/:id`} element={<ElementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;