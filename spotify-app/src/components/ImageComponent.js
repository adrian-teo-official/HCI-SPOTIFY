import React from 'react'

function ImageComponent({ imageSrc, width, height }) {
    return (
        <div className="card-img-top float-left" style={{ width: `${width}px`, height: `${height}px` }}>
          <img src={imageSrc} alt="My Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
}

export default ImageComponent;
