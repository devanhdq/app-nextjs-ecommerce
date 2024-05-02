import {CldUploadWidget} from 'next-cloudinary';
import {Plus, Trash} from "lucide-react";

import {Button} from "@/components/ui/button";
import React from "react";
import Image from "next/image";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (index: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({onChange, onRemove, value}) => {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url, index) => (
                    <div key={index}
                         className="relative">
                        <div className="absolute top-0 right-0 z-10">
                            <Button onClick={() => onRemove(url)}
                                    size="sm"
                                    className="bg-red-500 text-white"
                            >
                                <Trash className={"h-4 w-4"}/>
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt="collections"
                            className="object-cover rounded-lg"
                            width={200}
                            height={200}/>
                    </div>
                ))}
            </div>
            <CldUploadWidget
                uploadPreset="qqmwfadt"
                onUpload={onUpload}>
                {({open}) => {
                    return (
                        <Button onClick={() => open()} className="bg-grey-1 text-white">
                            <Plus className="h-4 w-4 mr-2"/> Upload an Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;