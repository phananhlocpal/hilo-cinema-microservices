
const HrefToTypeHelper = (href) => {
    if (href === "binh-luan-phim") {
        return "Bình luận phim";
    }
    if (href === "tin-moi") {
        return "Tin mới";
    }
    if (href === "dien-vien") {
        return "Diễn viên";
    }
    if (href === "uu-dai") {
        return "Ưu đãi";
    }
    if (href === "phim-hay-thang") {
        return "Phim hay tháng"
    }
};

export default HrefToTypeHelper;