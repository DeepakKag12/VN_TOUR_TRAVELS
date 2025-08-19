import React from 'react';
import ModelsList from '../components/ModelsList';

const TourPackagesPage: React.FC = () => (
  <div className='py-20'>
    <div className='max-w-7xl mx-auto px-6'>
      <h1 className='text-3xl font-bold text-indigo-700 mb-6'>Tour Packages</h1>
      <p className='text-slate-600 mb-8 text-sm'>Explore curated tour options.</p>
      <ModelsList defaultType='tour' />
    </div>
  </div>
);
export default TourPackagesPage;
