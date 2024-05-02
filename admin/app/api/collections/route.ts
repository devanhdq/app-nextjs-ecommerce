import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {connectDB} from "@/lib/mongoDB";

import Collection from "@/lib/models/Collection";
// POST
export const POST = async (req: NextRequest) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 403});
        }
        await connectDB();
        const {title, description, image} = await req.json();
        if (!title || !image) {
            return new NextResponse("Bad Request", {status: 400});
        }
        //check collection is exist
        const collectionExist = await Collection.findOne({title});
        if (collectionExist) {
            return new NextResponse("Collection already exist", {status: 400});
        }
        // Create a new collection
        const newCollection = await Collection.create({
            title,
            description,
            image,
        });
        await newCollection.save();
        return new NextResponse(newCollection, {status: 200});
    } catch (e) {
        console.log("[Collections_POST] ", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

// GET
export const GET = async () => {
    try {
        await connectDB();
        const collections = await Collection.find().sort({createdAt: "desc"})
        return NextResponse.json(collections, {status: 200});
    } catch (e) {
        console.log("[Collections_GET] ", e);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}