import Head from "next/head";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="layout">
			<Head>
				<title>POC Metalives</title>
				<meta name="description" content="POC Metalives" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>{children}</main>
		</div>
	);
};

export default Layout;
