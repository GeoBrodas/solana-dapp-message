import { useEffect, useState } from 'react'
import Dashboard from './Dashboard'

function MainComp() {
  const [walletAddress, setWalletAddress] = useState(null)

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!')

          const response = await solana.connect({ onlyIfTrusted: true })
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          )

          setWalletAddress(response.publicKey.toString())
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  const connectWallet = async () => {
    const { solana } = window

    if (solana) {
      const response = await solana.connect()
      console.log('Connected with Public Key:', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  }

  const renderNotConnectedContainer = () => (
    <button className="btn" onClick={connectWallet}>
      Connect to Wallet
    </button>
  )

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <p className="my-4 text-3xl font-bold text-white">
        Send me a message through Solana!
      </p>
      {!walletAddress ? (
        renderNotConnectedContainer()
      ) : (
        <Dashboard walletAddress={walletAddress} />
      )}
    </main>
  )
}

export default MainComp
