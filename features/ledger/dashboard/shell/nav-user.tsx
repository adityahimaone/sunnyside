"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/features/ledger/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/features/ledger/ui/dropdown-menu";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

const user = {
	name: "Shaban Haider",
	email: "shaban@efferd.com",
	avatar: "https://github.com/shabanhr.png",
};

export function NavUser() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-8">
					<AvatarImage src={user.avatar} />
					<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="glass-float w-60">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="pointer-events-none flex items-center gap-2">
						<Avatar className="isolate size-8">
							<AvatarImage src={user.avatar} />
							<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<span className="font-medium text-foreground">{user.name}</span>{" "}
							<br />
							<div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground text-xs">
								{user.email}
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<IconPlaceholder
							hugeicons="UserMultipleIcon"
							lucide="UserIcon"
							phosphor="UserIcon"
							remixicon="RiUserLine"
							tabler="IconUser"
						/>
						Profile
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<IconPlaceholder
							hugeicons="Notification03Icon"
							lucide="BellIcon"
							phosphor="BellIcon"
							remixicon="RiNotification3Line"
							tabler="IconBell"
						/>
						Notifications
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconPlaceholder
							hugeicons="CommandIcon"
							lucide="CommandIcon"
							phosphor="CommandIcon"
							remixicon="RiCommandLine"
							tabler="IconCommand"
						/>
						Keyboard shortcuts
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<IconPlaceholder
							hugeicons="CustomerSupportIcon"
							lucide="LifeBuoyIcon"
							phosphor="LifebuoyIcon"
							remixicon="RiLifebuoyLine"
							tabler="IconHelpCircle"
						/>
						Seller help
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconPlaceholder
							hugeicons="BookOpen01Icon"
							lucide="BookOpenIcon"
							phosphor="BookOpenIcon"
							remixicon="RiBookOpenLine"
							tabler="IconBook"
						/>
						Seller guides
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<IconPlaceholder
							hugeicons="CreditCardIcon"
							lucide="CreditCardIcon"
							phosphor="CreditCardIcon"
							remixicon="RiBankCardLine"
							tabler="IconCreditCard"
						/>
						Plan & billing
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive">
						<IconPlaceholder
							hugeicons="Logout02Icon"
							lucide="LogOutIcon"
							phosphor="SignOutIcon"
							remixicon="RiLogoutBoxRLine"
							tabler="IconLogout2"
						/>
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
