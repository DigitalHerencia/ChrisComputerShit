import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HardHat, Wrench, Calendar, FileText } from 'lucide-react';
import { SignedOut, SignInButton } from '@clerk/nextjs';

export default function HomePage() {
  return (
      <>
      <SignedOut>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <HardHat className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Chris Romero's
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              Construction Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-left">
              Making jobsite management puro cherry pie, tu sabes! Track
              projects, logs, timesheets, and more - all in one place.
            </p>
            <SignInButton mode="redirect">
              <Button className='w-full sm:w-auto mb-6'>
                Sign in
              </Button>
            </SignInButton>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Daily Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track daily progress with photos and weather
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Wrench className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <CardTitle>Timesheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Easy payroll tracking for your crew
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <FileText className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Scan and organize all project docs
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <HardHat className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Manage all your jobs in one dashboard
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SignedOut></>
  );
}