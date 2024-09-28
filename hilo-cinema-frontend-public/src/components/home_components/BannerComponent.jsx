import { Carousel } from '@material-tailwind/react';
import PropTypes from 'prop-types';

export function CarouselDefault( {page} ) {
  var carouselImages = []
  if (page === 'home') {
    carouselImages = [
      'https://cdn.galaxycine.vn/media/2024/8/8/lam-giau-voi-ma-2048_1723108931285.jpg',
      'https://cdn.galaxycine.vn/media/2024/8/16/ma-da-2048_1723799769236.jpg',
      'https://cdn.galaxycine.vn/media/2024/8/12/harold-2048_1723454887262.jpg',
      'https://cdn.galaxycine.vn/media/2024/7/31/shopee-x-glx-thang-8-1_1722438044809.jpg'
    ]
  }
  if (page === 'theater') {
    carouselImages = [
      'https://cdn.galaxycine.vn/media/2024/8/8/lam-giau-voi-ma-2048_1723108931285.jpg',
      'https://cdn.galaxycine.vn/media/2024/8/16/ma-da-2048_1723799769236.jpg',
      'https://cdn.galaxycine.vn/media/2024/8/12/harold-2048_1723454887262.jpg',
      'https://cdn.galaxycine.vn/media/2024/7/31/shopee-x-glx-thang-8-1_1722438044809.jpg'
    ]
  }  
  
  return (
    <Carousel className="rounded-xl">
      {carouselImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`image ${index + 1}`}
          className="h-full w-full object-cover"
        />
      ))}
    </Carousel>
  );
}

CarouselDefault.propTypes = {
  page: PropTypes.string
}