'use client';

import { useRouter } from 'next/navigation';
import FileUpload from '../../components/FileUpload';

export default function UploadPage() {
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/');
  };

  return <FileUpload onBack={handleBack} />;
}
