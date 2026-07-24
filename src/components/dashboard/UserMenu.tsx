import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import LogoutButton from "./LogoutButton";

interface UserMenuProps{
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

export default function UserMenu({user}: UserMenuProps){
    const fallbackLetter = user?.name?.charAt(0).toUpperCase() || "?";
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 p-1">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User avatar"}/>
                        <AvatarFallback>{fallbackLetter}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}