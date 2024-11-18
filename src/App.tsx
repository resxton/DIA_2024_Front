import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ElementPage } from "./ElementPage";
import ElementsPage from "./ElementsPage";
import { ROUTES } from "./Routes";
import { HomePage } from "./HomePage";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    if (window.TAURI) {
      const { invoke } = window.TAURI.tauri;

      invoke('tauri', { cmd: 'create' })
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));

      return () => {
        invoke('tauri', { cmd: 'close' })
          .then((response: any) => console.log(response))
          .catch((error: any) => console.log(error));
      };
    }
  }, []);
  

  return (
    <BrowserRouter basename="/DIA_2024_Front">
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ELEMENTS} element={<ElementsPage />} />
        <Route path={`${ROUTES.ELEMENTS}/:id`} element={<ElementPage />} />
      </Routes>
    </BrowserRouter>
  );
}queueMicrotask

export default App;