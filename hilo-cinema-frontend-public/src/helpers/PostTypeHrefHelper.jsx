const PostTypeHrefHelper = (type) => {
    if (type === "Bình luận phim") {
        return "/binh-luan-phim";
    }
    if (type === "Tin mới") {
        return "/tin-moi";
    }
    if (type === "Diễn viên") {
        return "/dien-vien"
    }
    if (type === "Ưu đãi") {
        return "/uu-dai";
    }
    if (type === "Phim hay tháng") {
        return "/phim-hay-thang";
    }
};

export default PostTypeHrefHelper;