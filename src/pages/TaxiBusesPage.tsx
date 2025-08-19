import React from 'react';
import ModelsList from '../components/ModelsList';

const TaxiBusesPage: React.FC = () => (
  <div className='py-20'>
    <div className='max-w-7xl mx-auto px-6'>
      <h1 className='text-3xl font-bold text-indigo-700 mb-6'>Taxi / Buses</h1>
      <p className='text-slate-600 mb-8 text-sm'>Browse available buses or request a taxi. (Taxi request form placeholder)</p>
      <ModelsList defaultType='bus' />
    </div>
  </div>
);
export default TaxiBusesPage;
