'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CiFolderOn, CiLocationOn, CiSettings } from 'react-icons/ci';
import { PiNotepadLight, PiYoutubeLogoThin } from 'react-icons/pi';
import Gallery from '@/app/components/Gallery';
import Breadcrumb from '@/app/components/Breadcrumb';
import api from '@/app/Services/api';


const DetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('folder');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);

        const fetchedProperty = Array.isArray(res.data?.data)
          ? res.data.data[0]
          : res.data;

        setProperty(fetchedProperty);
      } catch (err) {
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  // ✅ Don't render anything until property is loaded
  if (loading) return <p className='px-24'>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  // ✅ Now it's safe to destructure
  const {
    title,
    price,
    location,
    description,
    bedrooms,
    bathrooms,
    areaSize,
    garage,
    yearBuilt,
    propertyType,
    propertyStatus,
    images,
  } = property;

  return (
    <>
      <Gallery images={images} />
      <section className="bg-bgGray">
        <div className="lg:container mx-auto py-14">
          <div className="lg:px-0 px-5">
            <Breadcrumb />
            <div className="flex lg:justify-between lg:items-center lg:flex-row flex-col ">
              <h3 className="text-[30px] font-bold font-nokara my-3">{title}</h3>
              <span className="text-[30px] font-bold">${price}</span>
            </div>
            <div className="flex items-center gap-2 lg:mt-0 mt-3">
              <CiLocationOn />
              <span className="text-sm font-normal text-lightGray ">{location}</span>
            </div>
          </div>

          <section className="pt-10">
            <div className="flex bg-white">
              {/* Left tab nav */}
              <div className="tab flex flex-col items-center lg:w-[10%] md:w-[10%] w-[20%]">
                {['folder', 'details', 'features', 'video'].map((tab) => (
                  <div
                    key={tab}
                    className={`tablinks block w-full p-4 text-lg transition duration-300 ${
                      activeTab === tab ? 'bg-gray-300' : 'hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {{
                      folder: <CiFolderOn className="w-8 h-8 mx-auto" />,
                      details: <PiNotepadLight className="w-8 h-8 mx-auto" />,
                      features: <CiSettings className="w-8 h-8 mx-auto" />,
                      video: <PiYoutubeLogoThin className="w-8 h-8 mx-auto" />,
                    }[tab]}
                  </div>
                ))}
              </div>

              {/* Right tab content */}
              <div className="tabcontent lg:w-[95%] md:w-[95%] w-[80%] py-4 lg:px-7 px-5">
                {activeTab === 'folder' && (
                  <div id="folder">
                    <h3 className="text-xl font-bold mt-5 mb-8">Description</h3>
                    <hr className="pb-5" />
                    <p className="text-base font-normal text-lightBlack">{description}</p>
                  </div>
                )}
                {activeTab === 'details' && (
                  <div id="details">
                    <h3 className="text-xl font-bold mt-5 mb-4">Details</h3>
                    <hr className="pb-5" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p><strong>Bedrooms:</strong> {bedrooms}</p>
                      <p><strong>Bathrooms:</strong> {bathrooms}</p>
                      <p><strong>Area Size:</strong> {areaSize}</p>
                      <p><strong>Garage:</strong> {garage}</p>
                      <p><strong>Year Built:</strong> {yearBuilt}</p>
                      <p><strong>Type:</strong> {propertyType}</p>
                      <p><strong>Status:</strong> {propertyStatus || 'N/A'}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'features' && <p>Feature content...</p>}
                {activeTab === 'video' && <p>Video content...</p>}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default DetailPage;
