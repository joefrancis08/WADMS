import { useEffect } from 'react';
import { notFoundIcon } from '../assets/icons';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 - Not Found'
  }, [])

  return (
    <div className='notfound-container'>
      <div className='notfound-card'>
        <div className='flex justify-center mb-6'>
          <img src={notFoundIcon} alt="Not Found" className='notfound-icon-layout' />
        </div>
        <h1 className='notfound-title'>Page Not Found</h1>
        <p className="my-5 text-gray-600">Sorry, the page you're looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
