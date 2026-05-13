import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CardHouse from '@/components/CardHouse';
import { useRouter } from 'next/router';

function HomesList({ searchResults }) {
  const router = useRouter();
  const { location } = router.query;

  return (
    <div className="bg-slate-50">
      <Header />
      <div>
        <main className="flex">
          <section className="flex-grow pt-14 px-6">
            <div className="h-screen text-black text-xs">
              <h1 className="text-3xl font-semibold mb-6">{location}</h1>
              <div className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap">
                <p className="button">Type</p>
                <p className="button">Price</p>
                <p className="button">Filters</p>
              </div>
              <div className="flex flex-col">
                {searchResults && searchResults.map(({
                  id_biens,
                  description,
                  type_bien,
                  adresse,
                  ville,
                  prix_estime,
                  etat,
                }) => (
                  <CardHouse
                    key={id_biens}
                    description={description}
                    type_bien={type_bien}
                    adresse={adresse}
                    ville={ville}
                    prix_estime={prix_estime}
                    etat={etat}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default HomesList;
