"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamSwitcherProps {
  collapsed: boolean;
}

export function TeamSwitcher({ collapsed }: TeamSwitcherProps) {
  // Mock data - you'll fetch real teams later
  const [selectedTeam, setSelectedTeam] = useState({
    id: "1",
    name: "Engineering",
    slug: "engineering",
  });

  const teams = [
    { id: "1", name: "Engineering", slug: "engineering" },
    { id: "2", name: "Design", slug: "design" },
  ];

  if (collapsed) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {selectedTeam.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {selectedTeam.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedTeam.name}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Teams</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                  {team.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{team.name}</span>
            </div>
            {selectedTeam.id === team.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
