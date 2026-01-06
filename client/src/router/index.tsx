import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from '@/pages/Home'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
  ],
  {
    basename: '/evnetsure-demo',
  }
)

export const Router = () => {
  return <RouterProvider router={router} />
}
