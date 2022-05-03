import React , {useState, useEffect} from 'react'
import Cropper from "react-easy-crop";

import getCroppedImg from "./cropImage"

const aspectRatios = [
    {value:16/9, text:"16/9"},
]

const ImageCropDialog = ({id, imageUrl, cropInit, zoomInit, aspectInit, onCancel, setCroppedImageFor, resetImage}) => {
    if(zoomInit == null) {
        zoomInit=1
    }
    if(cropInit == null) {
        cropInit={x:0, y:0}
    }
    if(aspectInit == null) {
        aspectInit = aspectRatios[0];
    }


    const [zoom, setZoom] = useState(zoomInit);
    const [crop, setCrop] = useState(cropInit);
    const [aspect, setAspect] = useState(aspectInit);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    }

    const onAspectChange = (e) =>{
        const value = e.target.value;
        const ratio = aspectRatios.find(ratio=>ratio.value == value);
        setAspect(ratio);
    }

    const onCropComplete = (croppArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    const onCrop = async () =>{
        const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
        setCroppedImageFor(id,crop,zoom,aspect,croppedImageUrl);
    }

    const onResetImage = () => {
        resetImage(id)
    }


    return (
        <div>
            <div className="backdrop"></div>
            <div className="cropContainer z-10">
                <Cropper 
                image={imageUrl} 
                zoom={zoom} 
                crop={crop}
                aspect={aspect.value}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
                />
            </div>
            <div className="controls">
                <div className="controls-upper-area mt-4">
                    <input 
                    type="range" 
                    className="slider" 
                    min={1} 
                    max={3} 
                    step={0.1} 
                    value={zoom} 
                    onInput={
                        (e)=>{
                            //console.log(e.target.value);
                            onZoomChange(e.target.value);
                        }
                    } />
                    <select onChange={onAspectChange}>
                        {aspectRatios.map(ratio=>
                            <option 
                            key={ratio.text} 
                            value={ratio.value} 
                            selected={ratio.value===aspect.value}>
                                {ratio.text}
                            </option>
                        )}
                    </select>
                </div>
                <div className="button-area text-center mt-2">
                    <button onClick={onCancel} className="mx-5 text-xs px-5 py-1 bg-transparent text-blue-600 border-2 border-blue-600 rounded-full">Cancel</button> 
                    <button onClick={onResetImage} className="mx-5 text-xs px-5 py-1 bg-transparent text-blue-600 border-2 border-blue-600 rounded-full">Reset</button> 
                    <button onClick={onCrop} className="mx-5 text-xs px-5 py-1 bg-transparent text-blue-600 border-2 border-blue-600 rounded-full">Crop</button>
                </div>
            </div>
        </div>
    )
}

export default ImageCropDialog
