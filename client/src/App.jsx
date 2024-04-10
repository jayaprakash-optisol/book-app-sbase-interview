import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddBook from "./Components/AddBook/AddBook";
import Book from "./Components/Book/Book";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import RootLayout from "./Components/RootLayout/RootLayout";
import UserContextProvider from "./Context/UserContext";
import RemovedBooks from "./Components/RemovedBooks/RemovedBooks";
import NewBooks from "./Components/NewBooks/NewBooks";

let routers = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "addBook", element: <AddBook /> },
      { path: "Book/:id", element: <Book /> },
      { path: "profile", element: <Profile /> },
      { path: "removed-books", element: <RemovedBooks /> },
      { path: "new-books", element: <NewBooks /> },
    ],
  },
]);

function App() {
  return (
    <>
      <UserContextProvider>
        <RouterProvider router={routers} />
      </UserContextProvider>
    </>
  );
}

export default App;
