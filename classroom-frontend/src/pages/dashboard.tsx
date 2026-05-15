import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Welcome to the Class Management Portal
      </h1>
      <p className="text-xl text-center text-muted-foreground">
        Your central hub for managing academic subjects
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex items-center justify-center px-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Subjects</CardTitle>
            <CardDescription>
              View and manage all available subjects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Get details on any subject.</p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>
              Organize and access all your classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and manage class schedules and enrollments.</p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <CardDescription>
              Oversee all academic departments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage all departments and their subjects.</p>
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Review your academic performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access your grades and other academic details.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
