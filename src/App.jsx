import "./App.scss";
import router from "./routes/routes";
import ReduxProvider from "./store/redux-provider";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <ReduxProvider>
      <RouterProvider router={router} />
    </ReduxProvider>
  );
}

export default App;
