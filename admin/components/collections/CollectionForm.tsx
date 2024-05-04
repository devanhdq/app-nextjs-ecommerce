'use client';
import {z} from "zod";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form"
import toast from "react-hot-toast";

import {zodResolver} from "@hookform/resolvers/zod"
import {Textarea} from "@/components/ui/textarea"
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import ImageUpload from "@/components/custom_ui/ImageUpload";
import Delete from "@/components/custom_ui/Delete";

const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(2000).trim(),
    image: z.string()
})

interface CollectionFormProps {
    initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({initialData}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? initialData : {
            title: "",
            description: "",
            image: "",
        },
    });
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const url = initialData ? `/api/collections/${initialData._id}` : "/api/collections";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                setLoading(false);
                toast.success(`Collection ${initialData ? "update" : "create"} successfully`);
                window.location.href = ("/collections")
                router.push("/collections");
            }
        } catch (error) {
            console.error("[Collection_POST] ", error)
            toast.error("Failed to create collection! Please try again.");
        }
    }
    return (
        <div className="p-10">
            {initialData
                ? (<div className={"flex items-center justify-between "}>
                    <p className="text-heading1-bold">Edit collection</p>
                    <Delete item="collection" id={initialData._id}/>
                </div>)
                : (<p className="text-heading1-bold">Create a new collection</p>)
            }

            <Separator className="bg-grey-1 mt-4 mb-7"/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Input title" {...field}
                                        onKeyDown={handleKeyPress}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Input description" {...field}
                                        rows={6}
                                        onKeyDown={handleKeyPress}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-10">
                        <Button type="submit" className={"bg-blue-1 text-white"}>Submit</Button>
                        <Button type="button" className={"bg-blue-1 text-white"}
                                onClick={() => router.push("/collections")}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CollectionForm;