import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Subject } from "@/types";
import { useShow } from "@refinedev/core";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary.ts";

const Show = () => {
  const { query } = useShow<Subject>({ resource: "subjects" });
  const subjectDetails = query.data?.data;
  const { isLoading, isError } = query;
  if (isLoading || isError || !subjectDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="subjects" title="Class Details" />
        <p className="state-message">
          {isLoading
            ? "Loading class details..."
            : isError
            ? "Failed to load class details..."
            : "Class details not found"}
        </p>
      </ShowView>
    );
  }
  const { name, code, description, department } = subjectDetails;

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="subjects" title="Subject Details" />
      <Card className="details-card">
      <div className="details-header">
                <div>
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>
                <div>
                    <Badge variant={status === 'active'?'default':'secondary'} data-status={status}>{code.toUpperCase()}</Badge>
                </div>
            </div>
        {/* <div className="details-grid">
          <div className="department">
                    <p>Department</p>
                    <div>
                        <p>

                        {name}
                        </p>
                        <p>

                        {description}
                        </p>
                    </div>
                </div>
        </div> */}
        <Separator className="my-6" />
        <div className="curriculum-info">
                    <h2>Academic Information</h2>
                    <ol className="list-decimal pl-5 space-y-2 mt-4 text-sm">
                        <li>This subject is managed by the {name} department.</li>
                        <li>Contact the department head for curriculum details.</li>
                        <li>Assigned classes for this subject can be viewed in the Classes list.</li>
                    </ol>
                </div>
      </Card>
    </ShowView>
  );
};

export default Show;
