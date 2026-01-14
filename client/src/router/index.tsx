import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Explorer } from "@/pages/Explorer";
import { MyEpisodes } from "@/pages/MyPage";
import { EventHistory } from "@/pages/EventHistory";
import { ScrollToTop } from "@/components/common";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/explorer",
          element: <Explorer />,
        },
        {
          path: "/myepisodes",
          element: <MyEpisodes />,
        },
        {
          path: "/history",
          element: <EventHistory />,
        },
        {
          path: "/claims",
          element: <Home />,
        },
        {
          path: "/about",
          element: <Home />,
        },
      ],
    },
  ],
  {
    basename: "/eventsure",
  }
);

export const Router = () => {
  return <RouterProvider router={router} />;
};
