import React from "react";

export type SidebarMenuItem = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
};

export type SidebarMenuProps = {
  open: boolean;
  onClose: () => void;
  logoSrc?: string;
  items: SidebarMenuItem[];
}; 