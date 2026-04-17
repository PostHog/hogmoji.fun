import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { TemplateListPage } from "./pages/TemplateListPage";
import { EditorPage } from "./pages/EditorPage";

export function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<TemplateListPage />} />
        <Route path="/:id" element={<EditorPage />} />
      </Routes>
    </div>
  );
}

export default App;
