'use client';
import {z} from "zod";
import React, {useEffect, useState} from "react";
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
import MultiText from "@/components/custom_ui/MultiText";
import MultiSelect from "@/components/custom_ui/MultiSelect";

const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(2000).trim(),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    price: z.coerce.number().min(0.1),
    expense: z.coerce.number().min(0.1),

})

interface ProductFormProps {
    initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({initialData}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState<CollectionType[]>([]);

    const getCollections = async () => {
        try {
            const res = await fetch("/api/collections", {
                method: "GET",
            });
            const data = await res.json();
            setCollections(data);
            setLoading(false);
        } catch (err) {
            console.log("[collections_GET]", err);
            toast.error("Something went wrong! Please try again.");
        }
    };

    useEffect(() => {
        getCollections();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? initialData
            : {
                title: "",
                description: "",
                media: [],
                category: "",
                collections: [],
                tags: [],
                sizes: [],
                colors: [],
                price: 0.1,
                expense: 0.1,
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
            const url = initialData
                ? `/api/products/${initialData._id}`
                : "/api/products";
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.ok) {
                setLoading(false);
                toast.success(`Product ${initialData ? "update" : "create"} successfully`);
                window.location.href = ("/products")
                router.push("/products");
            }
        } catch (error) {
            console.error("[Product_POST] ", error)
            toast.error("Failed to create product! Please try again.");
        }
    }
    return (
        <div className="p-10">
            {initialData
                ? (<div className={"flex items-center justify-between "}>
                    <p className="text-heading1-bold">Edit product</p>
                    <Delete id={initialData._id}/>
                </div>)
                : (<p className="text-heading1-bold">Create a new product</p>)
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
                                        placeholder="Input title..." {...field}
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
                                        placeholder="Input description..." {...field}
                                        rows={6}
                                        onKeyDown={handleKeyPress}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="media"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={(url) => field.onChange([...field.value, url])}
                                        onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className={"md:grid md:grid-cols-3 gap-8"}>
                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Input price..." {...field}
                                            onKeyDown={handleKeyPress}
                                            type="number"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expense"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Expense ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Input expense..." {...field}
                                            onKeyDown={handleKeyPress}
                                            type="number"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Input category..." {...field}
                                            onKeyDown={handleKeyPress}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiText
                                            placeholder="Input tags..."
                                            value={field.value}
                                            onChange={(tag) => field.onChange([...field.value, tag])}
                                            onRemove={(tag) => field.onChange([...field.value.filter((item) => item !== tag)])}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="collections"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Collections</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            placeholder="Input collection..."
                                            collections={collections}
                                            value={field.value}
                                            onChange={(_id) => field.onChange([...field.value, _id])}
                                            onRemove={(_id) => field.onChange([...field.value.filter((collectionId) => collectionId !== _id)])}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-10">
                        <Button type="submit" className={"bg-blue-1 text-white"}>Submit</Button>
                        <Button type="button" className={"bg-blue-1 text-white"}
                                onClick={() => router.push("/products")}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default ProductForm;