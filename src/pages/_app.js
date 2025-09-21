import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="dark">
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Component {...pageProps} />
      </div>
    </div>
  )
}
