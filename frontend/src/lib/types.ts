import React from "react";

export type NavLink = {
  label: string;
  to: string;
  search?: Record<string, any>;
}

export type HeaderProps = {
    window?: () => Window;
    children: React.ReactNode
}