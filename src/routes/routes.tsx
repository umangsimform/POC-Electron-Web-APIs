import { createBrowserRouter } from "react-router-dom";
import { Protectedroute } from "../@guards/ProtectedRoute";
import Home from "../pages/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // Protected route (Authentication required)
      <Protectedroute>
        <Home />
      </Protectedroute>
    ),
  },

  {
    path: "/users", // public route (No authentication required)
    element: <div>{/* <Users /> */}</div>,
  },

  // {
  //   path: "/auth",
  //   children: [
  //     {
  //       path: "login",
  //       element: (
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <Login />
  //         </Suspense>
  //       ),
  //     },
  //     {
  //       path: "signup",
  //       element: (
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <Signup />
  //         </Suspense>
  //       ),
  //     },
  //   ],
  // },
]);

export default router;
