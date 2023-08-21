import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route to={"/"} element={<Homepage />} />
        <Route to={"/product"} element={<Product />} />
        <Route to={"/pricing"} element={<Pricing />} />
        <Route to={"*"} element={<PageNotFound />} />
        <Route to={"/app"} element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
