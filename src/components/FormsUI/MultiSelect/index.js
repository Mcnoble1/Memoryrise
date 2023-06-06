import { default as ReactSelect } from "react-select";
import { components } from "react-select";

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};

const MultiSelectWrapper = ({
    handleChange,
    optionSelected,
    inputOptions
}) => {

    return (
        <span
            className="d-inline-block"
            data-toggle="popover"
            data-trigger="focus"
            data-content="Please selecet account(s)"
        >
            <ReactSelect
                options={inputOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                    Option
                }}
                onChange={handleChange}
                allowSelectAll={true}
                value={optionSelected}
            />
        </span>    
    )

}

export default MultiSelectWrapper;