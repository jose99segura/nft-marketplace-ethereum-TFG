
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import ActiveLink from '../link'
import { useAccount, useNetwork } from '@hooks/web3'
import Walletbar from './Walletbar'
import Image from 'next/image'

const navigation = [
  { name: 'Inicio', href: '/', current: true },
  // { name: 'Mercado secundario', href: '/secundario', current: false },
  // { name: 'Crear Ticket', href: '/nft/create', current: false },
  // { name: 'Congreso Online', href: '/congreso', current: false }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {

  const { account } = useAccount();
  const { network } = useNetwork();

  return (
    <Disclosure as="nav" className="bg-sky-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Abrir Menú</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="hidden h-11 w-auto lg:block"
                    src="/images/logo/entra.png"
                    alt="Entrablock"
                    width={100}
                    height={100}
                  />
                  <Image
                    className="hidden h-11 w-auto lg:block"
                    src="/images/logo/block.png"
                    alt="Entrablock"
                    width={100}
                    height={100}
                  />
                  <Image
                    className="hidden h-8 w-auto lg:block"
                    src="/images/logo/logosimp.png"
                    alt="Entrablock"
                    width={100}
                    height={100}
                  />
                  
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <ActiveLink legacyBehavior
                        activeClass="bg-gray-900 text-white"
                        key={item.name}
                        href={item.href}
                        // className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        // aria-current={item.current ? 'page' : undefined}
                      >
                        <a
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      {/* {item.name} */}
                      </ActiveLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

              {/* Aquí mostramos el nombre de la red blockchain donde estamos actualmente */}
              <div className="text-gray-300 self-center mr-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-cyan-100 text-blue-800">
                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  {
                    network.isLoading ?
                    "Cargando...":
                    account.isInstalled ?
                    network.data:
                    "Instale una cartera Web3"
                  }
                </span>

              </div>
                {/* Incrustamos en wallebar donde ver nuestro perfil */}
                <Walletbar 
                  isInstalled = {account.isInstalled}
                  isLoading = {account.isLoading}
                  connect = {account.connect}
                  account = {account.data}
                />
  
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
