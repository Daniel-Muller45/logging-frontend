import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover"

export default function InputWithLabel() {
    return (
        // Use flex layout to center the content horizontally
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Nutrition</h4>
                        <p className="text-sm text-muted-foreground">
                            Edit the nutritional information.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                defaultValue="2"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="calories">Calories (kcal)</Label>
                            <Input
                                id="calories"
                                defaultValue="250"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="protein">Protein (g)</Label>
                            <Input
                                id="protein"
                                defaultValue="15"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="carbs">Carbs (g)</Label>
                            <Input
                                id="carbs"
                                defaultValue="20"
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}