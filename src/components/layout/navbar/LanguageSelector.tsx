'use client';
import { SUPPORTED_LANGS } from '@/lib/constants/locale';
import { SupportedLanguage } from '@/types/planet';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Select, { SingleValue, StylesConfig } from 'react-select';

interface LanguageOption {
  label: string;
  value: SupportedLanguage;
}

const languageOptions: LanguageOption[] = SUPPORTED_LANGS.map(lang => ({
  label: lang.toUpperCase(),
  value: lang,
}));

const styles: StylesConfig<LanguageOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: '36px',
    height: '100%',
    background: state.menuIsOpen
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: '0 8px',
    color: 'white',
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'all 0.2s',
    '&:hover': { background: 'rgba(255,255,255,0.2)' },
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: () => ({ display: 'none' }),
  singleValue: base => ({
    ...base,
    color: 'white',
    fontSize: '12px',
    textAlign: 'center',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? 'rgba(255,255,255,0.1)' : 'transparent',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '12px',
    textAlign: 'center',
  }),
  menu: base => ({
    ...base,
    background: 'rgba(15,20,40,0.95)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  }),
  menuList: base => ({ ...base, padding: 0 }),
};

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams<{ locale: SupportedLanguage }>();

  const handleChange = (option: SingleValue<LanguageOption>) => {
    if (!option) return;
    // Replace the current locale prefix in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${option.value}`);
    router.push(newPath);
  };

  return (
    <Select<LanguageOption, false>
      instanceId="language-selector"
      value={languageOptions.find(o => o.value === locale) || null}
      options={languageOptions}
      onChange={handleChange}
      isSearchable={false}
      styles={styles}
    />
  );
};

export default LanguageSelector;
