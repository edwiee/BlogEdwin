import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FileIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import defaultImage  from "@/public/default.png";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

async function getData(userId: string) {
    const data = await prisma.site.findMany({
        where:{
            userId: userId
        },

        orderBy:{
            createdAt: "desc"
        },

    });
    return data;
}

export default async function SiteRoute(){
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user){
        return redirect('/api/auth/login')
    }
    const data = await getData(user.id);


    return (
        <>
        <div className="flex w-full justify-end">
            <Button asChild>
                <Link href={"/dashboard/sites/new"}>
                <PlusCircleIcon className="mr-2 size-4" /> Create New 
                </Link>
            </Button>
        </div>
        {data == undefined || data.length === 0 ?
        
        (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-inherit">
        <FileIcon className="size-8 text-primary" />
        </div>
        <h2 className="mt-2 text-md">You haven't created anything yet!</h2>
        </div>
        ):
        (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {data.map((item)=>(
                    <Card key={item.id}>
                        <Image src={item.imageUrl ?? defaultImage } alt={item.name}
                        className="rounded-t-lg object-cover w-full h-[200px]"
                        width={400} height={200}
                        />
                        <CardHeader>
                            <CardTitle className="truncate">{item.name}</CardTitle>
                            <CardDescription className="line-clamp-3">{item.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/sites/${item.id}`}>View Articles</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
        </>
    )
}


{/* <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
<div className="flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-inherit">
<FileIcon className="size-8 text-primary" />
</div>
<h2 className="mt-2 text-md">You haven't created anything yet!</h2>
</div> */}