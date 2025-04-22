import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";

type Outline = {
    id: number;
    title: string;
    description: string;
};
interface CourseOutlineScreenProps {
    outlines: Outline[] | undefined;
    setShowOutlines: (value: boolean) => void;
    showOutlines: boolean;
}

const CourseOutlineScreen: React.FC<CourseOutlineScreenProps> = ({
    outlines,
    setShowOutlines,
    showOutlines
}) => {
    return (
        <div>
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl font-bold underline">Course Outlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {outlines?.map((item: Outline) => (
                        <div key={item.id} className="p-5 border rounded-lg">
                            <strong>{item.title}</strong>
                            <p>{item.description}</p>
                        </div>
                    ))}
                    {!outlines || outlines.length === 0 ? (
                        <p className="text-center text-gray-500">No outlines available</p>
                    ) : null}
                    <Button onClick={() => setShowOutlines(!showOutlines)}>
                        Back
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseOutlineScreen;