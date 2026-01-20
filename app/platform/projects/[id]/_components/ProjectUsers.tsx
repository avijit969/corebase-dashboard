import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Users, MoreHorizontal } from 'lucide-react';
import { ProjectUser } from '../types';

interface ProjectUsersProps {
    users: ProjectUser[];
}

export function ProjectUsers({ users }: ProjectUsersProps) {
    return (
        <Card className="bg-neutral-900/50 border-white/10 text-white backdrop-blur-sm animate-in fade-in duration-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Project Users
                </CardTitle>
                <CardDescription className="text-gray-400">
                    End-users registered to your application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {users.length > 0 ? (
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-gray-400">User</TableHead>
                                    <TableHead className="text-gray-400">Email</TableHead>
                                    <TableHead className="text-gray-400">Role</TableHead>
                                    <TableHead className="text-gray-400">Joined</TableHead>
                                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">{user.email}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-400 text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-neutral-900 border-white/10 text-white">
                                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">View Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400">Ban User</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <Users className="w-12 h-12 mb-4 opacity-20" />
                        <p>No users found for this project.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
