import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import CustomMaterialThemeProvider from '@/components/ui/provider';
import { Button } from '@mui/material';
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
    <CustomMaterialThemeProvider>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
        <Button variant="contained">Primary</Button>
      </div>
      <hr />
      <Outlet />
    </CustomMaterialThemeProvider>
      <ReactQueryDevtools/>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
}
