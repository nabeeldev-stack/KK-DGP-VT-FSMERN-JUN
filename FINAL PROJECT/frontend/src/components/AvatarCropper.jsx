import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaCrop, FaCheck, FaTimes } from "react-icons/fa";

function AvatarCropper({ imageSrc, onCropComplete, onCancel }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImg = useCallback((imageSrc, pixelCrop) => {
        const image = new Image();
        image.src = imageSrc;
        
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Set canvas size to 200x200 for avatar
                canvas.width = 200;
                canvas.height = 200;

                // Draw cropped image
                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    200,
                    200
                );

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Canvas is empty"));
                            return;
                        }
                        resolve(blob);
                    },
                    "image/jpeg",
                    0.9
                );
            };
            image.onerror = (error) => {
                reject(error);
            };
        });
    }, []);

    const handleCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (error) {
            console.error("Error cropping image:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-[#1a0000] via-[#0a0a0b] to-[#120000] rounded-2xl border border-red-500/20 p-6 max-w-2xl w-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FaCrop className="text-red-400" />
                        Crop Your Avatar
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                <div className="relative h-96 bg-black/50 rounded-lg overflow-hidden mb-4">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropCompleteHandler}
                        showGrid={true}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Zoom
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-red-500/20 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                        <FaTimes />
                        Cancel
                    </button>
                    <button
                        onClick={handleCrop}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                    >
                        <FaCheck />
                        Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AvatarCropper;