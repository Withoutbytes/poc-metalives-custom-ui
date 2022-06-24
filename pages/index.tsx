import type { NextPage } from "next";
import Layout from "components/Layout";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { getLiveByAlias } from "lib/api";
import LiveChat from "components/LiveChat";
import LiveProducts from "components/LiveProducts";
import useSWR from "swr";
import { useRouter } from "next/router";

const ReactHlsPlayer = dynamic(() => import("react-hls-player"), {
	// React hsl player not supported in SSR;
	ssr: false,
});

const Home: NextPage = () => {
	const playerRef = useRef<HTMLVideoElement>(null);

	const router = useRouter();

	const { data: live, error: liveError } = useSWR(
		{ live: router.query.live, org: router.query.org },
		getLiveByAlias
	);

	return (
		<Layout>
			{/* <h1>POC metalioves</h1> */}
			{liveError && <p className="text-red-600">Error: {liveError.message}</p>}
			{live ? (
				<div className="relative font-semibold text-sky-600">
					{/* title */}
					<div className="absolute top-0 z-30">
						<h1>{live.title}</h1>
						<h2>{live.description}</h2>
					</div>

					{/* products */}
					<div className="absolute left-0 z-30">
						<LiveProducts liveId={live.id} products={live.products} />
					</div>

					{/* chat */}
					{live.chatEnabled && (
						<div className="absolute bottom-0 z-30 p-4">
							<LiveChat liveId={live.id} />
						</div>
					)}

					{/* player */}
					<div className="h-full bg-slate-800">
						<ReactHlsPlayer
							// src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
							src={live.streamUrl}
							autoPlay={true}
							controls={false}
							playsInline={true}
							width="100%"
							playerRef={playerRef}
							muted={true}
						/>
					</div>
				</div>
			) : (
				<p>Loading....</p>
			)}
		</Layout>
	);
};

export default Home;
