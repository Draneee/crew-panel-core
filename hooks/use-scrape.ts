import { useState, useEffect, useRef } from 'react';

const useScrape = () => {
  const recaptchaRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageSrc = async () => {
      try {
        const response = await fetch(
          'http://localhost:5555/puppeteer/image-src'
        );
        const data = await response.json();
        setImageSrc(data.imageSrc);
        // recaptchaRef.current.execute();
      } catch (err: any) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImageSrc();
  }, []);
  const onCaptchaChange = (value: any) => {
    console.log('Captcha value:', value);
    // Here you can handle the captcha value
  };

  return { imageSrc, loading, error, recaptchaRef, onCaptchaChange };
};

export default useScrape;
