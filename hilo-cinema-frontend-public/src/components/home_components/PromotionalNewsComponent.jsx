import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import axios from "axios";
import slugify from 'slugify';

const PromotionalNewsComponent = () => {
  const [promotionNews, setPromotionNews] = useState([]);
  
    useEffect(() => {
      const fetchPromotionNews = async () => {
        try {
          const response = await axios.get('http://localhost:8000/BlogService');

          // Lọc và sắp xếp tin tức khuyến mãi
          const promotionNews = response.data.filter(blog => blog.type === 'Ưu đãi' && blog.status === 'Active');
          const sortedPromotionNews = promotionNews.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 8);

          setPromotionNews(sortedPromotionNews);
        } catch (error) {
          console.error('Error fetching promotion news:', error);
        }
      };
  
      fetchPromotionNews();
    }, []);

  const promotionalNews = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  return (
    <div className="container mx-auto mt-10">
      <Carousel
        autoPlay={true}
        autoPlaySpeed={2000}
        infinite={true}
        showDots={false}
        removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
        responsive={promotionalNews}
      >
        {promotionNews.map((v, index) => (
          <Link key={index} href={`/khuyen-mai/${slugify(v.title, { lower: true, strict: true })}`}>
            <div className="text-center mx-2">
              <img src={`data:image/jpeg;base64,${v.img}`} style={{width: "100%", height:"200px", objectFit:"cover"}} alt={v.title} />
              <p className="font-medium text-base mt-2">{v.title}</p>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default PromotionalNewsComponent;