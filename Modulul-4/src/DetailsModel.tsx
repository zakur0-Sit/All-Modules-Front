import React from 'react';
import { hideDetails } from './helpers';

interface DetailsModelProps {
  title: string;
  images: string[];
  texts: string[];
  altTableContent: string[];
  prices: string;
  onClose: () => void;
}

const DetailsModel: React.FC<DetailsModelProps> = ({ title, images, texts, altTableContent, prices, onClose }) => {
  return (
    <div id="detailsModel" className="model">
      <div className="model-content">
        <span className="close" onClick={hideDetails}>&times;</span>
        <div id="imageGallery" className="image-gallery">
          {images.map((image, index) => (
            <img key={index} src={image} alt={title} />
          ))}
        </div>
        <div id="textGallery" className="text-gallery">
          {texts.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
        <div id="altTable" className="alt-table">
          {altTableContent.map((content, index) => (
            <p key={index}>Price: {content}</p>
          ))}
        </div>
        <div className="bottom-container">
          <button className="back-button" onClick={hideDetails}>Back to Shopping List</button>
          <p>Additional Text</p>
        </div>
      </div>
    </div>
  );
}

export default DetailsModel;