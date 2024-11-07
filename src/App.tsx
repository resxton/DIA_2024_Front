import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AlbumPage } from "./AlbumPage";
import ITunesPage from "./ITunesPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ALBUMS} element={<ITunesPage />} />
        <Route path={`${ROUTES.ALBUMS}/:id`} element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;