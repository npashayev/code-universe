import { CSSObjectWithLabel, StylesConfig } from 'react-select';

export const getAdminPageSelectStyles = <T>({
  controlStyles = {},
}: {
  controlStyles?: Partial<CSSObjectWithLabel>;
} = {}): StylesConfig<T, false> => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: state.isFocused
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(255,255,255,0.1)',
    boxShadow: 'none',
    minHeight: '30px',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    paddingLeft: '1.75rem',
    fontSize: '0.75rem',
    paddingInline: '30px',
    fontWeight: 700,
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.2)',
    },
    ...controlStyles,
  }),

  valueContainer: base => ({
    ...base,
    padding: '0 0.25rem',
  }),

  singleValue: base => ({
    ...base,
    color: 'white',
  }),

  input: base => ({
    ...base,
    color: 'white',
  }),

  placeholder: base => ({
    ...base,
    color: 'rgba(255,255,255,0.5)',
  }),

  menu: base => ({
    ...base,
    backgroundColor: '#020617',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  }),

  menuList: base => ({
    ...base,
    padding: '0.25rem',
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? 'rgba(249,115,22,0.15)'
      : state.isSelected
        ? 'rgba(249,115,22,0.25)'
        : 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 700,
    borderRadius: '0.25rem',
    transition: 'all 0.15s',
    '&:active': {
      backgroundColor: 'rgba(249,115,22,0.3)',
    },
  }),

  indicatorSeparator: () => ({
    display: 'none',
  }),

  dropdownIndicator: () => ({
    display: 'none',
  }),
});
