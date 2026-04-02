import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="neon-panel p-8 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">404</p>
      <h1 className="neon-heading mt-2 font-['Anton'] text-3xl font-bold">Page not found</h1>
      <Link to="/" className="neon-btn mt-5 inline-block text-sm">
        Back Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
