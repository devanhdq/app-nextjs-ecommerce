import {NextRequest, NextResponse} from "next/server";

import {connectDB} from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import {auth} from "@clerk/nextjs/server";


//get by id
export const GET = async (request: NextRequest,
                          {params}: {
                              params: { productId: string }
                          }) => {
    try {
        await connectDB();
        const product = await Product
            .findById(params.productId)
            .populate({path: 'collections', model: Collection})
        if (!product) {
            return new NextResponse(JSON.stringify({message: "Product not found!"}), {status: 404});
        }
        return NextResponse.json(product, {status: 200});

    } catch (error) {
        console.log("[Products_GET_BY_ID] ", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}

export const DELETE = async (request: NextRequest, {params}: { params: { productId: string } }) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        await connectDB()
        await Product.findByIdAndDelete(params.productId)
        return new NextResponse("Product is deleted", {status: 200});
    } catch (error) {
        console.log("[Products_DELETE] ", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}
/*
export const POST = async (request: NextRequest, {params}: { params: { productId: string } }) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        await connectDB();
        let product = await Product.findById(params.productId);
        if (!product) {
            return new NextResponse("Product not found", {status: 404});
        }
        const {title, description, image} = await request.json();
        if (!title || !image) {
            return new NextResponse("Title and Image are required", {status: 400});
        }
        product = await Product.findByIdAndUpdate(params.productId, {title, description, image}, {new: true});
        await product.save();
        return NextResponse.json(product, {status: 200});
    } catch (e) {
        console.log("[Products_POST] ", e)
        return new NextResponse("Internal Error", {status: 500});

    }
}

/!*Delete*!/
export const DELETE = async (request: NextRequest, {params}: { params: { productId: string } }) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        await connectDB()
        await Product.findByIdAndDelete(params.productId)
        return new NextResponse("Product is deleted", {status: 200});
    } catch (error) {
        console.log("[Products_DELETE] ", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}
*/
