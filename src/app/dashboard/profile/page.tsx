'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return (
            <>
                <PageHeader
                    title="Profile"
                    description="Manage your account details."
                />
                <Card>
                    <CardHeader>
                        <CardTitle>Your Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </>
        )
    }
    
    const userName = user?.displayName || user?.email?.split('@')[0] || "User";
    const userEmail = user?.email || "No email provided";
    const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
        <>
            <PageHeader
                title="Profile"
                description="View and manage your account details."
            />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your display name and view your account email.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" defaultValue={userName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue={userEmail} readOnly disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </div>
                 <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4 text-center">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.photoURL || `https://avatar.vercel.sh/${userEmail}.png`} alt={userName} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Picture</Button>
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle>Password</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">Change Password</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
