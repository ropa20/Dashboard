import { ErrorMessage, Field } from 'formik';
import React, { useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useSetState } from 'utils/functions.utils';
import ValidationError from '../error/error.ui';

interface CustomCreatableSelectProps {
  values: any;
  className?: string;
  placeholder: string | number;
  name: string;
  handleCreate: any;
  onChange?: any;
  initialValue?: number | string;
}

const CustomCreatableSelect = (props: CustomCreatableSelectProps) => {
  const {
    values,
    onChange,
    className,
    placeholder,
    name,
    handleCreate,
    initialValue,
  } = props;

  const [state, setState] = useSetState({
    value: { label: `${initialValue}`, value: initialValue },
    option: values,
  });
  useEffect(() => {
    setState({ option: values });
  }, [values]);

  const handleChange = (option, form, field) => {
    setState({ value: option });
    form.setFieldValue(field.name, option.value);
    onChange(option.value);
  };
  const handleSetCreateValue = async (createValue, form, field) => {
    const value = await handleCreate(createValue);
    if (value) {
      setState({
        option: [...values, value],
        value,
      });
      form.setFieldValue(field.name, value.value);
      onChange(value.value);
    }
  };

  const customStyle = {
    container: (style) => ({
      ...style,
      outline: 'none',
    }),
    control: (style, states) => ({
      ...style,
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: '600',
      padding: '',
      borderRadius: '10px',
      outline: 'none',
      height: '46px',
      ':hover': {
        border: '3px solid #d4af37',
      },
      border: states.isFocused ? '3px solid #d4af37' : '3px solid #e4e4e4',
    }),
    option: (style) => ({
      ...style,
      fontSize: '14px',
      fontWeight: '600',
      padding: '1em',
      width: '100%',
      borderRadius: '10px',
    }),
    menu: (style) => ({
      ...style,
      borderRadius: '10px',
    }),
  };

  return (
    <div className="select_container">
      <Field name={name}>
        {(fieldProps) => {
          const { field, form } = fieldProps;
          return (
            <CreatableSelect
              className={`${className} select_input`}
              name={field.name}
              isClearable={false}
              onChange={(e) => handleChange(e, form, field)}
              options={state.option.length === 0 ? values : state.option}
              styles={customStyle}
              placeholder={placeholder}
              onCreateOption={(value) =>
                handleSetCreateValue(value, form, field)
              }
              value={state.value}
              components={{ IndicatorSeparator: () => null }}
            />
          );
        }}
      </Field>
      <ErrorMessage name={name} component={ValidationError} />
    </div>
  );
};

CustomCreatableSelect.defaultProps = {
  className: '',
  onChange: () => {},
  initialValue: '',
};

export default CustomCreatableSelect;
