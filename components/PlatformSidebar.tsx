"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layers, LogOut, Settings, User, Database, Users, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { api } from '@/lib/api';

interface Project {
    id: string;
    name: string;
}

export function PlatformSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    // Check if we are in a project view
    const isProjectView = pathname?.includes('/platform/projects/');
    const projectId = isProjectView ? pathname?.split('/')[3] : null;

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem("platform_token");
            if (!token) return;
            try {
                const data = await api.projects.list(token);
                // Handle list structure same as page.tsx
                let projectsList: Project[] = [];
                if (Array.isArray(data)) {
                    projectsList = data;
                } else if (data && Array.isArray((data as any).projects)) {
                    projectsList = (data as any).projects;
                } else if (data && Array.isArray((data as any).data)) {
                    projectsList = (data as any).data;
                }
                setProjects(projectsList);

                if (projectId) {
                    const current = projectsList.find(p => p.id === projectId);
                    if (current) setCurrentProject(current);
                }
            } catch (e) {
                console.error("Failed to fetch projects for sidebar", e);
            }
        };

        fetchProjects();
    }, [projectId]);

    return (
        <aside className="w-64 border-r border-white/10 bg-black hidden md:flex flex-col sticky top-0 h-screen z-50">
            <SidebarContent projects={projects} currentProject={currentProject} isProjectView={isProjectView} projectId={projectId} router={router} setCurrentProject={setCurrentProject} />
        </aside>
    );
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    // Check if we are in a project view
    const isProjectView = pathname?.includes('/platform/projects/');
    const projectId = isProjectView ? pathname?.split('/')[3] : null;

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem("platform_token");
            if (!token) return;
            try {
                const data = await api.projects.list(token);
                let projectsList: Project[] = [];
                if (Array.isArray(data)) {
                    projectsList = data;
                } else if (data && Array.isArray((data as any).projects)) {
                    projectsList = (data as any).projects;
                } else if (data && Array.isArray((data as any).data)) {
                    projectsList = (data as any).data;
                }
                setProjects(projectsList);

                if (projectId) {
                    const current = projectsList.find(p => p.id === projectId);
                    if (current) setCurrentProject(current);
                }
            } catch (e) {
                console.error("Failed to fetch projects for sidebar", e);
            }
        };
        fetchProjects();
    }, [projectId]);

    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [pathname]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Sidebar Panel */}
            <div className="relative flex-1 w-full max-w-xs bg-black border-r border-white/10 p-4 h-full overflow-y-auto animate-in slide-in-from-left duration-300">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-400" onClick={onClose}>
                    <LogOut className="w-5 h-5 rotate-180" /> {/* Using LogOut as a generic back/close icon style or replace with X */}
                </Button>
                <div className="mt-8 h-full flex flex-col">
                    <SidebarContent projects={projects} currentProject={currentProject} isProjectView={isProjectView} projectId={projectId} router={router} setCurrentProject={setCurrentProject} />
                </div>
            </div>
        </div>
    );
}

function SidebarContent({ projects, currentProject, isProjectView, projectId, router, setCurrentProject }: {
    projects: Project[];
    currentProject: Project | null;
    isProjectView: boolean | null | undefined;
    projectId: string | null | undefined;
    router: any;
    setCurrentProject: (p: Project | null) => void;
}) {
    const pathname = usePathname();
    return (
        <>
            {/* Project Switcher / Brand Header */}
            <div className="mb-8">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between px-2 h-12 hover:bg-white/5 border border-transparent hover:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col items-start overflow-hidden">
                                    <span className="text-sm font-bold tracking-tight truncate w-[120px]">
                                        {currentProject ? currentProject.name : "CoreBase"}
                                    </span>
                                    <span className="text-xs text-gray-500 font-normal">
                                        {currentProject ? "Project" : "Platform"}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-neutral-900 border-white/10 text-white" align="start">
                        <DropdownMenuItem onClick={() => {
                            router.push('/platform');
                            setCurrentProject(null);
                        }} className="focus:bg-white/10 cursor-pointer">
                            <Layers className="mr-2 h-4 w-4" />
                            All Projects
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        {projects.map(project => (
                            <DropdownMenuItem key={project.id} onClick={() => {
                                router.push(`/platform/projects/${project.id}`);
                                setCurrentProject(project);
                            }} className="focus:bg-white/10 cursor-pointer">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                                {project.name}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => router.push('/platform')} className="focus:bg-white/10 cursor-pointer text-orange-400 focus:text-orange-400">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
                <div className="mb-6 px-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {isProjectView ? "Project Menu" : "Platform"}
                    </div>
                    <nav className="space-y-1">
                        {!isProjectView && (
                            <>
                                <NavLink href="/platform" icon={<Layers className="w-4 h-4" />}>Projects</NavLink>
                                <NavLink href="/platform/settings" icon={<Settings className="w-4 h-4" />}>Settings</NavLink>
                            </>
                        )}

                        {isProjectView && projectId && (
                            <>
                                <NavLink
                                    href={`/platform/projects/${projectId}`}
                                    active={pathname === `/platform/projects/${projectId}` || pathname?.includes(`/platform/projects/${projectId}/tables/`)}
                                    icon={<Database className="w-4 h-4" />}
                                >Database</NavLink>
                                <NavLink href={`/platform/projects/${projectId}/users`} icon={<Users className="w-4 h-4" />}>Users</NavLink>
                                <NavLink href={`/platform/projects/${projectId}/settings`} icon={<Settings className="w-4 h-4" />}>Settings</NavLink>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* User Footer */}
            <div className="mt-auto border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10">
                        <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Dev Account</p>
                        <p className="text-xs text-gray-500 truncate">dev@corebase.com</p>
                    </div>
                </div>
                <NavLink href="/" icon={<LogOut className="w-4 h-4" />}>Sign Out</NavLink>
            </div>
        </>
    );
}

function NavLink({ href, icon, children, exact = false, active }: { href: string; icon: React.ReactNode; children: React.ReactNode; exact?: boolean; active?: boolean }) {
    const pathname = usePathname();
    const isActive = active !== undefined ? active : (exact ? pathname === href : pathname?.startsWith(href));

    return (
        <Link href={href}>
            <Button
                variant="ghost"
                className={`w-full justify-start gap-2 ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
                {icon}
                {children}
            </Button>
        </Link>
    )
}
