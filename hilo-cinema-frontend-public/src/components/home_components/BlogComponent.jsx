import { ExpandMore, ThumbUp, Visibility } from "@mui/icons-material";
import { useEffect, useState } from 'react';
import axios from 'axios';
import slugify from 'slugify';

const BlogComponent = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        // Fetching blogs from the API
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/BlogService');
                const allBlogs = response.data;
                console.log(allBlogs);
                // Filter and sort blogs
                const filteredBlogs = allBlogs.filter(blog => blog.type === 'Bình luận phim' && blog.status === 'Active');
                const sortedBlogs = filteredBlogs.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 4);

                setBlogs(sortedBlogs);
                console.log(sortedBlogs);
                console.log(sortedBlogs[0].id)
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div>
            <div className="my-0 mx-auto pb-8 screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl md:px-4 sm:px-[45px] px-[16px]">
                <div className="md:text-center transition-all duration-300">
                    <div className="mt-8">
                        <article className="grid md:grid-cols-2 md:gap-x-6 gap-4">
                            {/* First blog post */}
                            {blogs[0] && (
                                <a className="flex flex-col gap-y-4">
                                    <aside className="max-h-[476px] group transition-all duration-300 ease-in-out md:hover:text-blue-10">
                                        <a href={`/binh-luan-phim/${blogs[0].id}/${slugify(blogs[0].title, { lower: true, strict: true })}/`}>
                                            <img alt={blogs[0].title} loading="lazy" width="445" height="300" decoding="async" data-nimg="1" className="rounded-lg md:rounded md:w-full w-full h-[232px] md:h-[215px] lg:h-[300px] xl:h-full max-h-[400px] group-hover:md:scale-105 transition-all object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={`data:image/jpeg;base64,${blogs[0].img}`} />
                                        </a>
                                        <aside className="descriptions text-left mt-4 md:mt-7">
                                            <a className="text-xl font-bold md:hover:text-blue-10 transition-all duration-300 overflow-hidden" href={`/binh-luan-phim/${blogs[0].id}/${slugify(blogs[0].title, { lower: true, strict: true })}/`}>{blogs[0].title}</a>
                                            <div className="card__votes flex mt-2">
                                                <button type="button" className="h-[25px] text-xs text-white hover:text-white mr-2 bg-blue-400 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 rounded px-3">
                                                    <ThumbUp style={{ fontSize: 14 }}/>
                                                    Thích
                                                </button>
                                                <button className="text-xs text-black-10 bg-gray-400 h-[25px] rounded mr-2 px-3 hover:text-black-10">
                                                    <Visibility style={{ fontSize: 14 }} />
                                                    100
                                                </button>
                                            </div>
                                        </aside>
                                    </aside>
                                </a>
                            )}

                            {/* Remaining blog posts */}
                            <article className="flex flex-col gap-y-4">
                                {blogs.slice(1).map((blog, index) => (
                                    <aside key={index} className="flex gap-x-2 w-full max-h-[80px] md:max-h-[150px] group transition-all duration-300 ease-in-out md:hover:text-blue-10">
                                        <a className="w-[30%] md:w-[35%]" href={`/binh-luan-phim/${blog.id}/${slugify(blog.title, { lower: true, strict: true })}/`}>
                                            <img alt={blog.title} loading="lazy" width="195" height="150" decoding="async" data-nimg="1" className="rounded-lg md:rounded md:w-[195px] md:h-full w-[120px] h-[75px] group-hover:md:scale-105 transition-all object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0" src={`data:image/jpeg;base64,${blog.img}`}  />
                                        </a>
                                        <aside className="mt-0 descriptions title__movie text-left w-[70%] md:w-[65%] leading-7">
                                            <a className="text-sm md:text-base xl:text-xl font-normal md:font-bold hover:text-blue-10 transition-all duration-300 overflow-hidden leading-5" href={`/binh-luan-phim/${blog.id}/${slugify(blog.title, { lower: true, strict: true })}/`}>{blog.title}</a>
                                            <div className="card__votes flex mt-2">
                                                <button type="button" className="h-[25px] text-xs text-white hover:text-white mr-2 bg-blue-400 hover:bg-blue-800 focus:ring-1 focus:ring-blue-300 rounded px-3">
                                                    <ThumbUp style={{ fontSize: 14 }}/>
                                                    <span className="ml-2">Thích</span>
                                                </button>
                                                <button className="text-xs text-black bg-gray-400 h-[25px] rounded mr-2 px-3 hover:text-black-10">
                                                    <Visibility style={{ fontSize: 14 }}/>
                                                    <span className="ml-2">100</span>
                                                </button>
                                            </div>
                                        </aside>
                                    </aside>
                                ))}
                            </article>
                        </article>
                        <div className="text-center mt-12  transition-all duration-300 ease-in-out">
                            <a type="button" className="text-[#f26b38] hover:text-white w-40 border border-[#fb9440] hover:bg-[#fb9440] transition-all duration-300 focus:ring-1 focus:outline-none focus:ring-[#fb9440] rounded text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#fb9440] dark:focus:ring-[#fb9440] mr-2 mb-2 justify-center" href="/binh-luan-phim/">Xem thêm
                                <ExpandMore />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogComponent;
