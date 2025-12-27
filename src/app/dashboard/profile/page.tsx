'use client';

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
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


export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isPasswordResetting, setIsPasswordResetting] = useState(false);
    const [isPictureSaving, setIsPictureSaving] = useState(false);


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
    
    const userEmail = user?.email || "No email provided";
    const initials = (displayName || user?.email?.split('@')[0] || "U").split(' ').map(n => n[0]).join('').substring(0, 2);

    const handleSaveChanges = async () => {
        if (!user || !firestore) return;
        setIsSaving(true);
        try {
            // Update auth profile
            await updateProfile(user, { displayName });

            // Update firestore document
            const userDocRef = doc(firestore, "users", user.uid);
            await updateDoc(userDocRef, { displayName });

            toast({ title: "Success", description: "Your profile has been updated." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handlePictureSave = async () => {
        if (!user) return;
        setIsPictureSaving(true);
        try {
            await updateProfile(user, { photoURL });
            toast({ title: "Success", description: "Profile picture updated." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update picture. Please provide a valid image URL." });
        } finally {
            setIsPictureSaving(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setIsPasswordResetting(true);
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast({ title: "Password Reset Email Sent", description: `An email has been sent to ${user.email} with instructions.` });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsPasswordResetting(false);
        }
    };


    return (
        <>
            <PageHeader
                title="Profile"
                description="View and manage your account details."
            />
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your display name and view your account email.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue={userEmail} readOnly disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card>
                         <CardHeader>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>Manage your account security settings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" onClick={handlePasswordReset} disabled={isPasswordResetting}>
                                {isPasswordResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                             <CardDescription>Update your avatar.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4 text-center">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src={photoURL || `https://avatar.vercel.sh/${userEmail}.png`} alt={displayName} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                             <div className="w-full space-y-2">
                                <Label htmlFor="photoUrl" className="sr-only">Image URL</Label>
                                <Input id="photoUrl" placeholder="Paste image URL here" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)}/>
                                <Button onClick={handlePictureSave} disabled={isPictureSaving} className="w-full">
                                    {isPictureSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Picture
                                </Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
