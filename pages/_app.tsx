import "styles/globals.css";
import type { AppProps } from "next/app";
import firebaseConfig from "lib/firebase";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		initializeApp(firebaseConfig);
	}, []);

	return <Component {...pageProps} />;
}

export default MyApp;
