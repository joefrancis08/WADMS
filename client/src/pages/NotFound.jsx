import { notFoundIcon } from '../assets/icons';

const NotFound = () => {
  return (
    <div className='notfound-container'>
      <div className='notfound-card'>
        <div className='flex justify-center mb-6'>
          <img src={notFoundIcon} alt="Not Found" className='notfound-icon-layout' />
        </div>
        <h1 className='notfound-title'>Page Not Found</h1>
        <p className="mt-4 text-gray-600">Sorry, the page you're looking for does not exist.</p>
        <div className='mt-6'>
          <a href="/" className='notfound-back-button'>
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
