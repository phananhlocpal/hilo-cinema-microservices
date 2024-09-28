import FilterItem from './Item.jsx/FilterItem';
import PropTypes from 'prop-types';

const PostFilterComponent = ({ listFilter }) => {
    return (
        <div className="hidden md:grid gap-1 lg:gap-2 pb-4 border-b border-[#034EA2] grid-cols-5">
            {listFilter.map((item, index) => {
                console.log(item.FilterValue); // Logging outside JSX
                return <FilterItem key={index} options={item.FilterValue} filterTitle={item.FilterName} />;
            })}
        </div>
    );
};

PostFilterComponent.propTypes = {
    listFilter: PropTypes.array,
}

export default PostFilterComponent;
