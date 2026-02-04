"use client";

import { useUIStore } from "@/stores/ui-store";
import { motion } from "framer-motion";
import { 
  Inbox, 
  LayoutGrid, 
  Settings, 
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TeamSwitcher } from "./team-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Inbox", icon: Inbox, href: "/dashboard/inbox" },
  { label: "Issues", icon: LayoutGrid, href: "/dashboard/issues" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? 60 : 240,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative border-r bg-muted/30"
    >
      <div className="flex h-full flex-col">
        {/* Team Switcher */}
        <div className="border-b p-4">
          <TeamSwitcher collapsed={sidebarCollapsed} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 m-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
