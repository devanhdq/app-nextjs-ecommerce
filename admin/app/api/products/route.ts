import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {connectDB} from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";

//GET
export const GET = async () => {
    try {
        await connectDB();
        const products = await Product.find()
            .sort({createdAt: "desc"})
            .populate({
                path: 'collections',
                model: Collection
            });
        return NextResponse.json(products, {status: 200});
    } catch (e) {
        console.log("[Product_GET] ", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
};

//POST
export const POST = async (request: NextRequest) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        await connectDB();
        const {
            title,
            description,
            media,
            category,
            collections,
            tags,
            sizes,
            colors,
            price,
            expense
        } = await request.json();
        if (!title || !description || !media || !category || !price || !expense) {
            return new NextResponse("Bad Request: Not enough data to create a product", {status: 400});
        }
        const newProduct = await Product.create({
            title,
            description,
            media,
            category,
            collections,
            tags,
            sizes,
            colors,
            price,
            expense,
        });
        await newProduct.save();
        return NextResponse.json(newProduct, {status: 200});
    } catch (e) {
        console.log("[Product_POST] ", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

