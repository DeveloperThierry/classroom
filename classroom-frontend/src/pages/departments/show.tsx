import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Department, DepartmentWithTotals } from "@/types";
import { useShow } from "@refinedev/core";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary.ts";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

const Show = () => {
  // 1. Use the useShow hook to fetch department details and its totals [2]
  const { query } = useShow<DepartmentWithTotals>({
    resource: "departments",
  });

  const { data, isLoading, isError } = query;

  // 2. Destructure data based on the DepartmentWithTotals schema [1, 3]
  const departmentData = data?.data;
  const { department, totals } = departmentData || {};
  const { name, code, description } = department || {};

  if (isLoading)
    return <div className="p-8 text-center">Loading department details...</div>;
  if (isError || !department)
    return (
      <div className="p-8 text-center text-destructive">
        Department not found.
      </div>
    );

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="departments" title="Department Details" />

      <Card className="details-card p-6">
        <div className="details-header flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <div>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              data-status={status}
            >
              {code?.toUpperCase()}
            </Badge>
          </div>
        </div>

        <Separator className="my-6" />

        {/* 3. Display academic metrics based on the 'totals' object from the API [1] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground uppercase font-semibold">
              Total Subjects
            </p>
            <p className="text-2xl font-bold">{totals?.subjects || 0}</p>
          </Card>
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground uppercase font-semibold">
              Active Classes
            </p>
            <p className="text-2xl font-bold">{totals?.classes || 0}</p>
          </Card>
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground uppercase font-semibold">
              Enrolled Students
            </p>
            <p className="text-2xl font-bold">
              {totals?.enrolledStudents || 0}
            </p>
          </Card>
        </div>

        <div className="curriculum-info">
          <h2 className="text-xl font-semibold">Academic Information</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-4 text-sm text-muted-foreground">
            <li>
              The <strong>{name}</strong> department manages {totals?.subjects}{" "}
              distinct subjects [6].
            </li>
            <li>
              Inquiries regarding curriculum should be directed to the {name}{" "}
              faculty office.
            </li>
            <li>
              All associated classes and student records are synced with the
              central management system [7].
            </li>
          </ol>
        </div>
      </Card>
    </ShowView>
  );
};

export default Show;
