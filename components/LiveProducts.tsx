import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useList } from "react-use";
import * as LiveByAliasType from "types/LiveByAliasType";

interface Props {
	liveId: number;
	products: LiveByAliasType.Product[];
	onClick?: (id: number) => void;
}

const LiveProducts: React.FC<Props> = ({ liveId, onClick, products }) => {
	const [liveProductId, setLiveProductId] = useState<number>(0);

	const listenForProducts = useCallback(async (liveId: number, cbLiveProductId: (id: number) => void) => {
		const db = getFirestore();

		const d = doc(db, "live-" + liveId, "product");
		const unsubscribeProduct = onSnapshot(d, (snapshot) => {
			if (snapshot && snapshot.exists()) {
				const productId = snapshot.data().id;
				cbLiveProductId(productId);
			}
		});

		return () => {
			unsubscribeProduct();
		};
	}, []);

	useEffect(() => {
		listenForProducts(liveId, (id) => {
			setLiveProductId(id);
		});
	});

	return (
		<div className="grid grid-cols-7 gap-4">
			{products.map((product) => (
				<div className="w-16 h-16" onClick={() => onClick && onClick(product.id)} key={product.id}>
					<div>
						<img src={product.imageUrl} alt={product.name} height={64} width="100%" />
					</div>
					<div className="text-lg font-bold">
						{product.price.toLocaleString("pt-BR", {
							currency: "BRL",
							style: "currency",
							currencyDisplay: "symbol",
						})}
					</div>

					<span className="px-2 py-1 mx-auto font-extrabold text-red-600 border border-red-600 rounded-md text-red">
						LIVE
					</span>
				</div>
			))}
		</div>
	);
};

export default LiveProducts;
