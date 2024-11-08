import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./ElementPage";
import ITunesPage from "./ElementsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ELEMENTS} element={<ITunesPage />} />
        <Route path={`${ROUTES.ELEMENTS}/:id`} element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;