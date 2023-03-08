
/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next';
import { BaseLayout, NftList } from '@ui';

const Home: NextPage = () => {

  return (
    <BaseLayout>
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Tickets destacados de La Liga NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              La liga española de fútbol ofrece la posibilidad de adquirir los tickets NFT y poder ver los partidos de forma online o presencial.
            </p>
          </div>
          
          {/* Mostramos la lista de los nft, que contiene los items */}
          <NftList 
          evento="La Liga NFTs"
          />

        </div>
      </div>

      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Destacados de Congreso Programación NFTs</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Entradas virtuales para acceder al evento Congreso XIII de programación. Cada categoría recibirá diferentes ventajas de posición y extras.
            </p>
          </div>
          
          {/* Mostramos la lista de los nft, que contiene los items */}
          <NftList 
          evento="Congreso Programación NFTs"
          />

        </div>
      </div>
    </BaseLayout>
  )
}

export default Home