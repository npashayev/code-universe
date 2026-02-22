import HomeLink from '@/components/shared/HomeLink';
import AddPlanetLink from '../../components/AddPlanetLink';

const Header = () => {
  return (
    <header className="admin-page-header">
      <div className="flex items-center gap-6">
        <HomeLink className="h-10" />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <AddPlanetLink />
      </div>
    </header>
  );
};

export default Header;
