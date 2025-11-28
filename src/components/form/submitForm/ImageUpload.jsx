import React, { useState, useRef } from 'react';
import { FaUpload } from 'react-icons/fa';

const ImageUpload = ({ images, setImages }) => {
    let safeImages = Array.isArray(images) ? images : [];

    const dragItem = useRef(null); // from index
    const dragOverItem = useRef(null); // to index

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter(file =>
            ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
        );

        const maxAllowed = 7 - safeImages.length;
        if (maxAllowed <= 0) {
            alert("You can upload a maximum of 7 images.");
            return;
        }

        const limitedImages = validImages.slice(0, maxAllowed).map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages([...safeImages, ...limitedImages]);
    };


    const handleImageRemove = (index) => {
        const newImages = [...safeImages];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSort = () => {
        const updatedImages = [...safeImages];
        const draggedItem = updatedImages.splice(dragItem.current, 1)[0];
        updatedImages.splice(dragOverItem.current, 0, draggedItem);
        dragItem.current = null;
        dragOverItem.current = null;
        setImages(updatedImages);
    };

    return (
        <div>
            <label className="block font-medium mb-1">Upload Images (Upto 7)</label>

            <div className="relative border-dashed border-2 border-gray-300 p-4 rounded-md bg-gray-50">
                <input
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    multiple
                    onChange={handleImageUpload}
                    className="absolute top-0 left-0 h-full w-full opacity-0"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center text-gray-500"
                >
                    <FaUpload className="text-3xl mb-2" />
                    <span>Click to Upload Images</span>
                </label>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {safeImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative group border rounded-md overflow-hidden"
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <img
                            src={image.preview}
                            alt="Uploaded"
                            className="w-full h-32 object-cover cursor-move"
                        />
                        <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 p-1 text-xs"
                            onClick={() => handleImageRemove(index)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
