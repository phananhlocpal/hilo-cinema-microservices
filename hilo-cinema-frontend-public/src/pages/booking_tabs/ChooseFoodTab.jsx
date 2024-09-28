import { useSelector, useDispatch } from "react-redux";
import { selectFood, setFoodList } from "../../redux/actions/bookingAction"; 
import { useState, useEffect } from "react";

const ChooseFoodTab = () => {
  const dispatch = useDispatch();
  const foodList = useSelector((state) => state.booking.foodList); 
  //const selectedFood = useSelector((state) => state.booking.selectedFood);

  //const [foodList, setFoodList] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`http://localhost:8000/FoodService`);
        const data = await response.json();
        console.log(data);
        const enrichedFoodList = data.map(foodItem => ({
          ...foodItem,
          description: 'Large popcorn', 
          quantity: 0, 
          image: 'https://www.simplyrecipes.com/thmb/Xzggu-Md45HKhhYSw4DK8tGlZ_I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Perfect-Popcorn-LEAD-41-4a75a18443ae45aa96053f30a3ed0a6b.JPG',
        }));
        dispatch(setFoodList(enrichedFoodList))
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFood();
  }, [dispatch]);

  const handleFoodSelection = (foodId, quantity) => {
    dispatch(selectFood(foodId, quantity));
  };

  return (
    <div className="col-span-2 xl:order-first order-last xl:h-full h-[full] overflow-hidden xl:overflow-auto xl:pb-10 pb-32">
      <div className="bg-white p-4 md:h-full h-[80vh] overflow-auto">
        <h3 className="text-l mb-4 font-semibold">Chọn Combo</h3>
        <ul className="concession__list">
          {foodList.length > 0 ? (
            foodList.map((foodItem) => (
              <li key={foodItem.id} className="flex mb-5">
                <img 
                  alt={foodItem.name} 
                  loading="lazy" 
                  width="150" 
                  height="100" 
                  decoding="async" 
                  data-nimg="1" 
                  className="inline-block rounded-md  w-[150px] h-[100px] object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" 
                  src={foodItem.image} 
                  style={{ color: "transparent" }} 
                />
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-semibold mb-1">{foodItem.name}</h4>
                  <div className="text-s">{foodItem.description}</div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div>
                      <strong>Giá: </strong>
                      <span className="inline-block font-bold ">
                        {foodItem.price}&nbsp;₫
                      </span>
                    </div>
                    <div className="flex bg-white border-md rounded shadow-qty">
                      <div className="md:py-1 md:px-2 rounded outline-none">
                        <button 
                          className="md:px-2 outline-none"
                          onClick={() =>
                            handleFoodSelection(foodItem.id, foodItem.quantity - 1)
                          }
                        >
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="minus" className="svg-inline--fa fa-minus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                            <path
                              fill="currentColor"
                              d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
                            ></path>
                          </svg>
                        </button>
                        <button className="inline-block px-2 mx-1">
                          {foodItem.quantity}
                        </button>
                        <button
                          className="md:px-2"
                          onClick={() =>
                            handleFoodSelection(foodItem.id, foodItem.quantity + 1)
                          }
                        >
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" className="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" >
                            <path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No food items available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChooseFoodTab;
