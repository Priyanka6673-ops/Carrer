import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
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
                <CardContent>
                    <p>This page is under construction. Check back soon for profile management features!</p>
                </CardContent>
            </Card>
        </>
    );
}
