import { useState, useEffect } from 'react';

const useScrape = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageSrc = async () => {
      try {
        const response = await fetch('/api/logo');
        const data = await response.json();
        setImageSrc(data.imageSrc);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImageSrc();
  }, []);

  return { imageSrc, loading, error };
};

export default useScrape;
