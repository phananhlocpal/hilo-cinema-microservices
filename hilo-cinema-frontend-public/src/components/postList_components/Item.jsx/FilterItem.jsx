import PropTypes from 'prop-types';
import Select from 'react-dropdown-select';
const FilterItem = ({ options , filterTitle}) => {
    return (
        <div className="flex-auto">
            <div>
            <Select
                options={options}
                labelField="name"
                valueField="id"
                onChange={(values) => this.setValues(values)}
                searchable={false} 
                placeholder={filterTitle}
                
            />
            </div>
        </div>
    );
};

FilterItem.propTypes = {
    options:PropTypes.array,
    filterTitle:PropTypes.string,
}

export default FilterItem;