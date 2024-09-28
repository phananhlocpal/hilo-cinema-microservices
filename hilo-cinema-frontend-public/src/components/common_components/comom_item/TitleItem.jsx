import PropTypes from 'prop-types';

const TitleItem = ({ title }) => {
    return (
        <div>
            <span className="border-l-4 border-solid border-blue-800 mr-2"></span>
            <h1 className="mb-4 text-xl inline-block uppercase font-medium">
                {title}
            </h1>
        </div>
    );
};

TitleItem.propTypes = {
    title: PropTypes.string.isRequired
}

export default TitleItem;