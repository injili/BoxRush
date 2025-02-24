import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Customer from "./pages/Customer";
import Dashboard from "./pages/Dashboard";
import Driver from "./pages/Driver";
import Shipments from "./pages/Shipments";
import DarkModeToggle from "./components/darkModeToggle";

const Layout = () => {
  return (
    <div className="bg-white dark:bg-black dark:text-zinc-100 min-h-screen flex flex-col">
      <Navigation />
      <DarkModeToggle />
      <div className="flex-grow flex flex-col justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/user", element: <Customer /> },
      { path: "/driver", element: <Driver /> },
      { path: "/shipments", element: <Shipments /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
