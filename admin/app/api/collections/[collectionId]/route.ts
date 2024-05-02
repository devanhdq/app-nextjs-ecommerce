import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {connectDB} from "@/lib/mongoDB";
import Collection from "@/lib/models/Collection";

//get by id
export const GET = async (request: NextRequest, {params}: { params: { collectionId: string } }) => {
    try {
        await connectDB();
        const collection = await Collection.findById(params.collectionId);
        if (!collection) {
            return new NextResponse(JSON.stringify({message: "Collection not found!"}), {status: 404});
        }
        return NextResponse.json(collection, {status: 200});
    } catch (error) {
        console.log("[Collections_GET_BY_ID] ", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}

export const POST = async (request: NextRequest, {params}: { params: { collectionId: string } }) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        await connectDB();
        let collection = await Collection.findById(params.collectionId);
        if (!collection) {
            return new NextResponse("Collection not found", {status: 404});
        }
        const {title, description, image} = await request.json();
        if (!title || !image) {
            return new NextResponse("Title and Image are required", {status: 400});
        }
        collection = await Collection.findByIdAndUpdate(params.collectionId, {title, description, image}, {new: true});
        await collection.save();
        return NextResponse.json(collection, {status: 200});
    } catch (e) {
        console.log("[Collections_POST] ", e)
        return new NextResponse("Internal Error", {status: 500});

    }
}

/*Delete*/
export const DELETE = async (request: NextRequest, {params}: { params: { collectionId: string } }) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        await connectDB()
        await Collection.findByIdAndDelete(params.collectionId)
        return new NextResponse("Collection is deleted", {status: 200});
    } catch (error) {
        console.log("[Collections_DELETE] ", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}
