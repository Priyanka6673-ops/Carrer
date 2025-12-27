import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <>
            <PageHeader
                title="Settings"
                description="Configure your application preferences."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This page is under construction. Check back soon for settings options!</p>
                </CardContent>
            </Card>
        </>
    );
}
