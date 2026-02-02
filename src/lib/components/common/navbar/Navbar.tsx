import CardNav from './CardNav';

const items = [
  {
    label: 'FrontEnd',
    bgColor: '#f9f9f9',
    textColor: 'black',
    links: [
      { label: 'HTML', ariaLabel: 'HTML', href: '/roadmap/html' },
      { label: 'CSS', ariaLabel: 'About Careers', href: '/roadmap/css' },
    ],
  },
];

const Navbar = () => {
  return (
    <CardNav
      logoAlt="atom"
      items={items}
      baseColor="#222222"
      menuColor="#fff"
      ease="power3.out"
    />
  );
};

export default Navbar;
