"use client"
import { CreateSiteAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";

export default function NewSite(){
    const [lastResult, action] = useFormState(CreateSiteAction, undefined);
    const [form, fields] = useForm({
        lastResult,

        onValidate({formData}){
            return parseWithZod(formData, {
                schema: siteSchema,
            })
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput"
    })

    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            <Card className="max-w-[450px]">
                <CardHeader>
                    <CardTitle>Create Site</CardTitle>
                    <CardDescription>
                        Create a new website for your business.
                    </CardDescription>
                </CardHeader>
                <form id={form.id} onSubmit={form.onSubmit} action={action}>
                <CardContent>
                <div className="flex flex-col gap-y-6">
                        <div className="grid gap-2">
                            <Label>Site</Label>
                            <Input placeholder="site title" name={fields.name.name} key={fields.name.key} defaultValue={fields.name.initialValue} />
                            <p className="text-red-500 text-xs">{fields.name.errors}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>Site Subheading</Label>
                            <Input placeholder="subheading" name={fields.subdirectory.name} key={fields.subdirectory.key} defaultValue={fields.subdirectory.initialValue} />
                            <p className="text-red-500 text-xs">{fields.subdirectory.errors}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea placeholder="write something.." name={fields.description.name} defaultValue={fields.description.initialValue} key={fields.description.key}   />
                            <p className="text-red-500 text-xs">{fields.description.errors}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    {/* <Button type="submit">Create</Button> */}
                    <SubmitButton text="Create" />
                </CardFooter>
                </form>
            </Card>
        </div>
    )
}