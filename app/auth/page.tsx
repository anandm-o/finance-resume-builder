import AuthWrapper from '../../components/auth/AuthWrapper';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <AuthWrapper />
      </div>
    </div>
  );
}
