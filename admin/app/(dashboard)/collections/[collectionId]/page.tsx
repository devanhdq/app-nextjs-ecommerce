'use client';
import React, {useEffect, useState} from 'react';
import Loader from "@/components/custom_ui/Loader";
import CollectionForm from "@/components/collections/CollectionForm";

const CollectionDetail = ({params}: { params: { collectionId: string } }) => {
    const [loading, setLoading] = useState(true);
    const [collectionDetail, setCollectionDetail] = useState<CollectionType | null>(null);
    const getCollectionDetail = async () => {
        try {
            const response = await fetch(`/api/collections/${params.collectionId}`, {
                method: 'GET'
            });
            const data = await response.json();
            setCollectionDetail(data);
            setLoading(false);
        } catch (error) {
            console.log("[CollectionDetail_GET] ", error);
        }
    };
    useEffect(() => {
        getCollectionDetail();
    }, []);
    return loading ? <Loader/> : (
        <CollectionForm initialData = {collectionDetail}/>
    );
};

export default CollectionDetail;