import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { Book,  FileIcon,  MoreHorizontal,  PlusCircle, SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getData(userId: string, siteId: string){
    const data =  await prisma.post.findMany({
        where:{
            userId: userId,
            siteId: siteId
        },
        select:{
            image: true,
            title: true,
            createdAt: true,
            id: true,
            Site:{
                select:{
                    subdirectory: true,
                }
            }
        },
        orderBy:{
            createdAt: "desc"
        },
    });
    return data;
}

export default async function SiteIdRoute({params}:{params:{siteId: string}}){

    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user){
        return redirect('/api/auth/login')
    }

    const data = await getData(user.id, params.siteId);


    return(
        <>
        <div className="flex w-full justify-end gap-x-4">
            <Button asChild variant="secondary">
                <Link href={`/blog/${data[0].Site?.subdirectory}`}>
                <Book className="mr-2 size-4" />
                View Blog
                </Link>
            </Button>
            <Button asChild variant="secondary">
                <Link href={`/dashboard/sites/${params.siteId}/settings`}>
                <SettingsIcon className="mr-2 size-4" />
                Settings
                </Link>
            </Button>
            <Button asChild>
                <Link href={`/dashboard/sites/${params.siteId}/create`}>
                <PlusCircle className="size-4 mr-2" />
                Create Article
                </Link>
            </Button>
        </div>

        {data === undefined || data.length === 0 ?
        (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-inherit">
            <FileIcon className="size-8 text-primary" />
            </div>
            <h2 className="mt-2 text-md">You haven't created anything yet!</h2>
            </div>
        ):
        (
            <>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Articles</CardTitle>
                        <CardDescription>Discover insightful contents</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item)=>(
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Image src={item.image} width={64} height={64} alt="article cover image" className="size-16 rounded-md object-cover" />
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            {item.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-500/10 text-green-500 rounded-xl">Published</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.DateTimeFormat("en-US", {dateStyle: "medium"}).format(item.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild className="mr-4">
                                                    <Button size="icon" variant="ghost" >
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/sites/${params.siteId}/${item.id}`}>
                                                        Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/sites/${params.siteId}/${item.id}/delete`}>
                                                        Delete
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            </>
        )}
        </>
    )
}