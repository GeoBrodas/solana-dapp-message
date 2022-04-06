import Head from 'next/head'
import MainComp from '../components/MainComp'

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Solana Messg</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainComp />
    </div>
  )
}

export default Home
