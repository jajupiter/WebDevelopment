'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      <div className='p-3'>
        <h2 className='text-xl'>Account</h2>

        <div className='bg-gray-200 rounded-2xl h-1/6 flex justify-around '>
          <p>status: {account.status}</p>
          <p>addresses: {JSON.stringify(account.addresses)}</p>
          <p>chainId: {account.chainId}</p>
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div className='bg-amber-100 gap-2 p-2' >
        <h2 className='text-2xl p-2'>Connect</h2>
        <div className='flex justify-around'>
          {connectors.map((connector) => (
            <button
              className='bg-black text-white rounded-md hover:bg-gray-700 p-1 '
              key={connector.uid}
              onClick={() => connect({ connector })}
              type="button"
            >
              {connector.name}
            </button>
          ))}
        </div>
        <div className='flex justify-center p-2'>Status: {status}</div>
        <div className='flex justify-center p-1'>{error?.message}</div>
      </div>
    </>
  )
}

export default App
