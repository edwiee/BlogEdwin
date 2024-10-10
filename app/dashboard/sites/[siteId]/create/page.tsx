"use client"
import { CreatePostAction } from "@/app/actions";
import TailwindEditor from "@/app/components/dashboard/EditorWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/lib/uploadthing";
import { PostSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { error } from "console";
import { ArrowLeft, AtomIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSONContent } from "novel";
import { useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import slugify from "react-slugify"
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";

export default function ArticleCreation({params}:{params:{siteId: string}}){

    const [title, setTitle] = useState<undefined | string>(undefined);
    const [slug, setSlug] = useState<undefined | string>(undefined);
    const [imageUrl, setImageUrl] = useState<undefined | string>(undefined);
    const [value, setValue] = useState<JSONContent | undefined>(undefined);
    const [lastResult, action] = useFormState(CreatePostAction, undefined);

    const [form, fields] =  useForm({
        lastResult,

        onValidate({formData}){
            return parseWithZod(formData, {
                schema: PostSchema,
            })
        },

        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    });

    function handleSlug (){
        const titleInput = title;

        if(titleInput?.length === 0 || titleInput === undefined){
            return toast.error('Title is missing')
        }
        setSlug(slugify(titleInput));
        return toast.success('Slug Generated')
    }

    return(
        <>
        <div className="flex items-center">
            <Button asChild size="icon" variant="outline" className="mr-3">
                <Link href={`/dashboard/sites/${params.siteId}`}>
                <ArrowLeft className="size-4" />
                </Link>
            </Button>
            <h1 className="text-xl font-semibold">Create Article</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>
                    Add Article
                </CardTitle>
                <CardDescription>
                    Create insightful articles on trending topics and ideas to keep others updated.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-6" id={form.id} onSubmit={form.onSubmit} action={action}>
                    <input type="hidden" name="siteId" value={params.siteId} />
                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input placeholder="NextJS Blog Application" 
                        name={fields.title.name} 
                        key={fields.title.key} 
                        defaultValue={fields.title.initialValue} 
                        onChange={(e)=>setTitle(e.target.value)} value={title}
                        />
                        <p className="text-red-500 text-xs">{fields.title.errors}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Slug</Label>
                        <Input placeholder="Slug for the article" 
                        name={fields.slug.name} 
                        key={fields.slug.key} 
                        defaultValue={fields.slug.initialValue}
                        onChange={(e)=>setSlug(e.target.value)}
                        value={slug}
                        />
                        <Button className="w-fit" variant="secondary" type="button" onClick={handleSlug}>
                            <AtomIcon className="size-4 mr-2" />
                            Generate slug
                        </Button>
                        <p className="text-red-500 text-xs">{fields.slug.errors}</p>
                    </div>
                    <div className="grid gap-2">
                        <Label>SubHeading</Label>
                        <Textarea placeholder="write something here" className="h-10" name={fields.smallDescription.name} key={fields.smallDescription.key} defaultValue={fields.smallDescription.initialValue} />
                        <p className="text-red-500 text-xs">{fields.smallDescription.errors}</p>
                    </div>

                    <div className=" grid gap-2">
                        <Label>Article Content</Label>
                        <Input type="hidden" name={fields.articleContent.name} key={fields.articleContent.key} defaultValue={fields.articleContent.initialValue} value={JSON.stringify(value)} />
                        <TailwindEditor onChange={setValue} initialValue={value}  />
                        <p className="text-red-500 text-xs">{fields.articleContent.errors}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Cover Image</Label>
                        <Input type="hidden" name={fields.coverImage.name} key={fields.coverImage.key} defaultValue={fields.coverImage.initialValue} value={imageUrl}  />
                        {imageUrl?
                        (
                            <Image src={imageUrl}  alt="Uploaded image" className="object-cover w-[400px] h-[400px] rounded-lg"
                            width={400} height={400}
                            />
                        ):
                        (
                            <UploadDropzone endpoint="imageUploader"
                            onClientUploadComplete={(res)=>{
                                setImageUrl(res[0].url);
                                toast.success("Image has been uploaded")
                            }}
                            onUploadError={()=>{
                                toast.error("Upload Failed")
                            }}
                            />
                        )}
                        <p className="text-red-500 text-xs">{fields.coverImage.errors}</p>
                    </div>
                    <SubmitButton text="Post Article" />
                </form>
            </CardContent>
        </Card>
        </>
    )
}