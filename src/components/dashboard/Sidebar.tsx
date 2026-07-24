import {SidebarItem} from "./SidebarItem";

export function Sidebar(){
    return (
        <aside className="flex h-full w-64 flex-col gap-6 rounded-lg border bg-card px-6 py-8">
            <div className="flex items-center gap-2 px-2">
                <span className="text-lg font-semibold">AI Workspace</span>
            </div>

            <nav className="flex flex-col gap-2 p-4">
                <SidebarItem href="/dashboard" label="dashboard"/>
                <SidebarItem href="/workspace" label="Workspace"/>
                <SidebarItem href="/chat" label="chat"/>
                <SidebarItem href="/settings" label="Settings"/>
            </nav>
        </aside>
    )
}