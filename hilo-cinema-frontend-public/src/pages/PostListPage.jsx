// Import libraries
import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Pagination } from "@mui/material";

// Import helpers
import HrefToTypeHelper from "../helpers/HrefToTypeHelper";

// Import components
import TitleItem from "../components/common_components/comom_item/TitleItem";
import PostItem from "../components/postList_components/Item.jsx/PostItem";
import MovieSuggestionComponent from '../components/common_components/MovieSuggestionComponent';
import BookingComponent from '../components/postList_components/BookingComponent';
// import PostFilterComponent from "../components/postList_components/PostFilterComponent";

const PostListPage = () => {
    const { postTypeHref } = useParams();
    const postType = HrefToTypeHelper(postTypeHref);
    const [postList, setPostList] = useState([]);
    // const [filterList, setFilterList] = useState(exampleFilterList);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const postsPerPage = 5;
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/BlogService/`);
                const result = response.data
                    .filter(post => post.type === postType && post.status === 'Active')
                    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                
                setPostList(result);
                setTotalPage(Math.ceil(result.length / postsPerPage));
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postType]);

    // Calculate the current posts to display based on the current page
    const startIndex = (page - 1) * postsPerPage;
    const currentPosts = postList.slice(startIndex, startIndex + postsPerPage);

    return (
        <div className="grid grid-cols-1 screen1200:grid-cols-6 my-0 mx-auto screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl gap-8 py-7 px-4 lg:px-0">
            <div className="lg:col-span-4">
                <div className="border-b-2 border-blue-10">
                    <TitleItem title={postType}/>
                    <button className="md:hidden mb-5 block text-center w-full border border-[#D0D0D0] rounded bg-white h-11 font-semibold text-sm not-italic text-[#333333] transition-all duration-300 focus:outline-none focus:bg-transparent">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sliders" className="svg-inline--fa fa-sliders " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
                            <path fill="currentColor" d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" ></path>
                        </svg>{" "}
                        Phân loại / Lọc
                    </button>
                    {/* <PostFilterComponent listFilter={filterList}/> */}
                    <div className="bg-[#343a40] opacity-60 fixed top-0 right-0 bottom-0 z-[1000] overflow-y-scroll left-0 w-full h-full transition-all duration-500 ease-in-out hidden screen1200:hidden"></div>
                </div>
                <div className="my-8">
                    <ul className="post__list">
                        {currentPosts.map(post => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </ul>
                    <div className="block md:block mt-8">
                        <Pagination 
                            count={totalPage} 
                            color="primary" 
                            page={page}
                            onChange={(event, value) => setPage(value)}
                        />
                    </div>
                </div>
            </div>
            <div className="hidden screen1200:block lg:col-span-2">
                <div className="card w-full h-auto mb-8">
                    <TitleItem title="MUA VÉ NHANH"/>
                    <BookingComponent />
                </div>
                <MovieSuggestionComponent/>
            </div>
        </div>
    );
};

export default PostListPage;
