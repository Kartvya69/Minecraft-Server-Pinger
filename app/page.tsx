import ServerPinger from "./components/server-pinger"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <ServerPinger />
    </main>
  )
}

