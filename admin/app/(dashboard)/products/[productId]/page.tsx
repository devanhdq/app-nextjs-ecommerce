'use client';

import React, {useEffect, useState} from 'react';
import Loader from "@/components/custom_ui/Loader";
import ProductForm from "@/components/products/ProductForm";

const ProductDetails = ({params}: { params: { productId: string } }) => {

    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState<ProductType | null>(null);

    const getProductDetail = async () => {
        try {
            const response = await fetch(`/api/products/${params.productId}`, {
                method: 'GET'
            });
            const data = await response.json();
            setProductDetails(data);
            setLoading(false);
        } catch (error) {
            console.log("[ProductDetail_GET] ", error);
        }
    };

    useEffect(() => {
        getProductDetail();
    }, []);

    return loading ? <Loader/> : (
        <ProductForm
            initialData = {productDetails}
        />
    );
};

export default ProductDetails;