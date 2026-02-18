import Link from 'next/link';

const DashboardLink = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all"
    >
      Dashboard
    </Link>
  );
};

export default DashboardLink;
