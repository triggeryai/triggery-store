import React from 'react';

const GoogleMap: React.FC = () => {
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.9506922538503!2d16.651564415729667!3d50.7280698795139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470e360f94570f5d%3A0x58fbbe4e92e730a1!2sWroc%C5%82awska%2029%2C%2058-200%20Dzierzoni%C3%B3w!5e0!3m2!1sen!2spl!4v1647024587534!5m2!1sen!2spl";

  return (
    <div className="flex flex-wrap items-center justify-center w-full my-20 bg-gray-100 py-10">
      <div className="w-full lg:w-1/2 p-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Nasz sklep stacjonarny
        </h2>
        <p className="text-gray-600">
          Odwiedź nas przy ul. Wrocławska 29, Dzierżoniów, Polska.
        </p>
      </div>
      <div className="w-full lg:w-1/2 p-4">
        <iframe
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapSrc}
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  );
}

export default GoogleMap;
