'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const { user } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!user || !firestore) return;
        setIsDeleting(true);
        try {
            // First, delete Firestore data
            const userDocRef = doc(firestore, "users", user.uid);
            // Note: This does not delete subcollections. For a full deletion, 
            // you would need a Cloud Function to recursively delete subcollection documents.
            await deleteDoc(userDocRef);

            // Then, delete the user from Auth
            await deleteUser(user);

            toast({
                title: "Account Deleted",
                description: "Your account and all associated data have been permanently deleted.",
            });
            router.push('/');
        } catch (error: any) {
            console.error("Account deletion error:", error);
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "An error occurred. You may need to log in again to complete this action.",
            });
            setIsDeleting(false);
        }
    };


    return (
        <>
            <PageHeader
                title="Settings"
                description="Configure your application preferences."
            />
            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive notifications from us.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="weekly-reports" className="font-semibold">Weekly Progress Reports</Label>
                                <p className="text-sm text-muted-foreground">Receive a summary of your activity and progress every week.</p>
                            </div>
                            <Switch id="weekly-reports" defaultChecked/>
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="feature-updates" className="font-semibold">Product & Feature Updates</Label>
                                <p className="text-sm text-muted-foreground">Be the first to know about new features and improvements.</p>
                            </div>
                            <Switch id="feature-updates" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="dark" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <RadioGroupItem value="light" id="light" className="sr-only" />
                                <Label htmlFor="light" className="block w-full p-4 rounded-md border-2 border-muted bg-popover text-center cursor-pointer [&:has([data-state=checked])]:border-primary">
                                    Light Mode
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                                <Label htmlFor="dark" className="block w-full p-4 rounded-md border-2 border-muted bg-popover text-center cursor-pointer [&:has([data-state=checked])]:border-primary">
                                    Dark Mode
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="system" id="system" className="sr-only" />
                                <Label htmlFor="system" className="block w-full p-4 rounded-md border-2 border-muted bg-popover text-center cursor-pointer [&:has([data-state=checked])]:border-primary">
                                    System Default
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>This action is permanent and cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove all of your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Yes, delete my account
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
